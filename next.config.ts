import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "img.freepik.com",
      "www.samatak.com",
      "www.talab.org",
      "i1.delgarm.com",
      "tiktarh.com",
      "i.pinimg.com",
      "rgb360.ir",
      "plus.unsplash.com",
      "images.unsplash.com" // ← دامنه‌ی جدید اضافه شد
    ],
     unoptimized: true, // Try this if images still don't load
  },
};

export default nextConfig;
