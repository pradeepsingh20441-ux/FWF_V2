// API endpoint to send confirmation email
import { getTransporter } from "../../lib/mailer.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { name, email, ticketNumber } = req.body;

    if (!name || !email || !ticketNumber) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const transporter = getTransporter();

    // Send confirmation email to participant
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject: "🎉 Contest Entry Confirmed - Your Ticket Number",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #fef3c7 0%, #fecaca 100%); border-radius: 16px;">
          <div style="background: white; padding: 30px; border-radius: 12px;">
            <h1 style="color: #f59e0b; text-align: center; margin-bottom: 20px;">
              🎯 Idea Pitch Contest
            </h1>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Dear <strong>${name}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              आपकी Contest Entry सफलतापूर्वक Submit हो गई है! धन्यवाद!
            </p>
            
            <div style="background: linear-gradient(90deg, #fef3c7, #fecaca); border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
              <p style="margin: 0; color: #92400e; font-weight: 600;">Your Ticket Number:</p>
              <h2 style="color: #f59e0b; font-size: 32px; font-weight: 900; font-family: monospace; margin: 10px 0;">
                ${ticketNumber}
              </h2>
            </div>
            
            <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #166534; margin: 0 0 10px;">📋 Contest Details:</h3>
              <ul style="color: #166534; line-height: 1.8; margin: 0;">
                <li><strong>Theme:</strong> "Your business idea that can help society."</li>
                <li><strong>Format:</strong> 50 words maximum</li>
                <li><strong>Prizes:</strong> Top 3 winners get rewards & recognition</li>
                <li><strong>Impact:</strong> Your contribution supports women entrepreneurs</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 25px;">
              🏆 Winners की घोषणा जल्द ही की जाएगी।<br>
              💚 आपके योगदान के लिए धन्यवाद!
            </p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Best regards,<br>
              <strong>FWF Team</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `
    });

    // Send notification to admin
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `New Contest Entry: ${name} (${ticketNumber})`,
      text: `
New Contest Entry Received:

Name: ${name}
Email: ${email}
Ticket Number: ${ticketNumber}
Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Check the data/contest folder for full details.
      `
    });

    console.log(`Confirmation email sent to ${email}`);
    return res.json({ ok: true, message: "Email sent successfully" });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
