"use client";

import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="relative w-full h-[60vh] my-20 overflow-hidden rounded-2xl shadow-lg">
      {/* پس‌زمینه */}
      <div className="absolute inset-0">
        <Image
          src="/Images/photo-1496582490020-60c1344c64aa.avif"
          alt="Coffee Banner"
          fill
          className="object-cover brightness-75"
          priority
        />
      </div>

      {/* پوشش تیره روی عکس */}
      <div className="absolute inset-0 bg-black/40" />

      {/* متن و دکمه */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full text-white px-4">
        <h2 className="text-3xl sm:text-5xl font-bold mb-4 drop-shadow-lg">
          قهوه‌ای خاص برای سلیقه‌های خاص
        </h2>

        <p className="text-lg sm:text-2xl mb-8 max-w-2xl text-gray-200">
          طعم واقعی قهوه را با محصولات ویژه ما تجربه کنید — از بهترین دانه‌ها تا لحظه‌ای لذت‌بخش.
        </p>

        <button className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors">
          مشاهده محصولات
        </button>
      </div>
    </section>
  );
}