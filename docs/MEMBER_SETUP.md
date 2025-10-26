# Member Joining System - Quick Setup Guide

## ✅ What's Implemented

### 1. **Updated Member Form** (donation.html)
- Clean, modern form with 4 fields:
  - Full Name
  - Mobile Number (10 digits)
  - Email Address
  - Aadhar Number (12 digits)
- Floating label inputs with icon color change on fill
- Monthly fee display (₹200/month)
- "Proceed to Payment" button

### 2. **Payment Gateway Integration**
- Form stores data in localStorage
- Redirects to payment gateway with member details
- Amount: ₹200/month
- Callback to payment-success.html

### 3. **Payment Success Page** (payment-success.html)
- Loading state while processing
- Calls backend API to create member
- Success state shows:
  - ✅ Success animation
  - Member ID (unique FWF-XXXXXX format)
  - Member details
  - "Check your email" notification
  - Buttons: Go to Dashboard | Back to Home
- Error state for failed payments

### 4. **Backend API** (backend/server.js)
- **POST /api/pay/simulate-join** endpoint
- Creates unique member ID (FWF-000001, FWF-000002, etc.)
- Generates random secure password
- Stores in SQLite database
- Creates wallet for member
- Sends welcome email with credentials

### 5. **Welcome Email**
Beautiful HTML email containing:
- 🎉 Welcome message
- Member ID and Password
- Login link to dashboard
- Security reminder
- Next steps checklist

### 6. **Database**
- `users` table: stores member info
- `wallets` table: manages member wallet
- Automatic member ID generation
- Password hashing with bcrypt

## 🚀 How to Use

### Step 1: Start Server
```bash
cd backend
npm install
npm start
```

### Step 2: Configure Email (Optional but Recommended)
Create `.env` file in `backend/` folder:
```env
PORT=3000
JWT_SECRET=your-secret-key-here
ORG_PREFIX=FWF

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
MAIL_FROM=FWF <noreply@fwf.org>
SITE_URL=http://localhost:3000
```

**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate "App Password" at: https://myaccount.google.com/apppasswords
3. Use that app password in SMTP_PASS

### Step 3: Test the Flow
1. Open: `http://localhost:3000/donation.html`
2. Click "Join Now" button in the Membership section
3. Fill in the form with test data:
   - Name: Test User
   - Mobile: 9876543210
   - Email: test@example.com
   - Aadhar: 123456789012
4. Click "Proceed to Payment"
5. You'll be redirected to payment gateway (placeholder)
6. In production, after payment success, user returns to payment-success.html
7. Member account is created automatically
8. Welcome email is sent (if configured)

## 📋 Current Flow

```
User clicks "Join Now"
         ↓
Fills member form (name, mobile, email, aadhar)
         ↓
Data saved to localStorage
         ↓
Redirects to Payment Gateway
         ↓
Payment Success
         ↓
Redirects to payment-success.html
         ↓
Calls /api/pay/simulate-join
         ↓
Backend creates:
  - Unique Member ID (FWF-XXXXXX)
  - Random Password
  - Database Entry
  - Wallet Entry
         ↓
Sends Welcome Email with credentials
         ↓
Shows success page with Member ID
         ↓
Member can login to dashboard
```

## 🎯 What Member Gets

1. **Unique Member ID**: FWF-000001, FWF-000002, etc.
2. **Secure Password**: Random 10-character password
3. **Welcome Email**: With login credentials
4. **Dashboard Access**: Can login at member-dashboard.html
5. **Wallet**: Initialized wallet account

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ Form validation (mobile, email, aadhar format)
- ✅ Duplicate prevention (mobile/email check)
- ✅ JWT authentication for dashboard
- ✅ Secure random password generation

## 📁 Files Changed

### Modified:
- `donation.html` - Updated member modal
- `backend/server.js` - Added email functionality
- `backend/package.json` - Added nodemailer
- `backend/.env.example` - Added email config

### Created:
- `payment-success.html` - Payment success page
- `MEMBER_FLOW.md` - Detailed documentation
- `MEMBER_SETUP.md` - This quick guide

## ⚠️ Important Notes

1. **Payment Gateway**: Currently uses placeholder URL. Replace with actual payment gateway (Razorpay, PayU, etc.)

2. **Email Service**: 
   - Works without email configured
   - Just won't send welcome emails
   - Member ID and password shown on success page

3. **Testing Without Payment**:
   - Can directly call API: `POST /api/pay/simulate-join`
   - Use Postman or curl to test

4. **Member Login**:
   - Go to: `member-dashboard.html`
   - Use Member ID and password

## 🔄 Next Steps (For Production)

1. **Integrate Real Payment Gateway**
   - Razorpay / PayU / Paytm
   - Handle webhooks
   - Verify payment before member creation

2. **Email Verification**
   - Send verification link
   - Confirm email before activation

3. **Password Reset**
   - Forgot password flow
   - Email reset link

4. **Member Dashboard**
   - Complete profile
   - Project selection
   - Wallet management

## 🐛 Troubleshooting

### Email not sending?
- Check SMTP credentials in .env
- Gmail: Make sure App Password is used, not regular password
- Check server logs for email errors

### Member ID not generating?
- Check server logs
- Verify database file exists in `backend/data/`
- Check ORG_PREFIX in .env

### Form not submitting?
- Open browser console (F12)
- Check for JavaScript errors
- Verify server is running

## 📞 Testing API Directly

```bash
# Test member creation
curl -X POST http://localhost:3000/api/pay/simulate-join \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "mobile": "9876543210",
    "email": "test@example.com",
    "aadhar": "123456789012"
  }'
```

Response:
```json
{
  "ok": true,
  "memberId": "FWF-000001",
  "password": "Abc123@xyz"
}
```

---

**Status**: ✅ Fully Functional
**Server**: http://localhost:3000
**Last Updated**: October 16, 2025
