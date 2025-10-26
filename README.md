git remote remove origin
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main# FWF (Foundris Welfare Foundation) — Skills to Livelihood Platform# FWF Site Main — Vercel Deployment Guide



[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)## How to Deploy on Vercel

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

[![Vercel](https://img.shields.io/badge/deploy-vercel-black.svg)](https://vercel.com)1. **Project Structure**

   - Make sure your repo root is `fwf-site-main` (not a parent folder like `FWF_final`).

A comprehensive full-stack web platform connecting people with market-ready training and real business projects for sustainable livelihood generation.   - All main files should be inside this folder.



## 🌟 Features2. **vercel.json Configuration**

   - Already present and correct:

- **Dual-Database Architecture**: SQLite (local backend) + MongoDB (serverless API)   ```json

- **Multi-Device Support**: Responsive desktop, mobile PWA, admin and member portals   {

- **Secure Authentication**: JWT-based auth with role-based access control     "cleanUrls": true,

- **Payment Integration**: Donation and membership payment flows     "rewrites": [

- **Contest System**: Fundraiser contest with ticket generation       { "source": "/", "destination": "/public/desktop/index.html" },

- **Email Notifications**: Automated emails for registration, confirmations       { "source": "/index.html", "destination": "/public/desktop/index.html" },

- **CSR Portal**: Corporate partnership and project management       { "source": "/mobile/(.*)", "destination": "/public/mobile/$1" },

- **Admin Dashboard**: Member management, project oversight, analytics       { "source": "/admin/(.*)", "destination": "/public/admin/$1" },

       { "source": "/member/(.*)", "destination": "/public/member/$1" },

## 📁 Project Structure       { "source": "/shared/(.*)", "destination": "/public/shared/$1" },

       { "source": "/terms", "destination": "/api/terms" },

```       { "source": "/privacy", "destination": "/api/privacy" }

FWF_Final/     ]

├── api/                    # Serverless API handlers (MongoDB)   }

│   ├── contact.js   ```

│   ├── join.js

│   ├── subscribe.js3. **Vercel Dashboard Settings**

│   └── contest/           # Contest-related endpoints   - In "Build and Deployment" settings, set "Root Directory" to blank (if repo root is `fwf-site-main`).

├── backend/               # Express server (SQLite)   - If you deploy from a parent folder, set "Root Directory" to `fwf-site-main`.

│   ├── server.js          # Main backend server

│   ├── package.json4. **Entry Point**

│   └── data/             # SQLite database files   - Main site entry: `public/desktop/index.html`

├── public/                # Frontend static files   - Mobile entry: `public/mobile/index.html`

│   ├── desktop/          # Desktop website

│   ├── mobile/           # Mobile PWA5. **API Functions**

│   ├── admin/            # Admin dashboard   - All serverless functions should be inside `api/` folder.

│   ├── member/           # Member portal   - Use relative imports for helpers/models.

│   └── shared/           # Shared components

├── lib/                   # Shared utilities6. **Environment Variables**

│   ├── db.js             # MongoDB connection   - Set MongoDB, SMTP, JWT, etc. in Vercel dashboard under "Environment Variables".

│   └── mailer.js         # Email service

├── models/                # Database models (Mongoose)7. **Deploy**

│   ├── Member.js   - Use Vercel CLI:

│   ├── Contact.js     ```powershell

│   └── Subscription.js     cd D:\FWF_Final\fwf-site-main

├── docs/                  # Documentation     vercel --prod

├── vercel.json           # Vercel deployment config     ```

└── package.json          # Root dependencies   - Or connect GitHub repo to Vercel and import project.

```

## Troubleshooting

## 🚀 Quick Start- If "Root Directory does not exist" error comes, check your repo structure and Vercel settings.

- If 404 error comes, confirm `vercel.json` rewrites and entry point files exist.

### Prerequisites- For API errors, check environment variables and function paths.



- Node.js >= 18.0.0---

- npm or yarn**Project is now Vercel-ready!**
- MongoDB URI (for serverless APIs)
- SMTP credentials (for email)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/beenabeena909-eng/FWF_test.git
   cd FWF_Final
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies (for Vercel serverless functions)
   npm install
   
   # Backend dependencies (for local Express server)
   cd backend
   npm install
   cd ..
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB (for serverless API handlers)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fwf
   
   # Email Service
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   MAIL_FROM=noreply@fwf.org
   
   # Authentication
   JWT_SECRET=your-secret-key-change-this
   
   # Organization
   ORG_PREFIX=FWF
   SITE_URL=http://localhost:3000
   
   # Admin Credentials
   ADMIN_USER=admin@fwf
   ADMIN_PASS=Admin@12345
   ```

4. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   
   Server runs on: http://localhost:3000

5. **Access the application**
   - **Homepage**: http://localhost:3000/
   - **Mobile**: http://localhost:3000/mobile/
   - **Admin**: http://localhost:3000/admin/
   - **Member**: http://localhost:3000/member/

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables, add:
   - `MONGODB_URI`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - `JWT_SECRET`
   - `MAIL_FROM`
   - `SITE_URL` (your Vercel domain)

4. **Deployment Settings**
   - **Root Directory**: Leave blank (or set to current folder)
   - **Build Command**: (none needed for static + serverless)
   - **Output Directory**: `public`

### GitHub Integration

Connect your GitHub repository to Vercel for automatic deployments on push.

## 🔐 Security Features

- **Helmet.js**: Security headers (CSP, HSTS, X-Frame-Options)
- **Rate Limiting**: 100 requests/15min (general), 5 attempts/15min (auth)
- **XSS Protection**: Input sanitization with `xss-clean`
- **SQL Injection Prevention**: Parameterized queries, `express-mongo-sanitize`
- **HPP Protection**: HTTP Parameter Pollution prevention
- **CORS**: Configured for allowed origins
- **JWT Authentication**: HTTP-only cookies, role-based access

## 📊 Database Schemas

### SQLite (Backend)
- **users**: Member information, credentials
- **wallets**: Member wallet balances
- **projects**: Project tracking and assignments

### MongoDB (API Handlers)
- **members**: Member registrations
- **contacts**: Contact form submissions
- **subscriptions**: Newsletter subscriptions

## 🎨 Tech Stack

**Frontend**
- HTML5, CSS3, JavaScript (Vanilla)
- Font Awesome, Google Fonts
- Progressive Web App (PWA) support

**Backend**
- Node.js + Express.js
- SQLite (better-sqlite3)
- MongoDB (Mongoose)

**Security**
- Helmet, CORS, express-rate-limit
- bcrypt, jsonwebtoken
- express-validator

**Email**
- Nodemailer (Gmail SMTP)

**Deployment**
- Vercel (serverless functions + static hosting)

## 🛠️ Development Scripts

```bash
# Start backend server (from backend/)
npm start

# Run with auto-reload (if nodemon installed)
npx nodemon server.js

# Check for syntax errors
npm run lint

# Create database backup
powershell ./backup-fwf.ps1
```

## 📝 API Endpoints

### Backend (Express - SQLite)
- `POST /api/auth/login` - Member/admin login
- `POST /api/pay/simulate-join` - Simulate membership registration
- `GET /api/member/profile` - Get member profile
- `POST /api/admin/members` - Admin member management

### Serverless (Vercel - MongoDB)
- `POST /api/join` - Member registration
- `POST /api/contact` - Contact form submission
- `POST /api/subscribe` - Newsletter subscription
- `POST /api/contest/ticket` - Contest ticket purchase
- `POST /api/contest/idea` - Submit contest idea

## 🐛 Troubleshooting

### Vercel 404 Error
- Ensure `vercel.json` has correct rewrites
- Check that `public/index.html` exists
- Verify root directory setting in Vercel dashboard

### Database Connection Issues
- **SQLite**: Ensure `backend/data/` directory exists
- **MongoDB**: Verify `MONGODB_URI` in environment variables

### Email Not Sending
- Check SMTP credentials
- Enable "Less secure app access" or use App Password (Gmail)
- Verify firewall/port 587 access

### Port Already in Use
```bash
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

**Foundris Welfare Foundation (FWF)**

- Website: [fwf-final.vercel.app](https://fwf-final.vercel.app)
- Email: info@fwf.org
- GitHub: [@beenabeena909-eng](https://github.com/beenabeena909-eng)

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for hosting
- [MongoDB](https://www.mongodb.com) for database
- [Font Awesome](https://fontawesome.com) for icons
- All contributors and supporters

---

**Made with ❤️ by FWF Team**

*Empowering communities through skills, training, and livelihood opportunities.*
