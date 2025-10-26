# 🧪 Localhost Testing Guide - FWF Member System

## ✅ Current Setup Status

### Working Features (Localhost):
1. ✅ **Backend Server** - Express + SQLite (local database)
2. ✅ **Member Registration Form** - Form validation working
3. ✅ **Database** - SQLite file in `backend/data/fwf.db`
4. ✅ **Email Service** - Gmail SMTP configured ✉️
5. ✅ **Member ID Generation** - Auto-incrementing (FWF-000001, FWF-000002...)
6. ✅ **Password Generation** - Random secure passwords
7. ✅ **Test Payment Gateway** - Simulated payment for testing (`test-payment.html`)

### 📊 Architecture:
```
Frontend (donation.html)
      ↓
Test Payment Gateway (test-payment.html)
      ↓
Payment Success (payment-success.html)
      ↓
Backend API (/api/pay/simulate-join)
      ↓
SQLite Database (backend/data/fwf.db)
      ↓
Gmail SMTP (Welcome Email)
```

---

## 🚀 Complete Testing Flow

### Step 1: Start Server
```bash
cd backend
npm start
```

✅ Server runs at: `http://localhost:3000`
✅ Email service configured with Gmail

### Step 2: Test Member Registration

#### 2.1 Open Form
1. Navigate to: `http://localhost:3000/donation.html`
2. Click **"Join Now"** button in Membership section

#### 2.2 Fill Form
- **Name**: Test User
- **Mobile**: 9876543210
- **Email**: your-email@gmail.com (use real email to test email delivery)
- **Aadhar**: 123456789012

#### 2.3 Submit Form
Click **"Proceed to Payment"** button

### Step 3: Test Payment Gateway

You'll be redirected to: `http://localhost:3000/test-payment.html`

**Test Payment Page Shows:**
- 💳 Payment details
- 📋 Member information
- 💰 Amount (₹200)
- 🟢 **"Pay Success"** button (simulate successful payment)
- 🔴 **"Pay Failed"** button (simulate failed payment)

**Test Scenarios:**

#### ✅ Success Test:
1. Click **"Pay Success"** button
2. Redirects to `payment-success.html`
3. Shows loading animation
4. Calls backend API
5. Creates member account
6. Sends welcome email
7. Displays success with Member ID

#### ❌ Failure Test:
1. Click **"Pay Failed"** button
2. Redirects to `payment-success.html` with error
3. Shows error state
4. Member account NOT created
5. No email sent

### Step 4: Verify Member Creation

#### Check Database:
```bash
cd backend/data
sqlite3 fwf.db "SELECT * FROM users WHERE role='member';"
```

You should see:
```
id | member_id  | name      | mobile     | email              | role   | membership_active
1  | FWF-000001 | Test User | 9876543210 | test@gmail.com    | member | 1
```

#### Check Email:
- Open your Gmail inbox
- Look for email from "FWF <noreply@fwf.org>"
- Subject: "🎉 Welcome to FWF - Your Membership is Active!"
- Email contains:
  - Welcome message
  - Member ID (e.g., FWF-000001)
  - Password (random 10 characters)
  - Login button

### Step 5: Test Dashboard Login

1. Go to: `http://localhost:3000/member-dashboard.html`
2. Use credentials from email:
   - **Member ID**: FWF-000001
   - **Password**: (from email)
3. Click **Login**
4. Should access member dashboard

---

## 📊 Data Flow

### 1. **Form Submission**
```javascript
// Data stored in localStorage
{
  name: "Test User",
  mobile: "9876543210",
  email: "test@gmail.com",
  aadhar: "123456789012"
}
```

### 2. **Payment Redirect**
```
http://localhost:3000/test-payment.html?
  amount=200
  &type=membership
  &name=Test%20User
  &mobile=9876543210
  &email=test@gmail.com
  &callback=http://localhost:3000/payment-success.html
```

### 3. **Payment Success**
```
http://localhost:3000/payment-success.html?
  status=success
  &txn_id=TEST_TXN_1729082400000
  &amount=200
```

### 4. **API Call**
```javascript
POST /api/pay/simulate-join
Body: {
  "name": "Test User",
  "mobile": "9876543210",
  "email": "test@gmail.com",
  "aadhar": "123456789012",
  "transactionId": "TEST_TXN_1729082400000",
  "amount": 200
}
```

