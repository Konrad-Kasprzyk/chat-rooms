const structuredClone = require("@ungap/structured-clone");
if (!("structuredClone" in globalThis)) {
  globalThis.structuredClone = structuredClone.default;
}

if (process.env.NODE_ENV !== "production") {
  const fs = require("fs");
  const envFile = fs.readFileSync(".env", "utf8");
  const indexOfAppCheckDebugToken = envFile.indexOf("FIREBASE_APPCHECK_DEBUG_TOKEN");
  const envFileFromAppCheckDebugToken = envFile.slice(
    indexOfAppCheckDebugToken + "FIREBASE_APPCHECK_DEBUG_TOKEN".length + 2
  );
  const indexOfEndAppCheckDebugToken = envFileFromAppCheckDebugToken.indexOf('"');
  const appCheckDebugToken = envFileFromAppCheckDebugToken.slice(0, indexOfEndAppCheckDebugToken);
  process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN = appCheckDebugToken;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Accept-CH",
            value: "Sec-CH-Prefers-Color-Scheme",
          },
          {
            key: "Vary",
            value: "Sec-CH-Prefers-Color-Scheme",
          },
          {
            key: "Critical-CH",
            value: "Sec-CH-Prefers-Color-Scheme",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
