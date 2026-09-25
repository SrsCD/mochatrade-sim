import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          canvas: "#F7F8FA",
          surface: "#FFFFFF",
          subtle: "#F1F5F9",
          border: "#E2E8F0",
          borderLight: "#EEF2F6",
          hover: "#F8FAFC"
        },
        ink: {
          primary: "#0F172A",
          secondary: "#64748B",
          tertiary: "#94A3B8"
        },
        teal: {
          brand: "#0F766E",
          hover: "#0D9488",
          subtle: "#F0FDFA",
          border: "#CCFBF1"
        },
        badge: {
          pos: "#15803D",
          posBg: "#F0FDF4",
          posBorder: "#DCFCE7",
          neg: "#B91C1C",
          negBg: "#FEF2F2",
          negBorder: "#FEE2E2"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"]
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.03)"
      }
    },
  },
  plugins: [],
} satisfies Config;
