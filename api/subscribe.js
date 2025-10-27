export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;
    
    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email address' });
    }
    
    // Simulate subscription (in real app, save to database)
    res.status(200).json({ 
      ok: true, 
      message: 'Successfully subscribed to updates!' 
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}