# 📊 Member Data Check Karne Ke Tarike

## ✅ 3 Methods to Check Member Data

---

## 🎯 Method 1: Admin Dashboard (Easiest - GUI)

### Step 1: Admin Login
```
URL: http://localhost:3000/admin-login.html
Username: admin@fwf
Password: Admin@12345
```

### Step 2: View Members
Dashboard me dikhaega:
- ✅ Total members count
- ✅ Active members count
- ✅ Latest 20 members ki list with:
  - Member ID
  - Name
  - Mobile
  - Email
  - Status (Active/Inactive)
  - Join date

### Step 3: Export All Members
- **"📥 Export All Members (CSV)"** button click karo
- Excel me open kar sakte ho
- All members ka complete data milega

**Screenshot:**
```
┌───────────────────────────────────────────────────────────┐
│  Admin Overview                                           │
├───────────────────────────────────────────────────────────┤
│  Total Members: 5          Active Members: 5              │
├───────────────────────────────────────────────────────────┤
│  Latest Members                                           │
│                                                           │
│  Member ID      Name        Mobile      Email    Status  │
│  FWF-25101601   Test User   9876543210  test@... Active  │
│  FWF-25101602   Rahul       8765432109  rahul... Active  │
└───────────────────────────────────────────────────────────┘
```

---

## 💻 Method 2: SQLite Database (Command Line)

### Step 1: Database Open Karo
```bash
cd backend/data
sqlite3 fwf.db
```

### Step 2: Queries Run Karo

#### Sabhi Members Dekhne Ke Liye:
```sql
SELECT * FROM users WHERE role='member';
```

#### Important Details Only:
```sql
SELECT member_id, name, mobile, email, created_at 
FROM users 
WHERE role='member' 
ORDER BY id DESC;
```

#### Latest 10 Members:
```sql
SELECT member_id, name, email, created_at 
FROM users 
WHERE role='member' 
ORDER BY id DESC 
LIMIT 10;
```

#### Today Ke Members:
```sql
SELECT * FROM users 
WHERE member_id LIKE 'FWF-251016%';
```

#### Member Count:
```sql
SELECT COUNT(*) as total_members 
FROM users 
WHERE role='member';
```

#### Active Members Only:
```sql
SELECT * FROM users 
WHERE role='member' 
AND membership_active=1;
```

#### Search by Name:
```sql
SELECT * FROM users 
WHERE name LIKE '%Rahul%';
```

#### Search by Mobile:
```sql
SELECT * FROM users 
WHERE mobile='9876543210';
```

#### Exit SQLite:
```sql
.quit
```

**Example Output:**
```
member_id     | name       | mobile     | email           | created_at
FWF-25101601  | Test User  | 9876543210 | test@gmail.com  | 2025-10-16 10:30:00
FWF-25101602  | Rahul      | 8765432109 | rahul@gmail.com | 2025-10-16 14:45:00
```

---

## 🖥️ Method 3: DB Browser (GUI Tool - Recommended for Beginners)

### Step 1: Download & Install
1. Download: https://sqlitebrowser.org/dl/
2. Install DB Browser for SQLite

### Step 2: Open Database
1. **File** → **Open Database**
2. Navigate to: `backend/data/fwf.db`
3. Click **Open**

### Step 3: Browse Data
1. Click **"Browse Data"** tab
2. **Table** dropdown se select: `users`
3. Sare members dikhengi

### Step 4: Filter & Search
- **Filter** box me search kar sakte ho
- **Columns** hide/show kar sakte ho
- **Export** kar sakte ho (CSV, JSON, SQL)

**Screenshot View:**
```
┌─────────────────────────────────────────────────────────┐
│  DB Browser for SQLite                    [_ □ X]       │
├─────────────────────────────────────────────────────────┤
│  Database Structure | Browse Data | Edit Pragmas       │
├─────────────────────────────────────────────────────────┤
│  Table: [users ▼]                    🔍 Filter: [___]  │
├──┬────────────┬───────────┬──────────┬───────────────┬──┤
│id│ member_id  │ name      │ mobile   │ email         │..│
├──┼────────────┼───────────┼──────────┼───────────────┼──┤
│1 │FWF-251016..│ Test User │987654... │test@gmail.com │..│
│2 │FWF-251016..│ Rahul     │876543... │rahul@gmail... │..│
└──┴────────────┴───────────┴──────────┴───────────────┴──┘
```

---

## 📋 Quick Reference Commands

### SQLite One-Liners:
```bash
# All members
sqlite3 backend/data/fwf.db "SELECT member_id, name, mobile FROM users WHERE role='member';"

# Count
sqlite3 backend/data/fwf.db "SELECT COUNT(*) FROM users WHERE role='member';"

# Today's members
sqlite3 backend/data/fwf.db "SELECT * FROM users WHERE member_id LIKE 'FWF-251016%';"

# Export to CSV
sqlite3 -header -csv backend/data/fwf.db "SELECT * FROM users WHERE role='member';" > members.csv
```

---

## 🔍 Useful SQL Queries

### 1. Members by Date Range:
```sql
SELECT * FROM users 
WHERE created_at BETWEEN '2025-10-01' AND '2025-10-31';
```

