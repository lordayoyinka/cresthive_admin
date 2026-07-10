// src/pages/api/send-admission-email.js
//
// Sends the Exam Number + Passkey email once payment is confirmed.
// Uses Resend (https://resend.com) — free tier, no SMTP setup needed.
//
// Setup:
//   1. Create a free Resend account.
//   2. Verify a sending domain (e.g. crestscholars.com) under
//      Resend -> Domains, so you can send from something like
//      admissions@crestscholars.com. Until it's verified, you can test
//      with the built-in onboarding@resend.dev sender (Resend limits
//      who this can send to until a domain is verified — check their
//      dashboard for current limits).
//   3. Add these to Vercel env vars for cresthive_admin:
//        RESEND_API_KEY = your Resend API key
//        RESEND_FROM     = e.g. "CrestHive Admissions <admissions@crestscholars.com>"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, studentName, applicationRef, examNumber, passkey } = req.body || {};

  if (!to || !applicationRef || !examNumber || !passkey) {
    return res.status(400).json({ error: "to, applicationRef, examNumber and passkey are required" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    return res.status(500).json({ error: "Email is not configured (missing env vars)" });
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color:#00693d;">CrestHive International School</h2>
      <p>Dear Parent/Guardian,</p>
      <p>We're pleased to confirm that payment for <strong>${studentName || "your child"}</strong>'s
      admission application (Reference: <strong>${applicationRef}</strong>) has been received.</p>
      <p>Please find the entrance examination details below. Keep these safe — your child will need
      them to log in and take the exam.</p>
      <table style="width:100%; border-collapse:collapse; margin:20px 0;">
        <tr>
          <td style="padding:10px; background:#f2f2f2; font-weight:bold; border:1px solid #ddd;">Exam Number</td>
          <td style="padding:10px; border:1px solid #ddd; font-family:monospace;">${examNumber}</td>
        </tr>
        <tr>
          <td style="padding:10px; background:#f2f2f2; font-weight:bold; border:1px solid #ddd;">Passkey</td>
          <td style="padding:10px; border:1px solid #ddd; font-family:monospace;">${passkey}</td>
        </tr>
      </table>
      <p>You can also retrieve these anytime on our
      <a href="https://www.crestscholars.com/check-status.html">Check Application Status</a> page
      using your Application Reference Number.</p>
      <p>Best regards,<br/>CrestHive International School</p>
    </div>
  `;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Your CrestHive Exam Details (${applicationRef})`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      return res.status(502).json({ error: "Resend failed", details: errText });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected server error", details: String(err) });
  }
}
