"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/header";
import Footer from "./components/footer";
import BankCard from "./components/bank-card";
import AnnouncementCarousel from "./components/announcement-carousel";
import LoanActionCard from "./components/loan-action-card";

// Sample data - in a real app, this would come from an API
const banksData = [
  {
    id: 1,
    name: "بانک رسالت",
    logo: "/images/resalat-logo.png",
    buyPrice: "۱۲,۵۰۰,۰۰۰",
    sellPrice: "۱۲,۰۰۰,۰۰۰",
    hasBuyPoints: true,
    hasSellPoints: true,
  },
  {
    id: 2,
    name: "بانک ملی",
    logo: "/images/melli-logo.png",
    buyPrice: "۱۳,۲۰۰,۰۰۰",
    sellPrice: "۱۲,۸۰۰,۰۰۰",
    hasBuyPoints: true,
    hasSellPoints: false,
  },
  {
    id: 3,
    name: "بانک سپه",
    logo: "/images/sepah-logo.png",
    buyPrice: "۱۱,۸۰۰,۰۰۰",
    sellPrice: "۱۱,۳۰۰,۰۰۰",
    hasBuyPoints: false,
    hasSellPoints: true,
  },
];

const announcements = [
  {
    id: 1,
    title: "افزایش نرخ خرید امتیاز بانک رسالت",
    content:
      "از امروز نرخ خرید امتیاز بانک رسالت به ۱۲,۵۰۰,۰۰۰ تومان افزایش یافت.",
    date: "۱۴۰۳/۰۴/۱۵",
    priority: "high",
  },
  {
    id: 2,
    title: "تعطیلی شعب بانک ملی در روز پنجشنبه",
    content:
      "به اطلاع می‌رساند کلیه شعب بانک ملی در روز پنجشنبه تعطیل می‌باشند.",
    date: "۱۴۰۳/۰۴/۱۴",
    priority: "medium",
  },
  {
    id: 3,
    title: "راه‌اندازی سامانه جدید ثبت درخواست وام",
    content: "سامانه جدید ثبت درخواست وام با امکانات بیشتر راه‌اندازی شد.",
    date: "۱۴۰۳/۰۴/۱۰",
    priority: "low",
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Set current date in Persian format
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const persianDate = today.toLocaleDateString("fa-IR", options);
    setCurrentDate(persianDate);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1,
                ease: "linear",
              }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 w-full h-full bg-[url('/images/pattern.svg')] opacity-10"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                سامانه خرید و فروش امتیاز وام بانکی
              </h1>
              <p className="text-blue-100 text-lg md:text-xl mb-8">
                سریع‌ترین و مطمئن‌ترین راه برای خرید و فروش امتیاز وام بانکی با
                بهترین قیمت
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-blue-700 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  شروع کنید
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium text-lg hover:bg-white/10 transition-all duration-300"
                >
                  اطلاعات بیشتر
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 left-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Banks Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center justify-center mb-4"
              >
                <span className="h-1 w-10 bg-blue-500 rounded-full mr-2"></span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  قیمت امروز امتیاز وام
                </h2>
                <span className="h-1 w-10 bg-blue-500 rounded-full ml-2"></span>
              </motion.div>
              <p className="text-gray-600 text-center max-w-2xl">
                قیمت خرید و فروش امتیاز وام بانک‌های طرف قرارداد در تاریخ{" "}
                {currentDate}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {banksData.map((bank, index) => (
                <motion.div
                  key={bank.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.2 }}
                >
                  <BankCard bank={bank} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Announcements Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center justify-center mb-4"
              >
                <span className="h-1 w-10 bg-blue-500 rounded-full mr-2"></span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  اطلاعیه‌های مهم
                </h2>
                <span className="h-1 w-10 bg-blue-500 rounded-full ml-2"></span>
              </motion.div>
              <p className="text-gray-600 text-center max-w-2xl">
                آخرین اخبار و اطلاعیه‌های مربوط به خرید و فروش امتیاز وام
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <AnnouncementCarousel announcements={announcements} />
            </motion.div>
          </div>
        </section>

        {/* Loan Actions Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center justify-center mb-4"
              >
                <span className="h-1 w-10 bg-blue-500 rounded-full mr-2"></span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  خرید یا فروش امتیاز وام
                </h2>
                <span className="h-1 w-10 bg-blue-500 rounded-full ml-2"></span>
              </motion.div>
              <p className="text-gray-600 text-center max-w-2xl">
                انتخاب کنید که می‌خواهید امتیاز وام خود را بفروشید یا امتیاز وام
                خریداری کنید
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <LoanActionCard
                  title="خرید امتیاز وام"
                  description="می‌خواهم امتیاز وام خریداری کنم"
                  icon="/images/buy-icon.svg"
                  buttonText="خرید امتیاز وام"
                  href="/buy-loan"
                  color="blue"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <LoanActionCard
                  title="فروش امتیاز وام"
                  description="می‌خواهم امتیاز وام خود را بفروشم"
                  icon="/images/sell-icon.svg"
                  buttonText="فروش امتیاز وام"
                  href="/sell-loan"
                  color="green"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center justify-center mb-4"
              >
                <span className="h-1 w-10 bg-blue-500 rounded-full mr-2"></span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  چرا ما را انتخاب کنید؟
                </h2>
                <span className="h-1 w-10 bg-blue-500 rounded-full ml-2"></span>
              </motion.div>
              <p className="text-gray-600 text-center max-w-2xl">
                مزایای استفاده از سامانه خرید و فروش امتیاز وام ما
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🔒",
                  title: "امنیت بالا",
                  description:
                    "تمامی تراکنش‌ها با بالاترین استانداردهای امنیتی انجام می‌شوند",
                },
                {
                  icon: "⚡",
                  title: "سرعت بالا",
                  description:
                    "فرآیند خرید و فروش در کمترین زمان ممکن انجام می‌شود",
                },
                {
                  icon: "💰",
                  title: "بهترین قیمت",
                  description:
                    "بهترین قیمت‌ها برای خرید و فروش امتیاز وام در بازار",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 w-full h-full bg-[url('/images/pattern.svg')] opacity-10"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              >
                همین امروز شروع کنید
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-blue-100 text-lg mb-8"
              >
                با ثبت‌نام در سامانه ما، می‌توانید به راحتی امتیاز وام خود را
                بفروشید یا امتیاز وام خریداری کنید
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-blue-700 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                ثبت‌نام کنید
              </motion.button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