### 2. Members with Email:
```sql
SELECT * FROM users 
WHERE email IS NOT NULL 
AND email != '';
```

### 3. Monthly Report:
```sql
SELECT 
  strftime('%Y-%m', created_at) as month,
  COUNT(*) as count
FROM users 
WHERE role='member'
GROUP BY month;
```

### 4. Daily Report:
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as count
FROM users 
WHERE role='member'
GROUP BY date
ORDER BY date DESC;
```

### 5. Member Details with Wallet:
```sql
SELECT 
  u.member_id,
  u.name,
  u.email,
  w.balance_inr,
  w.lifetime_earned_inr
FROM users u
LEFT JOIN wallets w ON u.id = w.user_id
WHERE u.role='member';
```

---

## 📊 CSV Export Example

### From Admin Dashboard:
1. Login to admin dashboard
2. Click **"📥 Export All Members (CSV)"**
3. File download hogi: `FWF_Members_2025-10-16.csv`
4. Excel me open karo

**CSV Format:**
```csv
Member ID,Name,Mobile,Email,Status,Joined Date
FWF-25101601,"Test User",9876543210,"test@gmail.com",Active,2025-10-16 10:30:00
FWF-25101602,"Rahul Kumar",8765432109,"rahul@gmail.com",Active,2025-10-16 14:45:00
```

---

## 🎯 Which Method to Use?

### Use Admin Dashboard When:
- ✅ Quick overview chahiye
- ✅ GUI preferred hai
- ✅ Export to CSV chahiye
- ✅ Non-technical user hai

### Use SQLite CLI When:
- ✅ Terminal comfortable ho
- ✅ Complex queries run karni hai
- ✅ Automation script banana hai
- ✅ Bulk operations karni hai

### Use DB Browser When:
- ✅ Detailed analysis chahiye
- ✅ Visual browsing preferred hai
- ✅ Data edit karna hai
- ✅ Multiple tables explore karni hai

---

## 🔧 Database Schema

### Users Table:
```sql
id                  INTEGER PRIMARY KEY
member_id           TEXT UNIQUE
name                TEXT
mobile              TEXT UNIQUE
email               TEXT UNIQUE
password_hash       TEXT
role                TEXT (member/admin)
membership_active   INTEGER (0/1)
created_at          TEXT (timestamp)
```

### Wallets Table:
```sql
user_id                 INTEGER UNIQUE
balance_inr             REAL
lifetime_earned_inr     REAL
lifetime_applied_inr    REAL
updated_at              TEXT
```

---

## 📝 Common Scenarios

### Scenario 1: Check if member exists
```sql
SELECT * FROM users 
WHERE mobile='9876543210' 
OR email='test@gmail.com';
```

### Scenario 2: Get member by ID
```sql
SELECT * FROM users 
WHERE member_id='FWF-25101601';
```

### Scenario 3: Update member status
```sql
UPDATE users 
SET membership_active=0 
WHERE member_id='FWF-25101601';
```

### Scenario 4: Delete member (careful!)
```sql
DELETE FROM users 
WHERE member_id='FWF-25101601';
```

### Scenario 5: Check member wallet
```sql
SELECT 
  u.member_id,
  u.name,
  w.balance_inr
FROM users u
JOIN wallets w ON u.id = w.user_id
WHERE u.member_id='FWF-25101601';
```

---

## 🚀 Quick Start Guide

### Sabse Easy Way:

1. **Browser kholo**: `http://localhost:3000/admin-login.html`
2. **Login karo**: admin@fwf / Admin@12345
3. **Members dekho**: Dashboard pe list dikhegi
4. **Export karo**: CSV button click karo

**Done! 🎉**

---

## ⚠️ Important Notes

### Database Location:
```
backend/data/fwf.db
```

### Backup Kaise Le:
```bash
# Simple copy
cp backend/data/fwf.db backend/data/fwf_backup_$(date +%Y%m%d).db

# Or
sqlite3 backend/data/fwf.db ".backup 'fwf_backup.db'"
```

### Database Restore:
```bash
cp fwf_backup.db backend/data/fwf.db
```

---

## 📞 Troubleshooting

### Problem: Database file nahi mil rahi
**Solution:**
```bash
# Check location
ls backend/data/

# Server restart karo (auto-create ho jayegi)
cd backend
npm start
```

### Problem: Admin login nahi ho raha
**Solution:**
```bash
# Check .env file
cat backend/.env | grep ADMIN

# Default credentials:
# Username: admin@fwf
# Password: Admin@12345
```

### Problem: No members dikha rahe
**Solution:**
```sql
-- Check if members exist
sqlite3 backend/data/fwf.db "SELECT COUNT(*) FROM users WHERE role='member';"

-- If 0, register a test member first
```

---

## 🎯 Summary

**3 Ways to Check Members:**
1. ✅ **Admin Dashboard** - Easiest, GUI-based
2. ✅ **SQLite CLI** - Command line queries
3. ✅ **DB Browser** - Visual database explorer

**Recommended:** Start with Admin Dashboard for quick overview, use SQLite for advanced queries.

---

**Last Updated:** October 16, 2025  
**Database:** SQLite (backend/data/fwf.db)  
**Admin URL:** http://localhost:3000/admin-login.html
