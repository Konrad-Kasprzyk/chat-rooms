const structuredClone = require("@ungap/structured-clone");
if (!("structuredClone" in globalThis)) {
  globalThis.structuredClone = structuredClone.default;
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
        ],
      },
    ];
  },
};

module.exports = nextConfig;
