# FWF Project Structure

## Overview
Professional folder organization for the FWF website with clear separation of concerns.

## Directory Structure

```
fwf-site-main/
├── public/                    # Frontend - Static files served to users
│   ├── desktop/              # Desktop website pages
│   │   ├── index.html        # Homepage
│   │   ├── about.html        # About page
│   │   ├── projects.html     # Projects showcase
│   │   ├── csr.html          # CSR page
│   │   ├── donation.html     # Donation page
│   │   ├── join.html         # Join/registration page
│   │   └── assets/           # Desktop assets
│   │       ├── css/          # Stylesheets
│   │       ├── js/           # JavaScript files
│   │       └── images/       # Images and media
│   │
│   ├── mobile/               # Mobile app version (PWA)
│   │
│   ├── admin/                # Admin dashboard pages
│   │   ├── admin-dashboard.html
│   │   ├── admin-login.html
│   │   └── admin-contest-review.html
│   │
│   ├── member/               # Member portal pages
│   │   ├── member-dashboard.html
│   │   └── member-login.html
│   │
│   └── shared/               # Shared components across all pages
│       ├── widgets/          # Reusable UI widgets
│       │   └── contest-widget.html
│       ├── css/              # Shared styles
│       │   └── contest-widget.css
│       └── js/               # Shared scripts
│           └── contest-widget.js
│
├── server/                   # Backend - Node.js/Express server
│   ├── server.js            # Main server file
│   ├── package.json         # Server dependencies
│   ├── routes/              # API route handlers
│   │   ├── contact.js
│   │   ├── join.js
│   │   └── contest/
│   ├── controllers/         # Business logic
│   ├── models/              # Data models
│   │   ├── Contact.js
│   │   ├── Member.js
│   │   └── Subscription.js
│   ├── middleware/          # Express middleware
│   ├── utils/               # Utility functions
│   │   ├── db.js
│   │   └── mailer.js
│   └── config/              # Configuration files
│
├── database/                # Database storage
│   └── data/               # SQLite database files
│       └── fwf.db
│
├── docs/                    # Documentation
│   ├── PROJECT_STRUCTURE.md (this file)
│   ├── MEMBER_SETUP.md
│   ├── SECURITY.md
│   └── README.md
│
├── package.json            # Root package.json (if needed)
└── vercel.json             # Vercel deployment config

```

## Key Changes from Old Structure

### Before (Flat Structure)
- All HTML files in root directory
- Mixed assets (CSS, JS, images) in root
- Backend files scattered
- Hard to navigate and maintain

### After (Organized Structure)
- ✅ Clear separation: public (frontend) vs server (backend)
- ✅ Desktop, mobile, admin, member sections organized
- ✅ Shared components in dedicated folder
- ✅ All backend code in server/ with MVC pattern
- ✅ Database files in database/ folder
- ✅ Documentation in docs/ folder

## Server Configuration

### Static File Serving
```javascript
const siteRoot = path.resolve(__dirname, '..', 'public');
app.use(express.static(siteRoot));
```

### Database Location
```javascript
const dataDir = path.resolve(__dirname, '..', 'database', 'data');
const db = new Database(path.join(dataDir, 'fwf.db'));
```

### Routes
- `/` → Redirects to `/desktop/index.html`
- `/desktop/*` → Desktop website pages
- `/mobile/*` → Mobile app pages
- `/admin/*` → Admin dashboard
- `/member/*` → Member portal
- `/api/*` → Backend API endpoints

## Development Workflow

### Starting the Server
```bash
cd server
npm install
node server.js
```

Server runs on: http://localhost:3000

### File Organization Guidelines

#### Frontend Files (public/)
- Desktop pages → `public/desktop/`
- Mobile pages → `public/mobile/`
- Admin pages → `public/admin/`
- Member pages → `public/member/`
- Reusable components → `public/shared/`

#### Backend Files (server/)
- API endpoints → `server/routes/`
- Business logic → `server/controllers/`
- Data models → `server/models/`
- Helper functions → `server/utils/`
- Configuration → `server/config/`

#### Database Files
- All database files → `database/data/`

#### Documentation
- All docs → `docs/`

## Mobile Redirect

Desktop pages include mobile detection script:
```javascript
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobile) {
  window.location.href = '/fwf-Mobile app FInal/' + currentPage;
}
```

## Features

### Contest Widget
- Location: `public/shared/widgets/contest-widget.html`
- Styles: `public/shared/css/contest-widget.css`
- Script: `public/shared/js/contest-widget.js`
- Floating button + modal with 3-step stairs design

### Support Forms
- Feedback, Query, Complaint, Contact forms
- Modal popup system
- API endpoint: `/api/contact`

### Security
- Helmet.js for headers
- CORS configured
- Rate limiting on API routes
- XSS protection
- Input validation & sanitization

## Backup

Backup location: `D:\FWF_test\fwf-site-main-backup-20251024-101352`

## Next Steps

1. ✅ Folder structure created
2. ✅ Files moved to appropriate locations
3. ✅ Server.js updated with new paths
4. ✅ Dependencies installed
5. ✅ Server running successfully
6. ⏳ Test all pages and functionality
7. ⏳ Update any remaining hardcoded paths
8. ⏳ Deploy to production

## Support

For issues or questions:
- Check documentation in `docs/` folder
- Review backup files if needed
- Contact development team

---

**Project restructured on:** October 24, 2025  
**Backup location:** `D:\FWF_test\fwf-site-main-backup-20251024-101352`
