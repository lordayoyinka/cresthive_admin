// src/pages/api/upload-to-github.js
//
// Receives a base64-encoded image from the CMS and commits it to the
// crestlandpage repo (the public site) via the GitHub Contents API.
// Vercel then auto-redeploys crestlandpage, and the image goes live at
// a jsDelivr CDN URL — no Firebase Storage involved.
//
// Required environment variables (set in Vercel project settings for
// cresthive_admin, NOT committed to git):
//   GITHUB_TOKEN   - fine-grained PAT, Contents: Read & Write, scoped to
//                    the crestlandpage repo only
//   GITHUB_OWNER   - "lordayoyinka"
//   GITHUB_REPO    - "crestlandpage"
//   GITHUB_BRANCH  - "main"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { folder, filename, contentBase64 } = req.body || {};

  if (!folder || !filename || !contentBase64) {
    return res.status(400).json({ error: "folder, filename and contentBase64 are required" });
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    return res.status(500).json({ error: "GitHub upload is not configured (missing env vars)" });
  }

  // Keep uploads inside assets/cms-uploads/<folder>/<filename>
  const safeFolder = String(folder).replace(/[^a-zA-Z0-9_-]/g, "-");
  const safeFilename = String(filename).replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `assets/cms-uploads/${safeFolder}/${safeFilename}`;

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    // Check whether the file already exists (needed to update rather than create)
    let sha;
    const existing = await fetch(`${apiUrl}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (existing.status === 200) {
      const existingData = await existing.json();
      sha = existingData.sha;
    }

    const commitRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: sha
          ? `CMS: update ${safeFolder}/${safeFilename}`
          : `CMS: add ${safeFolder}/${safeFilename}`,
        content: contentBase64,
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!commitRes.ok) {
      const errBody = await commitRes.text();
      console.error("GitHub commit failed:", errBody);
      return res.status(502).json({ error: "GitHub commit failed", details: errBody });
    }

    // jsDelivr serves any public GitHub file as a fast, cached CDN URL.
    // Note: jsDelivr caches for ~12h; append ?v=timestamp if you need to
    // force-bust the cache for updated images with the same filename.
    const cdnUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`;

    return res.status(200).json({ url: cdnUrl, path });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Unexpected server error", details: String(err) });
  }
}
