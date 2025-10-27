export default function handler(req, res) {
  // Simple API endpoint - this will be replaced by actual serverless functions
  if (req.method === 'GET') {
    res.status(200).json({ message: 'API is working' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}