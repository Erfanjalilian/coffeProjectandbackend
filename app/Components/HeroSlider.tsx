"use client";

import Image from "next/image";

export default function HeroSection() {
  const categories = [
    {
      id: 1,
      title: "دانه قهوه اسپرسو",
      items: [
        { name: "اسپشیال", image: "/Images/premium_photo-1674407009848-4da7a12b6b25.avif" },
        { name: "عربیکا", image: "/Images/premium_photo-1674327105076-36c4419864cf.avif" },
        { name: "دوبوستا", image: "/Images/premium_photo-1673545518947-ddf3240090b1.avif" },
        { name: "ترکیبی", image: "/Images/premium_photo-1671559021551-95106555ee19.avif" }
      ],
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
      accent: "bg-gradient-to-r from-amber-500 to-orange-500"
    },
    {
      id: 2,
      title: "قهوه های ترکیبی",
      items: [
        { name: "ترکیب آریو", image: "/Images/premium_photo-1671379526961-1aebb82b317b.avif" },
        { name: "", image: "/Images/premium_photo-1669687924558-386bff1a0469.avif" },
        { name: "ترکیب فول کافئین", image: "/Images/premium_photo-1664970900335-a7c99062bc51.avif" },
        { name: "ترکیب ۱۰۰٪ عربیکا", image: "/Images/photo-1621135177072-57c9b6242e7a.avif" }
      ],
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      accent: "bg-gradient-to-r from-emerald-500 to-teal-600"
    },
    {
      id: 3,
      title: "اکسسوری قهوه",
      items: [
        { name: "تجهیزات اسپرسو", image: "/Images/photo-1596098823457-74e360fcd023.avif" },
        { name: "موکاپات", image: "/Images/photo-1594075731547-8c705bb69e50.avif" },
        { name: "آسیاب قهوه", image: "/Images/photo-1592663527359-cf6642f54cff.avif" },
        { name: "تجهیزات کافه", image: "/Images/photo-1514432324607-a09d9b4aefdd.avif" }
      ],
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      accent: "bg-gradient-to-r from-blue-500 to-indigo-600"
    },
    {
      id: 4,
      title: "دستگاه اسپرسو ساز",
      items: [
        { name: "اسپروساز خانگی", image: "/Images/photo-1514066558159-fc8c737ef259.avif" },
        { name: "نیمه صنعتی", image: "/Images/photo-1503481766315-7a586b20f66d.avif" },
        { name: "فرانسه", image: "/Images/photo-1525088553748-01d6e210e00b.avif" },
        { name: "ترک ساز", image: "/Images/premium_photo-1674407009848-4da7a12b6b25.avif" }
      ],
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      accent: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      id: 5,
      title: "قهوه‌های فصلی",
      items: [
        { name: "قهوه زمستانی", image: "/Images/premium_photo-1674407009848-4da7a12b6b25.avif" },
        { name: "بلند دم", image: "/Images/premium_photo-1674327105076-36c4419864cf.avif" },
        { name: "کوتاه دم", image: "/Images/premium_photo-1673545518947-ddf3240090b1.avif" },
        { name: "مخلوط ویژه", image: "/Images/premium_photo-1671559021551-95106555ee19.avif" }
      ],
      gradient: "from-rose-500 to-pink-600",
      bgGradient: "from-rose-50 to-pink-50",
      accent: "bg-gradient-to-r from-rose-500 to-pink-600"
    },
    {
      id: 6,
      title: "دمنوش و شکلات",
      items: [
        { name: "تلخ", image: "/Images/photo-1596098823457-74e360fcd023.avif" },
        { name: "دست ساز", image: "/Images/photo-1594075731547-8c705bb69e50.avif" },
        { name: "سس شکلات", image: "/Images/photo-1592663527359-cf6642f54cff.avif" },
        { name: "دمنوش", image: "/Images/photo-1514432324607-a09d9b4aefdd.avif" }
      ],
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-50 to-blue-50",
      accent: "bg-gradient-to-r from-cyan-500 to-blue-600"
    },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-amber-50 via-white to-amber-100 py-16 px-4 md:px-10 lg:px-20 mt-34">
      <div className="max-w-7xl mx-auto">
        {/* Categories Grid - 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`relative bg-gradient-to-br ${cat.bgGradient} border border-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden min-h-[320px] w-full`}
            >
              {/* Background Elements */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className={`w-3 h-10 ${cat.accent} rounded-full ml-4 shadow-lg`}></div>
                  <h3 className="text-xl font-bold text-gray-800 font-[var(--font-yekan)] group-hover:text-gray-900 transition-colors duration-300">
                    {cat.title}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {cat.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="relative bg-white/80 backdrop-blur-sm border border-white rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 group/item"
                    >
                      {/* Image Container */}
                      <div className="relative h-20 w-full overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback for missing images
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f59e0b' opacity='0.2'/%3E%3Cpath d='M35 40L45 50L35 60' stroke='%23f59e0b' stroke-width='3' fill='none'/%3E%3Cpath d='M55 40L65 50L55 60' stroke='%23f59e0b' stroke-width='3' fill='none'/%3E%3C/svg%3E";
                          }}
                        />
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300`}></div>
                      </div>
                      
                      {/* Text Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                        <span className="text-xs font-[var(--font-yekan)] text-white font-medium block text-center">
                          {item.name}
                        </span>
                      </div>

                      {/* Hover gradient border effect */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${cat.gradient} opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 -z-10`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corner accents */}
              <div className={`absolute top-0 right-0 w-16 h-16 ${cat.accent} opacity-0 group-hover:opacity-10 rounded-bl-3xl transition-opacity duration-300`}></div>
              <div className={`absolute bottom-0 left-0 w-16 h-16 ${cat.accent} opacity-0 group-hover:opacity-10 rounded-tr-3xl transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-[var(--font-yekan)] text-lg">
            مشاهده همه دسته‌بندی‌ها
          </button>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl"></div>
    </section>
  );
}