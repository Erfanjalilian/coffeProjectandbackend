import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Section */}
        <div>
          <h3 className="text-2xl font-bold text-amber-600 mb-4">آی کسب</h3>
          <p className="text-sm leading-7 mb-4">
            فروشگاه تخصصی قهوه و لوازم جانبی.  
            ارائه‌دهنده‌ی مرغوب‌ترین دانه‌ها و پودرهای قهوه از سراسر جهان.
          </p>

          {/* Enamad Logo */}
          <a
            referrerPolicy="origin"
            target="_blank"
            href="https://trustseal.enamad.ir/?id=697293&Code=qaEaKdgcORhcapADMloyf1U1tmHn5VrC"
          >
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=697293&Code=qaEaKdgcORhcapADMloyf1U1tmHn5VrC"
              alt="نماد اعتماد الکترونیکی"
              style={{ cursor: "pointer" }}
            />
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">دسترسی سریع</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-amber-500 transition">خانه</Link></li>
            <li><Link href="/products" className="hover:text-amber-500 transition">محصولات</Link></li>
            <li><Link href="/about" className="hover:text-amber-500 transition">درباره ما</Link></li>
            <li><Link href="/contact" className="hover:text-amber-500 transition">تماس با ما</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">ارتباط با ما</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={18} className="text-amber-500" />
              تهران، خیابان ولیعصر، پلاک ۱۲۳
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="text-amber-500" />
              ۰۲۱-۱۲۳۴۵۶۷۸
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} className="text-amber-500" />
              info@coffeeland.ir
            </li>
          </ul>

          {/* Social Links */}
          <div className="flex items-center gap-4 mt-4">
            <Link href="#" className="hover:text-amber-500 transition">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="hover:text-amber-500 transition">
              <Facebook size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-neutral-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} توسعه داده شده توسط عرفان جلیلیان
      </div>
    </footer>
  );
}
