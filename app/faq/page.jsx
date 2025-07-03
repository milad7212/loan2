"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Search, Play, X } from "lucide-react";

// interface FAQItem {
//   id: number
//   question: string
//   answer: string
//   videoUrl?: string
//   videoTitle?: string
// }

const faqData = [
  {
    id: 1,
    question: "شرایط گرفتن وام چیست؟",
    answer: `
    <br/>
     <div className="space-y-3 text-justify leading-relaxed text-gray-800 rtl p-4 bg-blue-50 rounded-lg border border-blue-200">
    <p>: <strong>شرایط وام بانک رسالت (قرض‌الحسنه)</strong>🏦</p>
    <br/>
    <ul className="list-disc list-inside">
      <li>.باید حساب قرض‌الحسنه فعال داشته باشید</li>
      <li>.سپرده‌گذاری ۳ تا ۶ ماهه الزامی است</li>
      <li>کارمزد: <mark>۲٪</mark> از مبلغ وام</li>
      <li>سقف وام: بین <strong>۲۰۰ تا ۴۰۰ میلیون تومان</strong> (بسته به معدل حساب و توان اعتباری)</li>
      <li>بدون چک برگشتی یا بدهی بانکی، و متقاضی باید در سامانه مرآت اعتبارسنجی شود</li>
      <li>ضامن یا سفته بسته به رتبه اعتباری وام لازم است</li>
    </ul>
     
     <br/>
    <p>: <strong>وام طرح نگین امید (بانک سپه)✔️</strong></p>
    <br/>
    <ul className="list-disc list-inside">
      <li>فقط برای کسانی که حساب قرض‌الحسنه ویژه طرح نگین امید دارند</li>
      <li>برای افراد بالای ۱۸ سال حقیقی یا حقوقی می‌توانند استفاده کنند</li>
      <li>باید بین ۱ تا ۱۸ ماه سپرده‌گذاری‌ و گردش حساب داشته باشید (بسته به مبلغ وام)</li>
      <li>%سقف وام: تا ۳۰۰ میلیون تومان، کارمزد فقط ۲</li>
      <li>بازپرداخت: از ۱۲ تا حداکثر ۶۰ ماه تعیین می‌شود</li>
      <li>نیاز به ضامن رسمی یا اعتبار شغلی دارد</li>
    </ul>

    <br/>

    <p>❤ <strong>وام طرح مهربانی (بانک ملی):</strong></p>
    <br/>
    <ul className="list-disc list-inside">
      <li>مختص مشتریان با حساب قرض‌الحسنه ملی با گردش حداقل ۱ تا ۱۲ ماه</li>
      <li>بدون چک برگشتی یا بدهی معوق، با یک ضامن معتبر</li>
      <li>سقف وام: تا ۳۰۰ میلیون تومان، کارمزد بین ۰ تا ۴٪ (بسته به شرایط امتیاز حساب)</li>
      <li>بازپرداخت معمولاً در حدود چند ده میلیون تومان قسط ماهیانه، بستگی به نرخ کارمزد و مدت دارد</li>
      <li>قابل ثبت‌نام حضوری در شعب یا غیرحضوری از طریق سامانه بام</li>
    </ul>
  </div>`,
    videoUrl:
      "https://www.aparat.com/video/video/embed/videohash/ibtek9v/vt/frame",
    videoTitle: "شرایط گرفتن وام چیست؟",
  },
  {
    id: 2,
    question: "آیا وام سود دارد؟",
    answer: `<br/>
<div className="space-y-3 text-justify leading-relaxed text-gray-800 rtl p-4 bg-blue-50 rounded-lg border border-blue-200">


  <br/>
  <ul className="list-disc list-inside">
    <li><strong>بانک رسالت:</strong> وام قرض‌الحسنه است و فقط <mark>کارمزد ۲٪</mark> دارد، سود ندارد.</li>
     <br/>
    <li><strong>طرح نگین سپه:</strong> این وام هم قرض‌الحسنه با <mark>کارمزد ۲٪</mark> است و سود بانکی ندارد.</li>
     <br/>
    <li><strong>طرح مهربانی بانک ملی:</strong> وام قرض‌الحسنه با <mark>کارمزد بین ۰ تا ۴٪</mark> است، بدون سود بانکی.</li>
  </ul>

</div>`,
    videoUrl:
      "https://www.aparat.com/video/video/embed/videohash/ozry4zp/vt/frame",
    videoTitle: "سود وام",
  },
  {
    id: 3,
    question: "وام نیاز به ضامن دارد؟",
    answer: `
    <br/>
<div className="space-y-3 text-justify leading-relaxed text-gray-800 rtl p-4 bg-blue-50 rounded-lg border border-blue-200">

  <br/>
  <ul className="list-disc list-inside">
    <li><strong>بانک رسالت:</strong> بسته به رتبه اعتباری شما، <mark>ممکن است ضامن یا سفته</mark> نیاز باشد.</li>
    <br/>
    <li><strong>طرح نگین سپه:</strong> <mark>بله، ضامن رسمی یا اعتبار شغلی</mark> معتبر لازم است.</li>
    <br/>
    <li><strong>طرح مهربانی بانک ملی:</strong> <mark>بله، حداقل یک ضامن معتبر</mark> نیاز است.</li>
  </ul>

</div>
    `,

    videoTitle: "راه‌های تماس با پشتیبانی",
  },
  {
    id: 4,
    question: "سقف وام چه مبلغی می‌باشد؟",
    answer: `
    <br/>
<div className="space-y-3 text-justify leading-relaxed text-gray-800 rtl p-4 bg-blue-50 rounded-lg border border-blue-200">

  <br/>
  <ul className="list-disc list-inside">
   <br/>
    <li><strong>بانک رسالت:</strong> بسته به معدل حساب و امتیاز اعتباری، <mark>بین ۲۰۰ تا ۴۰۰ میلیون تومان</mark></li>
     <br/>
    <li><strong>طرح نگین سپه:</strong> تا <mark>۳۰۰ میلیون تومان</mark> بر اساس میزان سپرده‌گذاری و گردش حساب</li>
     <br/>
    <li><strong>طرح مهربانی بانک ملی:</strong> حداکثر <mark>۳۰۰ میلیون تومان</mark> متناسب با امتیاز حساب و شرایط متقاضی</li>
  </ul>

</div>
    `,
  },
  {
    id: 5,
    question: "باز پرداخت وام به چه شکل می‌باشد؟",
    answer: `
    <br/>
<div className="space-y-3 text-justify leading-relaxed text-gray-800 rtl p-4 bg-blue-50 rounded-lg border border-blue-200">
  <br/>
  <ul className="list-disc list-inside">
    <li><strong>بانک رسالت:</strong> بازپرداخت <mark>بین ۱۲ تا ۶۰ ماهه</mark>، با مبلغ اقساط متناسب با کارمزد و مبلغ وام</li>
    <br/>
    <li><strong>طرح نگین سپه:</strong> بازپرداخت از <mark>۱ تا ۵ سال</mark>، متناسب با میزان وام و شرایط متقاضی</li>
    <br/>
    <li><strong>طرح مهربانی بانک ملی:</strong> معمولاً <mark>تا ۶۰ ماه (۵ سال)</mark>، با اقساط ماهیانه مشخص بر اساس کارمزد و مبلغ وام</li>
  </ul>
</div>
    `,
  },
  {
    id: 6,
    question: "آیا برای گرفتن وام نیاز به مراجعه به بانک هست؟",
    answer: `
    <br/>
<div className="space-y-3 text-justify leading-relaxed text-gray-800 rtl p-4 bg-blue-50 rounded-lg border border-blue-200">


  <br/>
  <ul className="list-disc list-inside">
    <li><strong>بانک رسالت:</strong> <mark>خیر</mark>، مراحل از طریق <strong>سامانه مرآت</strong> و سایت بانک به‌صورت <mark>کاملاً غیرحضوری</mark> انجام می‌شود.</li>
      <br/>
    <li><strong>طرح نگین سپه:</strong> <mark>بله</mark>، افتتاح حساب و ثبت درخواست <strong>در شعب بانک</strong> انجام می‌شود.</li>
      <br/>
    <li><strong>طرح مهربانی بانک ملی:</strong> هم به‌صورت <strong>حضوری در شعب</strong> و هم از طریق <mark>سامانه بام</mark> قابل انجام است.</li>
  </ul>

</div>
    `,
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoUrl: "",
    title: "",
  });

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  const openVideoModal = (videoUrl, title) => {
    setVideoModal({ isOpen: true, videoUrl, title });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, videoUrl: "", title: "" });
  };

  const filteredFAQ = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm"
          >
            <HelpCircle className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            سوالات متداول
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto px-4"
          >
            پاسخ سوالات خود را در اینجا پیدا کنید
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative max-w-md mx-auto px-4"
          >
            <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="جستجو در سوالات..."
              className="w-full pl-4 pr-12 py-3 sm:py-4 border border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              dir="rtl"
            />
          </motion.div>
        </div>

        {/* Animated Background Elements
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-purple-300/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 right-1/3 w-32 h-32 bg-blue-300/20 rounded-full blur-xl"></div>
        </motion.div> */}
      </motion.div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6  lg:px-8 py-12 sm:py-16">
        <div className="space-y-4">
          {filteredFAQ.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">نتیجه‌ای یافت نشد</p>
            </motion.div>
          ) : (
            filteredFAQ.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <motion.button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset group"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 text-right pr-2">
                        {item.question}
                      </h3>
                    </div>
                    <div className="mr-2 sm:mr-4 flex-shrink-0">
                      <motion.div
                        animate={{ rotate: openItem === item.id ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-colors duration-300 ${
                            openItem === item.id
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {openItem === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                        >
                          <p
                            dangerouslySetInnerHTML={{ __html: item.answer }}
                            className="text-gray-700 leading-relaxed  text-justify mb-4 text-sm sm:text-base"
                          >
                            {/* {} */}
                          </p>

                          {item.videoUrl && (
                            <motion.button
                              onClick={() =>
                                openVideoModal(item.videoUrl, item.videoTitle)
                              }
                              className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Play className="w-4 h-4 ml-2" />
                              مشاهده ویدیو آموزشی
                            </motion.button>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              سوال شما پاسخ داده نشد؟
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              تیم پشتیبانی ما آماده کمک به شما است
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                تماس با پشتیبانی
              </motion.button>
              {/* <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                ارسال تیکت
              </motion.button> */}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {videoModal.title}
                </h3>
                <button
                  onClick={closeVideoModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={videoModal.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={videoModal.title}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            © 2024 تمامی حقوق محفوظ است
          </p>
        </div>
      </footer>
    </div>
  );
}
