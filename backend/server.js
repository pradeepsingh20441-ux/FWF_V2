import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import { body, validationResult } from 'express-validator';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_me_secret';
const ORG_PREFIX = process.env.ORG_PREFIX || 'FWF';

// Static site root one level up from backend/
const siteRoot = path.resolve(__dirname, '..');

// ============================================
// 🔒 SECURITY MIDDLEWARE
// ============================================

// 1. Helmet - Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// 2. CORS - Control cross-origin requests
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 3. Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { ok: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: { ok: false, error: 'Too many login attempts, please try again after 15 minutes.' },
  skipSuccessfulRequests: true,
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);
app.use('/api/admin/login', authLimiter);

// 4. Body parser with size limits
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Data sanitization against NoSQL injection
app.use(mongoSanitize());

// 6. Data sanitization against XSS
app.use(xss());

// 7. Prevent parameter pollution
app.use(hpp());

// 8. Static files
app.use(express.static(siteRoot));

// --- DB setup ---
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, 'fwf.db'));

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT UNIQUE,
  name TEXT,
  mobile TEXT UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT CHECK(role IN ('member','admin')) NOT NULL DEFAULT 'member',
  membership_active INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS wallets (
  user_id INTEGER UNIQUE,
  balance_inr REAL DEFAULT 0,
  lifetime_earned_inr REAL DEFAULT 0,
  lifetime_applied_inr REAL DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS member_projects (
  user_id INTEGER UNIQUE,
  project_id INTEGER,
  project_name TEXT,
  project_cost REAL,
  target60_inr REAL,
  cash_credited_inr REAL DEFAULT 0,
  wallet_applied_inr REAL DEFAULT 0,
  eligible_flag INTEGER DEFAULT 0,
  eligible_on TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

function nextMemberId(){
  // Generate Member ID in format: FWF-YYMMDD01
  // Example: FWF-25101601 (2025-10-16, member #01 of the day)
  
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year (25)
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month (10)
  const day = now.getDate().toString().padStart(2, '0'); // Day (16)
  const datePrefix = `${year}${month}${day}`; // 251016
  
  // Get today's member count (members with same date prefix)
  const pattern = `${ORG_PREFIX}-${datePrefix}%`;
  const todayMembers = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role='member' AND member_id LIKE ?`).get(pattern);
  
  // Next sequence number for today (01, 02, 03...)
  const nextSeq = (todayMembers.count + 1).toString().padStart(2, '0');
  
  return `${ORG_PREFIX}-${datePrefix}${nextSeq}`;
}
function randPass(len=10){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$%';
  let p='';
  for(let i=0;i<len;i++) p += chars[Math.floor(Math.random()*chars.length)];
  return p;
}
function signToken(payload){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Email configuration
let mailTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  console.log('Email service configured');
} else {
  console.log('Email service not configured (missing SMTP credentials)');
}

async function sendWelcomeEmail(memberData) {
  if (!mailTransporter) {
    console.log('Email not sent - no mail transporter configured');
    return;
  }
  
  const { name, email, memberId, password } = memberData;
  
  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: '🎉 Welcome to FWF - Your Membership is Active!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #6366f1; text-align: center; margin-bottom: 20px;">
            Welcome to FWF! 🎉
          </h1>
          
          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            Dear <strong>${name}</strong>,
          </p>
          
          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            Congratulations! Your FWF membership has been successfully activated. We're excited to have you join our community dedicated to creating livelihoods and making a positive impact.
          </p>
          
          <div style="background: linear-gradient(90deg, #ede9fe, #e0f2fe, #dcfce7); border: 2px solid #c7d2fe; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 15px;">Your Login Credentials:</h2>
            
            <div style="margin: 10px 0;">
              <span style="color: #64748b; font-weight: 600;">Member ID:</span>
              <span style="color: #6366f1; font-weight: 900; font-size: 18px; font-family: monospace; margin-left: 10px;">${memberId}</span>
            </div>
            
            <div style="margin: 10px 0;">
              <span style="color: #64748b; font-weight: 600;">Password:</span>
              <span style="color: #0f172a; font-weight: 900; font-size: 16px; font-family: monospace; margin-left: 10px; background: #fef3c7; padding: 4px 8px; border-radius: 4px;">${password}</span>
            </div>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>⚠️ Important:</strong> Please keep your credentials safe and change your password after first login for security.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.SITE_URL || 'http://localhost:3000'}/member-dashboard.html" 
               style="display: inline-block; background: linear-gradient(90deg, #6366f1, #22c55e); color: white; text-decoration: none; padding: 14px 28px; border-radius: 999px; font-weight: 800; box-shadow: 0 8px 20px rgba(99,102,241,0.3);">
              Access Your Dashboard
            </a>
          </div>
          
          <h3 style="color: #0f172a; margin-top: 30px;">What's Next?</h3>
          <ul style="color: #475569; line-height: 1.8; margin-left: 20px;">
            <li>Login to your member dashboard</li>
            <li>Complete your profile</li>
            <li>Browse available training programs</li>
            <li>Connect with mentors</li>
            <li>Start working on projects</li>
          </ul>
          
          <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-top: 25px;">
            If you have any questions or need assistance, feel free to reach out to us.
          </p>
          
          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            Best regards,<br>
            <strong>The FWF Team</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </div>
    `
  };
  
  try {
    await mailTransporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

// ============================================
// 🛡️ INPUT VALIDATION & SANITIZATION
// ============================================

// Login attempt tracking (in-memory for now)
const loginAttempts = new Map();

function trackLoginAttempt(identifier) {
  const now = Date.now();
  const key = identifier;
  
  if (!loginAttempts.has(key)) {
    loginAttempts.set(key, { count: 1, firstAttempt: now, lockedUntil: null });
    return { allowed: true, remaining: 4 };
  }
  
  const record = loginAttempts.get(key);
  
  // Check if account is locked
  if (record.lockedUntil && now < record.lockedUntil) {
    const minutesLeft = Math.ceil((record.lockedUntil - now) / 60000);
    return { allowed: false, locked: true, minutesLeft };
  }
  
  // Reset if 15 minutes passed
  if (now - record.firstAttempt > 15 * 60 * 1000) {
    loginAttempts.set(key, { count: 1, firstAttempt: now, lockedUntil: null });
    return { allowed: true, remaining: 4 };
  }
  
  // Increment count
  record.count++;
  
  // Lock account if 5 failed attempts
  if (record.count >= 5) {
    record.lockedUntil = now + (15 * 60 * 1000); // Lock for 15 minutes
    return { allowed: false, locked: true, minutesLeft: 15 };
  }
  
  return { allowed: true, remaining: 5 - record.count };
}

function resetLoginAttempts(identifier) {
  loginAttempts.delete(identifier);
}

// Input validation functions
function validateEmail(email) {
  if (!email) return true; // Email is optional
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 100;
}

function validateMobile(mobile) {
  const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile format
  return mobileRegex.test(mobile);
}

function validateName(name) {
  if (!name || name.length < 2 || name.length > 100) return false;
  const nameRegex = /^[a-zA-Z\s.'-]+$/; // Only letters, spaces, dots, hyphens, apostrophes
  return nameRegex.test(name);
}

function validateAadhar(aadhar) {
  if (!aadhar) return true; // Aadhar is optional
  const aadharRegex = /^\d{12}$/; // 12 digits
  return aadharRegex.test(aadhar);
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  // Remove potential XSS characters
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .substring(0, 200); // Limit length
}

function validatePassword(password) {
  // Minimum 8 characters, at least 1 letter, 1 number, 1 special char
  if (!password || password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return hasLetter && hasNumber && hasSpecial;
}

// Seed admin if not exists
const findAdmin = db.prepare(`SELECT * FROM users WHERE role='admin' LIMIT 1`).get();
if(!findAdmin){
  const hash = bcrypt.hashSync(process.env.ADMIN_PASS || 'Admin@12345', 10);
  const memberId = `${ORG_PREFIX}-ADMIN-001`;
  db.prepare(`INSERT INTO users(member_id,name,email,password_hash,role,membership_active) VALUES(?,?,?,?,?,1)`)
    .run(memberId, 'FWF Admin', process.env.ADMIN_USER || 'admin@fwf', hash, 'admin');
  console.log(`Admin created -> user: ${process.env.ADMIN_USER || 'admin@fwf'} | pass: ${process.env.ADMIN_PASS || 'Admin@12345'}`);
}

// --- Auth middleware ---
function auth(requiredRole){
  return (req,res,next)=>{
    try{
      const token = req.cookies.token;
      if(!token) return res.status(401).json({error:'Unauthorized'});
      const data = jwt.verify(token, JWT_SECRET);
      req.user = data;
      if(requiredRole && data.role !== requiredRole) return res.status(403).json({error:'Forbidden'});
      next();
    }catch(e){
      return res.status(401).json({error:'Unauthorized'});
    }
  }
}

// --- Routes ---
// simulate join payment (replace with gateway webhook later)
app.post('/api/pay/simulate-join', async (req,res)=>{
  try {
    let { name, mobile, email, aadhar, transactionId } = req.body;
    
    // Sanitize inputs
    name = sanitizeInput(name);
    mobile = sanitizeInput(mobile);
    email = email ? sanitizeInput(email) : null;
    aadhar = aadhar ? sanitizeInput(aadhar) : null;
    
    // Validate required fields
    if(!name || !mobile) {
      return res.status(400).json({error:'Name and mobile are required'});
    }
    
    // Validate name format
    if (!validateName(name)) {
      return res.status(400).json({error:'Invalid name format. Use only letters, spaces, dots, hyphens.'});
    }
    
    // Validate mobile number
    if (!validateMobile(mobile)) {
      return res.status(400).json({error:'Invalid mobile number. Must be a valid 10-digit Indian mobile number.'});
    }
    
    // Validate email if provided
    if (email && !validateEmail(email)) {
      return res.status(400).json({error:'Invalid email format'});
    }
    
    // Validate Aadhar if provided
    if (aadhar && !validateAadhar(aadhar)) {
      return res.status(400).json({error:'Invalid Aadhar number. Must be 12 digits.'});
    }
    
    // Check if already exists
    const exists = db.prepare(`SELECT id FROM users WHERE mobile=? OR (email IS NOT NULL AND email=?)`).get(mobile, email||null);
    if(exists) {
      return res.status(400).json({error:'Mobile number or email already registered'});
    }

    const memberId = nextMemberId();
    const plain = randPass();
    const hash = bcrypt.hashSync(plain, 10);

    const info = db.prepare(`INSERT INTO users(member_id,name,mobile,email,password_hash,role,membership_active) VALUES(?,?,?,?,?,'member',1)`)
                 .run(memberId, name, mobile, email||null, hash);
    db.prepare(`INSERT OR IGNORE INTO wallets(user_id) VALUES(?)`).run(info.lastInsertRowid);

    // Send welcome email with credentials
    if (email) {
      await sendWelcomeEmail({
        name,
        email,
        memberId,
        password: plain
      });
    }

    res.json({ ok:true, memberId, password: plain });
  } catch (error) {
    console.error('Member registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

app.post('/api/auth/login', (req,res)=>{
  try {
    let { memberId, password } = req.body;
    
    // Sanitize inputs
    memberId = sanitizeInput(memberId);
    
    if (!memberId || !password) {
      return res.status(400).json({error:'Member ID and password are required'});
    }
    
    // Check login attempts
    const attemptCheck = trackLoginAttempt(memberId);
    if (!attemptCheck.allowed) {
      return res.status(429).json({
        error: `Account temporarily locked. Too many failed login attempts. Try again in ${attemptCheck.minutesLeft} minutes.`
      });
    }
    
    const u = db.prepare(`SELECT * FROM users WHERE member_id=?`).get(memberId);
    if(!u) {
      return res.status(400).json({
        error:'Invalid credentials',
        remainingAttempts: attemptCheck.remaining
      });
    }
    
    if(!bcrypt.compareSync(password, u.password_hash)) {
      return res.status(400).json({
        error:'Invalid credentials',
        remainingAttempts: attemptCheck.remaining
      });
    }
    
    // Reset login attempts on successful login
    resetLoginAttempts(memberId);
    
    const token = signToken({ uid: u.id, role: u.role, memberId: u.member_id, name: u.name });
    res.cookie('token', token, { httpOnly:true, sameSite:'lax', secure: process.env.NODE_ENV === 'production' });
    res.json({ ok:true, role: u.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.post('/api/admin/login', (req,res)=>{
  try {
    let { username, password } = req.body;
    
    // Sanitize inputs
    username = sanitizeInput(username);
    
    if (!username || !password) {
      return res.status(400).json({error:'Username and password are required'});
    }
    
    // Check login attempts
    const attemptCheck = trackLoginAttempt('admin_' + username);
    if (!attemptCheck.allowed) {
      return res.status(429).json({
        error: `Account temporarily locked. Too many failed login attempts. Try again in ${attemptCheck.minutesLeft} minutes.`
      });
    }
    
    const u = db.prepare(`SELECT * FROM users WHERE email=? AND role='admin'`).get(username);
    if(!u) {
      return res.status(400).json({
        error:'Invalid credentials',
        remainingAttempts: attemptCheck.remaining
      });
    }
    
    if(!bcrypt.compareSync(password, u.password_hash)) {
      return res.status(400).json({
        error:'Invalid credentials',
        remainingAttempts: attemptCheck.remaining
      });
    }
    
    // Reset login attempts on successful login
    resetLoginAttempts('admin_' + username);
    
    const token = signToken({ uid: u.id, role: u.role, memberId: u.member_id, name: u.name });
    res.cookie('token', token, { httpOnly:true, sameSite:'lax', secure: process.env.NODE_ENV === 'production' });
    res.json({ ok:true });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.post('/api/auth/logout', (req,res)=>{
  res.clearCookie('token');
  res.json({ ok:true });
});

app.get('/api/member/me', auth('member'), (req,res)=>{
  const u = db.prepare(`SELECT id, member_id, name, mobile, email, created_at FROM users WHERE id=?`).get(req.user.uid);
  const w = db.prepare(`SELECT balance_inr, lifetime_earned_inr, lifetime_applied_inr FROM wallets WHERE user_id=?`).get(req.user.uid) || {balance_inr:0,lifetime_earned_inr:0,lifetime_applied_inr:0};
  const p = db.prepare(`SELECT project_name, project_cost, target60_inr, cash_credited_inr, wallet_applied_inr, eligible_flag FROM member_projects WHERE user_id=?`).get(req.user.uid) || null;
  res.json({ user:u, wallet:w, project:p });
});

app.post('/api/member/apply-wallet', auth('member'), (req,res)=>{
  const { amount } = req.body;
  const w = db.prepare(`SELECT balance_inr FROM wallets WHERE user_id=?`).get(req.user.uid);
  if(!w || w.balance_inr <= 0) return res.status(400).json({error:'No wallet balance'});
  const amt = Math.min(parseFloat(amount||0), w.balance_inr);
  if(amt <= 0) return res.status(400).json({error:'Invalid amount'});
  db.prepare(`UPDATE wallets SET balance_inr = balance_inr - ?, lifetime_applied_inr = lifetime_applied_inr + ?, updated_at = datetime('now') WHERE user_id=?`).run(amt, amt, req.user.uid);
  db.prepare(`INSERT INTO member_projects(user_id, project_name, project_cost, target60_inr) 
              SELECT ?, 'Not Selected', NULL, 0 WHERE NOT EXISTS(SELECT 1 FROM member_projects WHERE user_id=?)`).run(req.user.uid, req.user.uid);
  db.prepare(`UPDATE member_projects SET wallet_applied_inr = wallet_applied_inr + ? WHERE user_id=?`).run(amt, req.user.uid);
  res.json({ ok:true });
});

app.get('/api/admin/overview', auth('admin'), (req,res)=>{
  const totals = {
    members: db.prepare(`SELECT COUNT(*) as c FROM users WHERE role='member'`).get().c,
    active_members: db.prepare(`SELECT COUNT(*) as c FROM users WHERE role='member' AND membership_active=1`).get().c
  };
  const latest = db.prepare(`SELECT member_id,name,mobile,email,membership_active,created_at FROM users WHERE role='member' ORDER BY id DESC LIMIT 20`).all();
  res.json({ totals, latest });
});

// Get all members for export
app.get('/api/admin/all-members', auth('admin'), (req,res)=>{
  const members = db.prepare(`SELECT member_id,name,mobile,email,membership_active,created_at FROM users WHERE role='member' ORDER BY id DESC`).all();
  res.json({ ok:true, members });
});

app.listen(PORT, ()=>{
  console.log(`FWF backend running on http://localhost:${PORT}`);
  console.log(`Site served from: ${siteRoot}`);
});
