# FWF Project Restructuring Plan

## 🎯 Current Issues
1. ❌ HTML files scattered in root
2. ❌ Multiple package.json files
3. ❌ Backend mixed with frontend
4. ❌ No proper public folder structure
5. ❌ Mobile app in separate folder
6. ❌ Assets not properly organized

## ✅ Professional Structure (Target)

```
fwf-site-main/
├── 📁 public/                    # Static files served by Express
│   ├── 📁 desktop/               # Desktop site
│   │   ├── index.html
│   │   ├── about.html
│   │   ├── projects.html
│   │   ├── csr.html
│   │   ├── donation.html
│   │   ├── 📁 assets/
│   │   ├── 📁 css/
│   │   └── 📁 js/
│   │
│   ├── 📁 mobile/                # Mobile/Tablet optimized site
│   │   ├── index.html
│   │   ├── about.html
│   │   └── ...
│   │
│   ├── 📁 admin/                 # Admin panel
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   └── contest-review.html
│   │
│   └── 📁 member/                # Member portal
│       ├── login.html
│       └── dashboard.html
│
├── 📁 server/                    # Backend (Node.js/Express)
│   ├── 📄 server.js             # Main server file
│   ├── 📁 routes/               # API routes
│   ├── 📁 controllers/          # Business logic
│   ├── 📁 models/               # Database models
│   ├── 📁 middleware/           # Auth, validation, etc.
│   ├── 📁 utils/                # Helper functions
│   ├── 📁 config/               # Configuration files
│   └── 📄 package.json          # Backend dependencies
│
├── 📁 database/                  # Database files
│   └── 📁 data/
│
├── 📁 docs/                      # Documentation
│   ├── README.md
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── 📄 .env.example              # Environment variables template
├── 📄 .gitignore
├── 📄 package.json              # Root package.json for scripts
└── 📄 README.md                 # Main documentation

```

## 🔧 Implementation Steps

### Phase 1: Backup & Preparation
- ✅ Create backup of current structure
- ✅ Stop running servers

### Phase 2: Server Restructure
- Move `backend/` → `server/`
- Organize into proper MVC structure
- Update paths in server.js

### Phase 3: Frontend Restructure
- Move HTML files to `public/desktop/`
- Move mobile app to `public/mobile/`
- Organize admin/member pages
- Update asset paths

### Phase 4: Configuration
- Create root package.json with scripts
- Update .env configuration
- Fix all import/require paths

### Phase 5: Testing
- Test server startup
- Test all routes
- Test mobile redirect
- Test admin/member portals

## 📋 Benefits

1. ✅ Clear separation of concerns
2. ✅ Easy to scale and maintain
3. ✅ Professional development workflow
4. ✅ Better version control
5. ✅ Easier deployment
6. ✅ Standard industry practice

## 🚀 Execution Command

Run: `npm run restructure` (we'll create this script)
