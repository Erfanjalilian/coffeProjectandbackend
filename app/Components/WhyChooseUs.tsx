"use client";

import { motion } from "framer-motion";
import { FaShippingFast, FaCoffee, FaDollarSign, FaStar } from "react-icons/fa";

interface Feature {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function WhyChooseUs() {
  const features: Feature[] = [
    {
      id: 1,
      icon: <FaCoffee className="text-4xl text-amber-700" />,
      title: "کیفیت بالا",
      description: "استفاده از بهترین دانه‌های عربیکا و روبوستا برای طعمی بی‌نظیر.",
    },
    {
      id: 2,
      icon: <FaShippingFast className="text-4xl text-amber-700" />,
      title: "ارسال سریع",
      description: "سفارشات عمده با سرعت بالا و بسته‌بندی حرفه‌ای ارسال می‌شوند.",
    },
    {
      id: 3,
      icon: <FaDollarSign className="text-4xl text-amber-700" />,
      title: "قیمت مناسب",
      description: "قیمت منصفانه برای خرید عمده و همکاری طولانی مدت.",
    },
    {
      id: 4,
      icon: <FaStar className="text-4xl text-amber-700" />,
      title: "رضایت مشتری",
      description: "تضمین کیفیت و رضایت کامل مشتریان عمده و کافه‌ها.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-amber-800 mb-12 text-center">
          چرا ما را انتخاب کنید؟
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.id * 0.2 }}
              className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
