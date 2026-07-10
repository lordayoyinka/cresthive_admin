// src/pages/api/get-admission-pdf.js
//
// The admission docs repo is PRIVATE, so the admin browser can't fetch
// raw.githubusercontent.com URLs directly. This route fetches the file
// server-side (where the GitHub token lives) and streams it back.
//
// Requires the same GITHUB_TOKEN / GITHUB_OWNER used elsewhere in this
// project, plus GITHUB_DOCS_REPO and GITHUB_BRANCH for the private repo.

export default async function handler(req, res) {
  const { path } = req.query;
  if (!path) {
    return res.status(400).json({ error: "path query param is required" });
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_DOCS_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    return res.status(500).json({ error: "Document storage is not configured (missing env vars)" });
  }

  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const ghRes = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    });

    if (!ghRes.ok) {
      const errText = await ghRes.text();
      return res.status(ghRes.status).json({ error: "Could not fetch file", details: errText });
    }

    const data = await ghRes.json();
    const buffer = Buffer.from(data.content, "base64");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${path.split("/").pop()}"`);
    return res.status(200).send(buffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected server error", details: String(err) });
  }
}
