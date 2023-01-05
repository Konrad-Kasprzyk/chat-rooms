require("dotenv").config();
const admin = require("firebase-admin");
const fs = require("fs");

const adminApp = admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY?.replaceAll("\\n", "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.PROJECT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  }),
});

async function deployFirestoreRules() {
  const source = fs.readFileSync("firestore.rules", "utf8");
  await admin.securityRules(adminApp).releaseFirestoreRulesetFromSource(source);
}

deployFirestoreRules();
