// API endpoint to save contest ticket
import { getTransporter } from "../lib/mailer.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { ticketNumber, name, email, mobile } = req.body;

    if (!ticketNumber || !name || !email || !mobile) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    // TODO: Save to database (SQLite or MongoDB based on your backend choice)
    // For now, just logging
    console.log('Contest Ticket Created:', { ticketNumber, name, email, mobile });

    // Store in file temporarily (you can replace this with DB save)
    const fs = require('fs');
    const path = require('path');
    const dataDir = path.join(process.cwd(), 'data', 'contest');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const ticketData = {
      ticketNumber,
      name,
      email,
      mobile,
      createdAt: new Date().toISOString(),
      paymentStatus: 'completed',
      ideaSubmitted: false
    };
    
    fs.writeFileSync(
      path.join(dataDir, `${ticketNumber}.json`),
      JSON.stringify(ticketData, null, 2)
    );

    return res.json({ ok: true, ticketNumber });
  } catch (err) {
    console.error('Error saving ticket:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
