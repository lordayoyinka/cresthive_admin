// This route runs server-side only (Vercel serverless function) — it's the
// one place allowed to use the Firebase Admin SDK, since verifying an ID
// token requires credentials that must never be shipped to the browser.
//
// Flow: crestlandpage's login page signs the user in, gets a Firebase ID
// token (proof of identity, no password inside), and redirects here with
// ?token=<that ID token>. SignIn.jsx calls this route with that token.
// We verify it's genuinely signed by Firebase and not expired, then mint a
// short-lived custom token for the same user so the browser can establish
// a real Firebase Auth session in this app too.
//
// Requires these environment variables to be set in Vercel (from a Firebase
// service account — see Firebase Console > Project Settings > Service
// Accounts > Generate new private key):
//   FIREBASE_ADMIN_PROJECT_ID
//   FIREBASE_ADMIN_CLIENT_EMAIL
//   FIREBASE_ADMIN_PRIVATE_KEY   (paste the key with literal \n for newlines)

import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // Vercel env vars can't hold real newlines, so the private key is stored
  // with literal "\n" sequences and needs converting back here.
  const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials — set FIREBASE_ADMIN_PROJECT_ID, " +
      "FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY in Vercel."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { idToken } = req.body || {};
  if (!idToken) {
    return res.status(400).json({ error: "Missing idToken" });
  }

  try {
    const app = getAdminApp();
    const auth = getAuth(app);

    // Checks the token's signature against Firebase's own public keys,
    // confirms it hasn't expired, and confirms it was issued for this
    // exact Firebase project. No shared secret involved anywhere here.
    const decoded = await auth.verifyIdToken(idToken);

    // Mint a short-lived custom token for the same verified user, so the
    // browser can sign in for real in this app via signInWithCustomToken.
    const customToken = await auth.createCustomToken(decoded.uid);

    return res.status(200).json({
      customToken,
      uid: decoded.uid,
      email: decoded.email || null,
    });
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
