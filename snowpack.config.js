//** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "dist": "/",
    "src": "/",
    "node_modules/@fontsource/manrope/files": "/files",
  },
  devOptions: {
    tailwindConfig: "./tailwind.config.js",
  },
  plugins: [
    "@snowpack/plugin-postcss",
  ],
};
