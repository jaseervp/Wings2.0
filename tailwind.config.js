/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        background: "var(--bg)",
        card: "var(--card)",
        text: "var(--text)",
        muted: "var(--muted)",
        success: "var(--success)",
      },
      fontFamily: {
        heading: ["Nunito", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      }
    },
  },
  plugins: [],
}
