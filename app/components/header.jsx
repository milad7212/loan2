"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">وام</span>
            </div>
            <span className={`font-bold text-xl ${isScrolled ? "text-blue-600" : "text-white"}`}>
              سامانه امتیاز وام
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
            {[
              { name: "صفحه اصلی", href: "/" },
              { name: "خرید امتیاز", href: "/buy-loan" },
              { name: "فروش امتیاز", href: "/sell-loan" },
              { name: "قیمت‌ها", href: "/prices" },
              { name: "درباره ما", href: "/about" },
              { name: "تماس با ما", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 space-x-reverse">
            <Link
              href="/login"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isScrolled ? "text-blue-600 hover:bg-blue-50" : "text-white hover:bg-white/10"
              }`}
            >
              ورود
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              ثبت‌نام
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? "text-gray-800" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? "text-gray-800" : "text-white"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="container mx-auto px-4 py-3">
              <nav className="flex flex-col space-y-1">
                {[
                  { name: "صفحه اصلی", href: "/" },
                  { name: "خرید امتیاز", href: "/buy-loan" },
                  { name: "فروش امتیاز", href: "/sell-loan" },
                  { name: "قیمت‌ها", href: "/prices" },
                  { name: "درباره ما", href: "/about" },
                  { name: "تماس با ما", href: "/contact" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex space-x-2 space-x-reverse pt-2 border-t border-gray-100 mt-2">
                  <Link
                    href="/login"
                    className="flex-1 px-4 py-2 text-center text-blue-600 border border-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ورود
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 px-4 py-2 text-center bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ثبت‌نام
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// Import AnimatePresence at the top
import { AnimatePresence } from "framer-motion"
