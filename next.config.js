const structuredClone = require("@ungap/structured-clone");
if (!("structuredClone" in globalThis)) {
  globalThis.structuredClone = structuredClone.default;
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;
