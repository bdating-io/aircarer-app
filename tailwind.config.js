/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // 扫描 app 文件夹中的所有 TS/TSX 文件
    "./components/**/*.{js,jsx,ts,tsx}", // 扫描 components 文件夹中的所有 TS/TSX 文件
    "./screens/**/*.{js,jsx,ts,tsx}", // 扫描 screens 文件夹中的所有 TS/TSX 文件
    "./navigation/**/*.{js,jsx,ts,tsx}", // 扫描 navigation 文件夹中的所有 TS/TSX 文件
    "./*.{js,jsx,ts,tsx}", // 扫描根目录的所有 JS/TS 文件
  ],
  presets: [
    require("nativewind/preset"), // 加载 NativeWind 的预设配置
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007bff", // 主按钮颜色
        secondary: "#6c757d", // 次按钮颜色
        background: "#f8f9fa", // 页面背景颜色
        accent: "#28a745", // 强调颜色
        danger: "#e74c3c", // 危险颜色
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
        "4xl": "32px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-linear": "linear-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        custom: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // 表单插件
    require("@tailwindcss/typography"), // 排版插件
  ],
};