### 5. **API Response**
```json
{
  "ok": true,
  "memberId": "FWF-000001",
  "password": "Abc123xyz@"
}
```

### 6. **Email Sent**
- Gmail SMTP sends welcome email
- Contains Member ID and Password

---

## 🔍 Testing Checklist

### ✅ Member Registration
- [ ] Form opens correctly
- [ ] All fields validate properly
- [ ] Icons change color when filled
- [ ] Form submits successfully

### ✅ Payment Gateway
- [ ] Redirects to test payment page
- [ ] Shows correct amount (₹200)
- [ ] Shows member details
- [ ] Success button works
- [ ] Failure button works

### ✅ Backend API
- [ ] Member ID generated (FWF-XXXXXX format)
- [ ] Password generated (10 characters)
- [ ] Database entry created
- [ ] Wallet entry created
- [ ] No duplicate mobile/email

### ✅ Email Service
- [ ] Email sent successfully
- [ ] Email received in inbox
- [ ] HTML formatting correct
- [ ] Member ID visible
- [ ] Password visible
- [ ] Login link works

### ✅ Dashboard Access
- [ ] Can login with Member ID
- [ ] Can login with Password
- [ ] Dashboard loads correctly
- [ ] Member details displayed

---

## 🗄️ Database Structure

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT UNIQUE,
  name TEXT,
  mobile TEXT UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT CHECK(role IN ('member','admin')),
  membership_active INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### Wallets Table
```sql
CREATE TABLE wallets (
  user_id INTEGER UNIQUE,
  balance_inr REAL DEFAULT 0,
  lifetime_earned_inr REAL DEFAULT 0,
  lifetime_applied_inr REAL DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

---

## 🔧 Troubleshooting

### Email Not Sending?
**Check:**
1. `backend/.env` file has correct SMTP credentials
2. Gmail App Password is correct (not regular password)
3. Server logs for email errors
4. Internet connection

**Fix:**
```bash
# Check .env file
cat backend/.env | grep SMTP

# Restart server
cd backend
npm start
```

### Member ID Not Generating?
**Check:**
1. Database file exists: `backend/data/fwf.db`
2. Server logs for errors
3. ORG_PREFIX in .env (should be "FWF")

**Fix:**
```bash
# Check database
cd backend/data
sqlite3 fwf.db ".tables"
```

### Payment Page Not Loading?
**Check:**
1. File exists: `test-payment.html`
2. Server is running
3. Browser console for errors

**Fix:**
```bash
# Restart server
cd backend
npm start
```

---

## 📝 Test Data Examples

### Valid Test Data:
```
Name: Rahul Kumar
Mobile: 9876543210
Email: rahul@example.com
Aadhar: 123456789012

Name: Priya Singh
Mobile: 8765432109
Email: priya@example.com
Aadhar: 234567890123
```

### Invalid Test Data (for validation testing):
```
Mobile: 123 (too short)
Mobile: abcd123456 (contains letters)
Email: notanemail (invalid format)
Aadhar: 12345 (too short)
```

---

## 🚀 Next Steps (After Testing)

### Phase 2: Production Setup
1. **Payment Gateway Integration**
   - Sign up for Razorpay/PayU/Paytm
   - Get API keys
   - Replace test gateway with real one

2. **MongoDB Integration**
   - Set up MongoDB Atlas
   - Update API routes in `api/` folder
   - Migrate from SQLite to MongoDB

3. **Deployment**
   - Deploy backend to VPS/Cloud
   - Deploy frontend to Vercel/Netlify
   - Configure production environment variables

---

## 📞 Support

**Server Logs:**
```bash
cd backend
npm start
# Watch logs in console
```

**Database Query:**
```bash
cd backend/data
sqlite3 fwf.db
> SELECT * FROM users;
> SELECT * FROM wallets;
```

**Email Logs:**
Check server console for:
- "Welcome email sent to..."
- "Email service configured"
- Email errors if any

---

**Testing Status**: ✅ All Features Working on Localhost
**Last Updated**: October 16, 2025
**Version**: 1.0-localhost-testing
