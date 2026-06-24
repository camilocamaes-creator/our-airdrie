const NOTIFY_EMAIL = "contact@ourairdrie.ca";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const upstream = await fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Referer": "https://www.ourairdrie.ca/"
      },
      body: JSON.stringify(req.body)
    });

    const upstreamBody = await upstream.text();

    if (!upstream.ok) {
      res.status(502).json({ error: "Upstream submission failed", upstreamStatus: upstream.status, upstreamBody });
      return;
    }

    res.status(200).json({ success: true, upstreamBody });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
}
