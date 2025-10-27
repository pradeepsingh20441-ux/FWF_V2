export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ ok: false, error: 'All fields are required' });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email address' });
    }
    
    // Simulate contact form submission (in real app, save to database and send email)
    res.status(200).json({ 
      ok: true, 
      message: 'Message sent successfully! We will respond soon.' 
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}