"use client";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "خانه", href: "/" },
    { name: "محصولات", href: "/products" },
    { name: "درباره ما", href: "/About" },
    { name: "تماس با ما", href: "/Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-amber-800">
           لوگو
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-amber-700 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button className="text-gray-700 hover:text-amber-700 transition-colors">
              <ShoppingBag size={22} />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-amber-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md">
          <nav className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 hover:text-amber-700 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
