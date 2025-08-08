/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          50: "#f7f7f8",
          100: "#eef0f3",
          200: "#dfe3ea",
          900: "#0b0c0f"
        }
      },
      backdropBlur: {
        xs: "2px"
      },
      dropShadow: {
        glow: "0 8px 30px rgba(0,0,0,0.25)"
      }
    }
  },
  plugins: []
};


