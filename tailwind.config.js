

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",  // Custom CSS variable for background
        foreground: "var(--foreground)",  // Custom CSS variable for foreground
      },
    },
  },
  plugins: [],
}