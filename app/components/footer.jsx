import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">وام</span>
              </div>
              <span className="font-bold text-xl text-white">
                سامانه امتیاز وام
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              سامانه خرید و فروش امتیاز وام بانکی با بهترین قیمت و بالاترین سرعت
              و امنیت
            </p>
            <div className="flex space-x-4 space-x-reverse">
              {["instagram", "twitter", "telegram", "linkedin"].map(
                (social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                  >
                    <span className="sr-only">{social}</span>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                  </a>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              دسترسی سریع
            </h3>
            <ul className="space-y-2">
              {[
                { name: "صفحه اصلی", href: "/" },
                { name: "خرید امتیاز وام", href: "/buy-loan" },
                { name: "فروش امتیاز وام", href: "/sell-loan" },
                { name: "قیمت‌های روز", href: "/prices" },
                { name: "سوالات متداول", href: "/faq" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Banks */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              بانک‌های طرف قرارداد
            </h3>
            <ul className="space-y-2">
              {[
                { name: "بانک رسالت", href: "#" },
                { name: "بانک ملی", href: "#" },
                { name: "بانک سپه", href: "#" },
                { name: "بانک مسکن", href: "#" },
                { name: "بانک ملت", href: "#" },
              ].map((bank) => (
                <li key={bank.name}>
                  <Link
                    href={bank.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {bank.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              تماس با ما
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-400 mt-0.5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-400">
                  تهران، خیابان ولیعصر، پلاک ۱۲۳
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-400 mt-0.5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-gray-400">۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-400 mt-0.5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-400">info@loanservice.ir</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © ۱۴۰۳ سامانه خرید و فروش امتیاز وام. تمامی حقوق محفوظ است.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <Link
                href="/terms"
                className="text-gray-400 hover:text-blue-400 text-sm"
              >
                قوانین و مقررات
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-blue-400 text-sm"
              >
                حریم خصوصی
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-blue-400 text-sm"
              >
                کوکی‌ها
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
