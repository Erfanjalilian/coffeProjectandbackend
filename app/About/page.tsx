"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  return (
    <main className=" overflow-x-hidden min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden">
        <Image
          src="https://img.freepik.com/premium-photo/cup-coffee-with-steam-coming-out-it_1127771-483.jpg"
          alt="Coffee beans and cups"
          fill
          priority
          className="object-cover object-center brightness-75"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl font-bold text-white drop-shadow-lg"
          >
            درباره ما
          </motion.h1>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-amber-800 mb-4">
            داستان قهوه‌لند
          </h2>
          <p className="text-gray-600 leading-8">
            قهوه‌لند از دل عشق به عطر و طعم قهوه متولد شد. سال‌ها تجربه‌ی
            سفر، جست‌وجو و تحقیق درباره‌ی انواع دانه‌های قهوه، ما را بر آن داشت
            تا بهترین کیفیت را به دوست‌داران قهوه ارائه دهیم. در قهوه‌لند ما
            اعتقاد داریم که هر فنجان قهوه باید تجربه‌ای خاص و بی‌تکرار باشد.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-[350px] rounded-2xl overflow-hidden shadow-lg"
          >
            <Image
              src="https://img.freepik.com/premium-photo/top-view-coffee-cup-coffee-beans-dark-table_1234738-37862.jpg"
              alt="Coffee shop interior"
              fill
              className="object-cover object-center"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-semibold text-amber-800 mb-4">
              کیفیت، صداقت، تجربه
            </h3>
            <p className="text-gray-600 leading-8 mb-4">
              از لحظه‌ی انتخاب دانه تا بسته‌بندی نهایی، همه‌چیز با دقت و عشق
              انجام می‌شود. ما با تولیدکنندگان معتبر جهانی همکاری می‌کنیم تا
              دانه‌هایی با طعم غنی و عطر بی‌نظیر را در اختیار شما قرار دهیم.
            </p>
            <p className="text-gray-600 leading-8">
              هدف ما فراتر از فروش قهوه است — ما می‌خواهیم فرهنگ نوشیدن قهوه را
              با اصالت و کیفیت دوباره تعریف کنیم. در قهوه‌لند هر محصول یک داستان
              دارد و هر فنجان، یک خاطره.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-amber-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-amber-800 mb-6"
          >
            مأموریت ما
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gray-700 leading-8 max-w-3xl mx-auto"
          >
            مأموریت قهوه‌لند ساده است: ارائه‌ی قهوه‌ای اصیل و باکیفیت به مشتریان
            ایرانی، در فضایی مدرن و حرفه‌ای. ما به عنوان یک برند مستقل، با
            تمرکز بر رضایت مشتری و حفظ محیط زیست، سعی داریم زنجیره‌ی تأمین قهوه
            را شفاف و پایدار نگه داریم.
          </motion.p>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center text-amber-800 mb-12"
        >
          تیم ما
        </motion.h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[
            { name: "مهدی رضایی", role: "مدیرعامل", img: "https://www.samatak.com/image/2017/02/1/421371978-samatak-com.jpg" },
            { name: "نگار موسوی", role: "کارشناس طعم‌شناسی", img: "https://www.talab.org/wp-content/uploads/2018/05/12820797-talab-org.jpg" },
            { name: "آرمان کریمی", role: "مدیر تولید", img: "https://i1.delgarm.com/pic/750/0/1/i/844/0012/23/622f99ce0e0b4.jpeg" },
          ].map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="bg-white shadow-lg rounded-2xl overflow-hidden"
            >
              <div className="relative w-full h-64">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="p-5 text-center">
                <h4 className="text-lg font-semibold text-gray-800">{member.name}</h4>
                <p className="text-amber-700 text-sm">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
