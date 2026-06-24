const nodemailer = require("nodemailer");

const TEMPLATES = {
  resident: {
    subject: "Welcome to Our Airdrie!",
    heading: "Welcome to Our Airdrie!",
    body: "Thanks for signing up. You're on the list for our weekly email with new local businesses, events, and deals around Airdrie - we're putting it together and you'll get the first one soon.",
    footer: "No spam, ever. You can unsubscribe anytime just by replying to one of our emails."
  },
  business: {
    subject: "You're a founding member of Our Airdrie!",
    heading: "Welcome aboard!",
    body: "Thanks for claiming your free founding listing on Our Airdrie. We'll review your details and follow up shortly to get your business fully listed in the directory. As a founding member, you'll get priority placement as the site grows.",
    footer: "Questions in the meantime? Just reply to this email."
  }
};

function buildHtml(type) {
  const t = TEMPLATES[type];
  return `
  <div style="background:#FBF7F0; padding:32px 16px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:480px; margin:0 auto; background:#FFFFFF; border-radius:10px; overflow:hidden; border:1px solid #E5DFD3;">
      <div style="background:#1B3A4B; padding:28px 28px 22px;">
        <span style="color:#FFFFFF; font-size:20px; font-weight:700;">Our<span style="color:#E8A33D;">Airdrie</span></span>
      </div>
      <div style="padding:28px;">
        <h1 style="color:#1B3A4B; font-size:22px; margin:0 0 14px;">${t.heading}</h1>
        <p style="color:#2B2B2B; font-size:15.5px; line-height:1.6; margin:0 0 16px;">${t.body}</p>
        <p style="color:#6B6B6B; font-size:13.5px; line-height:1.6; margin:0;">${t.footer}</p>
      </div>
      <div style="background:#F3ECE0; padding:16px 28px; text-align:center;">
        <span style="color:#6B6B6B; font-size:12px;">Our Airdrie - an independent community project for Airdrie, AB</span>
      </div>
    </div>
  </div>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email, type } = req.body || {};

  if (!email || !TEMPLATES[type]) {
    res.status(400).json({ error: "Missing or invalid email/type" });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zohocloud.ca",
      port: 587,
      secure: false,
      auth: {
        user: "contact@ourairdrie.ca",
        pass: process.env.ZOHO_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: '"Our Airdrie" <contact@ourairdrie.ca>',
      to: email,
      subject: TEMPLATES[type].subject,
      html: buildHtml(type)
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Send failed", message: err.message });
  }
};
