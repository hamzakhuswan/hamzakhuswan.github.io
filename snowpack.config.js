//** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "public": { url: '/', static: true, resolve: false },
    "src": "/"
  },
  devOptions: {
    tailwindConfig: "./tailwind.config.js",
  },
  plugins: [
    "@snowpack/plugin-postcss",
  ],
};
