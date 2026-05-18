import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#00150e",
          900: "#082c21",
          700: "#244c3c"
        },
        moss: {
          500: "#729586"
        },
        lime: {
          300: "#c9ff35",
          400: "#bff529"
        },
        mist: {
          50: "#f9f9f9",
          100: "#f3f3f4",
          200: "#e2e2e2"
        },
        ink: "#1a1c1c",
        muted: "#414845"
      },
      fontFamily: {
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        ambient: "0 32px 80px rgba(0, 21, 14, 0.12)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -24px 42px rgba(8,44,33,0.06), 0 28px 80px rgba(0,21,14,0.16)",
        lime: "0 18px 46px rgba(191, 245, 41, 0.34)"
      },
      borderRadius: {
        brand: "16px",
        glass: "22px"
      },
      keyframes: {
        mistOne: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(-12deg)" },
          "50%": { transform: "translate3d(-30px, 16px, 0) rotate(-10deg)" }
        },
        mistTwo: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(10deg)" },
          "50%": { transform: "translate3d(28px, -14px, 0) rotate(8deg)" }
        },
        dropletLift: {
          "0%, 100%": {
            opacity: "0.42",
            transform: "translate3d(0, 12px, 48px) rotate(38deg) scale(0.86)"
          },
          "42%": { opacity: "0.9" },
          "68%": {
            opacity: "0.74",
            transform: "translate3d(10px, -18px, 86px) rotate(38deg) scale(1)"
          }
        },
        floatLeaf: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(18px, -22px, 0)" }
        }
      },
      animation: {
        mistOne: "mistOne 11s ease-in-out infinite",
        mistTwo: "mistTwo 13s ease-in-out infinite",
        droplet: "dropletLift 6.8s ease-in-out infinite",
        leaf: "floatLeaf 12s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
