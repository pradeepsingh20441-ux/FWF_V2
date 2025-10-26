// API endpoint to save contest idea
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { ticketNumber, idea } = req.body;

    if (!ticketNumber || !idea) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    // Validate word count
    const words = idea.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length > 50) {
      return res.status(400).json({ ok: false, error: "Idea exceeds 50 words limit" });
    }

    console.log('Contest Idea Submitted:', { ticketNumber, wordCount: words.length });

    // Store idea with ticket
    const fs = require('fs');
    const path = require('path');
    const dataDir = path.join(process.cwd(), 'data', 'contest');
    const ticketFile = path.join(dataDir, `${ticketNumber}.json`);
    
    if (fs.existsSync(ticketFile)) {
      const ticketData = JSON.parse(fs.readFileSync(ticketFile, 'utf8'));
      ticketData.idea = idea;
      ticketData.ideaSubmitted = true;
      ticketData.ideaSubmittedAt = new Date().toISOString();
      ticketData.wordCount = words.length;
      
      fs.writeFileSync(ticketFile, JSON.stringify(ticketData, null, 2));
    } else {
      return res.status(404).json({ ok: false, error: "Ticket not found" });
    }

    return res.json({ ok: true, ticketNumber, wordCount: words.length });
  } catch (err) {
    console.error('Error saving idea:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
