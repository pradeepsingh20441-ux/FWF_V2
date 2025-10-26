# 📋 Member ID Format - Documentation

## ✅ New Member ID Format

### Format: `FWF-YYMMDD##`

**Components:**
- `FWF` - Organization prefix (customizable in .env)
- `YY` - Year (last 2 digits)
- `MM` - Month (01-12)
- `DD` - Day (01-31)
- `##` - Sequence number for that day (01-99)

---

## 📊 Examples

### Today (October 16, 2025):
```
FWF-25101601  ← First member of Oct 16, 2025
FWF-25101602  ← Second member of Oct 16, 2025
FWF-25101603  ← Third member of Oct 16, 2025
...
FWF-25101610  ← 10th member of Oct 16, 2025
```

### Different Dates:
```
FWF-25101501  ← Oct 15, 2025 - Member #01
FWF-25101601  ← Oct 16, 2025 - Member #01
FWF-25101701  ← Oct 17, 2025 - Member #01
FWF-25110101  ← Nov 01, 2025 - Member #01
FWF-26010101  ← Jan 01, 2026 - Member #01
```

---

## 🎯 Advantages

### 1. **Date-based Tracking**
- Easy to identify when a member joined
- Can filter members by date range
- Visual organization by date

### 2. **Daily Counter Reset**
- Counter resets every day
- Starts from 01 each day
- Up to 99 members per day

### 3. **Human Readable**
- Easy to remember
- Quick to identify registration date
- Professional looking format

### 4. **Unique & Sequential**
- No duplicates possible
- Sequential within each day
- Automatic generation

---

## 🔧 Technical Implementation

### Algorithm:
```javascript
1. Get current date (Year, Month, Day)
2. Format as YYMMDD (e.g., 251016)
3. Count existing members for today (WHERE member_id LIKE 'FWF-251016%')
4. Add 1 to count
5. Format as 2-digit sequence (01, 02, 03...)
6. Combine: FWF-25101601
```

### Database Query:
```sql
-- Count today's members
SELECT COUNT(*) FROM users 
WHERE role='member' 
AND member_id LIKE 'FWF-251016%';

-- Result: 0 → Next ID: FWF-25101601
-- Result: 5 → Next ID: FWF-25101606
```

---

## 📈 Capacity

### Daily Capacity:
- **99 members per day** (01-99)
- If more needed, can extend to 3 digits (001-999)

### Monthly Capacity:
- **~3,000 members** (99 × 30 days)

### Yearly Capacity:
- **~36,000 members** (99 × 365 days)

---

## 🔄 Sequence Reset

### Daily Reset:
```
Oct 15: FWF-25101501, FWF-25101502, ..., FWF-25101599
Oct 16: FWF-25101601, FWF-25101602, ...  ← Resets to 01
```

### Benefits:
- ✅ Easy to track daily registrations
- ✅ Know exact registration date
- ✅ No need for large numbers

---

## 📊 Example Scenarios

### Scenario 1: First Member of Day
```javascript
Date: 2025-10-16
Existing members today: 0
Generated ID: FWF-25101601
```

### Scenario 2: Multiple Members
```javascript
Date: 2025-10-16
Time: 10:00 AM → FWF-25101601
Time: 11:30 AM → FWF-25101602
Time: 02:15 PM → FWF-25101603
Time: 04:45 PM → FWF-25101604
```

### Scenario 3: Next Day
```javascript
Date: 2025-10-17
Existing members today: 0
Generated ID: FWF-25101701  ← Counter reset to 01
```

---

## 🔍 Member ID Breakdown

### Example: `FWF-25101601`

| Part | Value | Meaning |
|------|-------|---------|
| FWF | Organization | Foundris Welfare Foundation |
| 25 | Year | 2025 |
| 10 | Month | October |
| 16 | Day | 16th |
| 01 | Sequence | 1st member of the day |

**Full Meaning:** First member registered on October 16, 2025

---

## 💡 Use Cases

### 1. **Quick Date Identification**
```
FWF-25101601 → Joined on Oct 16, 2025
```

### 2. **Filter by Date Range**
```sql
-- All members of October 2025
SELECT * FROM users WHERE member_id LIKE 'FWF-2510%';

-- All members of Oct 16, 2025
SELECT * FROM users WHERE member_id LIKE 'FWF-251016%';
```

### 3. **Daily Reports**
```sql
-- Count members registered today
SELECT COUNT(*) FROM users 
WHERE member_id LIKE 'FWF-251016%';
```

### 4. **Monthly Analytics**
```sql
-- Members per day in October
SELECT 
  SUBSTR(member_id, 5, 6) as date,
  COUNT(*) as count
FROM users 
WHERE member_id LIKE 'FWF-2510%'
GROUP BY date;
```

---

## ⚙️ Configuration

### Change Prefix:
Edit `backend/.env`:
```env
ORG_PREFIX=FWF  ← Change this
```

Examples:
- `ABC-25101601` (if ORG_PREFIX=ABC)
- `XYZ-25101601` (if ORG_PREFIX=XYZ)

---

## 🎨 Display Examples

### In Email:
```
Your Member ID: FWF-25101601
Registration Date: October 16, 2025
Member Number: 1st of the day
```

### In Dashboard:
```
┌─────────────────────────────────┐
│ Member ID: FWF-25101601        │
│ Joined: Oct 16, 2025           │
│ Status: Active                  │
└─────────────────────────────────┘
```

### In Database:
```
id | member_id    | name      | created_at
1  | FWF-25101601 | John Doe  | 2025-10-16 10:30:00
2  | FWF-25101602 | Jane Smith| 2025-10-16 14:45:00
3  | FWF-25101701 | Bob Wilson| 2025-10-17 09:15:00
```

---

## 🔒 Unique Constraints

### Guaranteed Unique:
- ✅ Date is unique each day
- ✅ Sequence increments automatically
- ✅ Database checks prevent duplicates
- ✅ No manual input needed

### Edge Case Handling:
```javascript
// If 99 members already registered today
if (nextSeq > 99) {
  // Option 1: Use 3 digits (100, 101, 102...)
  // Option 2: Show error (limit reached)
  // Current: Supports up to 99 per day
}
```

---

## 📝 Migration Notes

### Old Format → New Format

**Before:**
```
FWF-000001
FWF-000002
FWF-000003
```

**After:**
```
FWF-25101601
FWF-25101602
FWF-25101603
```

### Database Compatibility:
- Both formats work in same database
- `member_id` field is TEXT
- No migration needed for existing members
- New members get new format

---

## 🚀 Benefits Summary

### ✅ For Members:
- Easy to remember
- Professional looking
- Shows join date

### ✅ For Admins:
- Quick date identification
- Easy filtering
- Daily tracking
- Analytics friendly

### ✅ For System:
- Automatic generation
- No conflicts
- Scalable
- Database efficient

---

## 📞 Quick Reference

### Format:
```
FWF-YYMMDD##
```

### Example:
```
FWF-25101601
│   │ │ │ └─ Sequence (01-99)
│   │ │ └─── Day (01-31)
│   │ └───── Month (01-12)
│   └─────── Year (last 2 digits)
└─────────── Organization prefix
```

### Length:
- Total: 12 characters
- Fixed format
- Always uppercase

---

**Implementation Date:** October 16, 2025  
**Version:** 2.0  
**Status:** ✅ Active
