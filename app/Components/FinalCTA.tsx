"use client";

export default function FinalCTA() {
  return (
    <section className="relative bg-amber-800 text-white py-20 px-4 overflow-hidden">
      {/* طرح پس‌زمینه موج‌دار تزئینی */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          آماده‌اید همکاری خود را با ما آغاز کنید؟
        </h2>

        <p className="text-lg sm:text-xl mb-10 text-gray-100 max-w-3xl mx-auto">
          ما تأمین‌کننده مستقیم قهوه‌های مرغوب برای کافه‌ها، رستوران‌ها و فروشندگان عمده هستیم.
          همین حالا با ما تماس بگیرید و طعم واقعی کیفیت را تجربه کنید.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/contact"
            className="bg-white text-amber-800 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
          >
            تماس با ما
          </a>
          <a
            href="/products"
            className="border border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-amber-800 transition-colors"
          >
            مشاهده محصولات
          </a>
        </div>
      </div>
    </section>
  );
}