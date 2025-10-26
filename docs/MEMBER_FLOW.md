# Member Joining Flow Documentation

## Overview
This document explains the complete member joining workflow in the FWF system.

## Flow Steps

### 1. Member Fills Form
When a user clicks "Join Now" on the donation.html page, they fill out the membership form with:
- Full Name
- Mobile Number (10 digits)
- Email Address
- Aadhar Number (12 digits)

### 2. Form Validation
The form validates:
- All required fields are filled
- Mobile number is exactly 10 digits
- Email is in valid format
- Aadhar is exactly 12 digits
- Icons change color when fields are filled (visual feedback)

### 3. Payment Gateway Redirect
Upon form submission:
- Member data is temporarily stored in localStorage
- User is redirected to payment gateway with:
  - Amount: ₹200 (monthly membership fee)
  - Type: membership
  - Member details (name, mobile, email)
  - Callback URL: payment-success.html

**Payment Gateway URL (placeholder):**
```
https://payments.example.com/checkout?amount=200&type=membership&name=...&mobile=...&email=...
```

### 4. Payment Success Callback
After successful payment:
- User is redirected to `payment-success.html`
- The page shows a loading state while processing

### 5. Member Creation
The payment-success.html page:
1. Retrieves pending member data from localStorage
2. Calls backend API: `POST /api/pay/simulate-join`
3. Backend creates:
   - Unique Member ID (format: `FWF-XXXXXX`)
   - Random secure password
   - Database entry in users table
   - Wallet entry for the user
4. Backend sends welcome email with credentials

### 6. Welcome Email
Member receives an email containing:
- Welcome message
- Member ID
- Temporary password
- Login link to member dashboard
- Instructions for next steps

Email includes:
- Beautiful HTML design
- Security reminder to change password
- Dashboard access button
- List of available features

### 7. Success Display
The payment-success.html page displays:
- Success icon with animation
- Member ID
- Member details (name, email, mobile)
- Buttons to:
  - Go to Dashboard
  - Return to Home

### 8. Dashboard Access
Member can now:
- Login using Member ID and password
- Access member-dashboard.html
- View profile and wallet
- Browse projects and training

## API Endpoints

### POST /api/pay/simulate-join
Creates new member after payment success.

**Request Body:**
```json
{
  "name": "John Doe",
  "mobile": "9876543210",
  "email": "john@example.com",
  "aadhar": "123456789012",
  "transactionId": "TXN123456789",
  "amount": 200
}
```

**Response:**
```json
{
  "ok": true,
  "memberId": "FWF-000001",
  "password": "Abc123@xyz"
}
```

## Database Schema

### users table
- `id`: Auto-increment primary key
- `member_id`: Unique member ID (FWF-XXXXXX)
- `name`: Full name
- `mobile`: Mobile number (unique)
- `email`: Email address (unique)
- `password_hash`: Bcrypt hashed password
- `role`: 'member' or 'admin'
- `membership_active`: 1 for active, 0 for inactive
- `created_at`: Timestamp

### wallets table
- `user_id`: Foreign key to users.id
- `balance_inr`: Current wallet balance
- `lifetime_earned_inr`: Total earned
- `lifetime_applied_inr`: Total applied
- `updated_at`: Timestamp

## Environment Variables Required

```env
# Backend Server
PORT=3000
JWT_SECRET=your-secret-key
ORG_PREFIX=FWF

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM=FWF <noreply@fwf.org>
SITE_URL=http://localhost:3000
```

## Email Configuration

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" for nodemailer
3. Use the app password in SMTP_PASS

### Other SMTP Providers
- Set appropriate SMTP_HOST and SMTP_PORT
- Update SMTP_USER and SMTP_PASS
- Adjust SMTP_SECURE if using SSL/TLS

## Security Features

1. **Password Security**
   - Random 10-character passwords generated
   - Passwords hashed with bcrypt before storage
   - Never stored in plain text

2. **Data Validation**
   - Mobile number format validation (10 digits)
   - Email format validation
   - Aadhar number validation (12 digits)
   - Duplicate check before registration

3. **Session Management**
   - JWT tokens for authentication
   - HTTP-only cookies for security
   - 7-day token expiration

## Testing the Flow

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```

### 2. Open Frontend
Navigate to: `http://localhost:3000/donation.html`

### 3. Test Member Registration
1. Click "Join Now" button
2. Fill in the form with test data
3. Click "Proceed to Payment"
4. In real implementation, complete payment
5. Check payment-success.html for member details
6. Check email for welcome message

### 4. Test Login
1. Go to member-dashboard.html
2. Use Member ID and password from email
3. Access dashboard features

## Files Modified/Created

### Modified Files
- `donation.html`: Updated member modal with new form fields
- `backend/server.js`: Added email functionality and updated member creation
- `backend/package.json`: Added nodemailer dependency
- `backend/.env.example`: Added email configuration variables

### New Files
- `payment-success.html`: Payment success and member creation page
- `MEMBER_FLOW.md`: This documentation

## Next Steps

1. **Payment Gateway Integration**
   - Replace placeholder URL with actual payment gateway
   - Implement payment gateway webhooks
   - Handle payment failure cases

2. **Email Templates**
   - Create email template system
   - Add more email types (password reset, notifications)
   - Support both HTML and plain text emails

3. **Member Dashboard**
   - Complete dashboard UI
   - Add profile editing
   - Implement project selection
   - Add wallet management

4. **Security Enhancements**
   - Add email verification
   - Implement password reset flow
   - Add two-factor authentication
   - Rate limiting for API endpoints

## Support

For any issues or questions:
- Check server logs for errors
- Verify email configuration in .env
- Test with different SMTP providers if email fails
- Check browser console for frontend errors

---

**Last Updated:** October 16, 2025
**Version:** 1.0
