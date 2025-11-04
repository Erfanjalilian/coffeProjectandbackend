"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <main className=" overflow-x-hidden min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] overflow-hidden">
        <Image
          src="https://i.pinimg.com/736x/2c/9f/31/2c9f314458a35a9526a4960228d6a4f0.jpg"
          alt="Coffee contact background"
          fill
          className="object-cover object-center brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl font-bold text-white drop-shadow-lg"
          >
            تماس با ما
          </motion.h1>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-amber-800 mb-4">با ما در ارتباط باشید</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-7">
            اگر سوالی دارید، یا می‌خواهید درباره محصولات و خدمات ما بیشتر بدانید، کافیست فرم زیر را پر کنید یا از روش‌های تماس مستقیم استفاده کنید.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-700">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-amber-800">آدرس</h4>
                <p className="text-gray-600">تهران، خیابان ولیعصر، پلاک ۱۲۳</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-700">
                <Phone size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-amber-800">تلفن</h4>
                <p className="text-gray-600">۰۲۱-۱۲۳۴۵۶۷۸</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full text-amber-700">
                <Mail size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-amber-800">ایمیل</h4>
                <p className="text-gray-600">info@coffeeland.ir</p>
              </div>
            </div>

            {/* Static Map Image */}
            <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="https://rgb360.ir/wp-content/themes/rgb360/assets/img/vector-desc.jpg"
                alt="CoffeeLand location map"
                fill
                className="object-cover object-center"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-amber-50 p-8 rounded-2xl shadow-md space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="block text-gray-700 mb-2 text-sm font-medium">نام و نام خانوادگی</label>
              <input
                type="text"
                placeholder="مثلاً مهدی رضایی"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm font-medium">ایمیل</label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm font-medium">پیام شما</label>
              <textarea
                rows={5}
                placeholder="متن پیام خود را بنویسید..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-600"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-amber-700 text-white font-semibold py-2 rounded-lg hover:bg-amber-800 transition"
            >
              ارسال پیام
            </motion.button>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
