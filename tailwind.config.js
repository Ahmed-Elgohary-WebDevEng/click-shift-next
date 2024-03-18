/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "auth-pattern": "url(/img/login.png)",
        "curve-pattern": "url(/img/curve.png)",
      },
      colors: {
        black: "#222628",
        gray: {
          field: "#A0A09C",
          border: "#F3F3F3",
          button: "#F8F8F8",
          placeholder: "#939393",
          inputBorder: "rgba(177, 177, 177, 0.30)",
          card: "#F6F6F6",
          segment: "#F4F4F4",
          float: "#F1F1F1",
          layout: "#E2E2E2",
          orderCard: "#E8E8E8",
          bold: "#707070",
          faq: "#F7F7F5",
          progress: "#E9E9E9",
          disabledTab: "#B3B3B3",
          darkSegment: "#33393F",
          ad: "#EFEFEF",
        },
        dark: "#000",
        darkBg: "#18191D",
        darkBgUi3: "#383838",
        primary: {
          DEFAULT: "var(--primary)",
          ui4OpacityBg: "#FE72004D",
          ui3OpacityBg: "#E34F260D",
          ui4PrimaryBoldBg: "#5C2F08",
        },
        blue: {
          link: "#289AB3",
        },
        yellow: {
          DEFAULT: "#FFA826",
        },
        green: {
          DEFAULT: "#16AA16",
        },
        amber: {
          button: "#F2F2E8",
        },
        red: {
          DEFAULT: "#FF2640",
        },
      },
      dropShadow: {
        "3xl": "0px 20px 40px rgba(227, 79, 38, 0.66)",
        green: "0px 11px 30px rgba(0, 142, 0, 0.18)",
      },
      maxWidth: {
        compareWidth: "200px",
      },
      boxShadow: {
        select: "0px 20px 60px 0px rgba(168, 168, 169, 0.24)",
        bottom: "0 4px 2px -2px rgba(0, 0, 0, 0.3)",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "0.5rem",
        sm: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
      },
    },
  },
  darkMode: ["class"],
  plugins: [],
};
