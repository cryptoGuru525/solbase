/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css,scss}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "black",
        secondary: "#0b1939f5",
        symbol: "#0052ff",
        symbolHover: "#073ba9",
        symbolBorder: "#07338f9e",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
