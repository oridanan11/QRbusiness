import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // אתר סטטי בלבד: בלי שרת, בלי מסד נתונים
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
