"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Play,
  Star,
  TrendingUp,
  Shield,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

// interface StepData {
//   hasJobCertificate: boolean | null
//   hasCreditHistory: boolean | null
//   selectedBank: string | null
// }

const banks = [
  {
    id: "mellat",
    name: "بانک رسالت",
    logo: "/images/resalat-logo.png",
    rate: "4%",
    maxAmount: "300 میلیون",
    features: ["بدون ضامن", "تسویه آسان", "پردازش سریع"],
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-500",
  },
  {
    id: "melli",
    name: "بانک ملی",
    rate: "2%",
    maxAmount: "400 میلیون",
    features: ["نرخ پایین", "اعتبار بالا", "شرایط آسان"],
    color: "from-green-400 to-green-600",
    bgColor: "bg-green-500",
  },
  {
    id: "parsian",
    name: "بانک سپه",
    rate: "4%",
    maxAmount: "400 میلیون",
    features: ["پردازش فوری", "بدون کارمزد", "انعطاف بالا"],
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-500",
  },
];
export default function LoanWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({
    hasJobCertificate: null,
    hasCreditHistory: null,
    selectedBank: null,
  });
  const [showVideo, setShowVideo] = useState(false);

  const steps = ["مدرک شغلی", "اعتبارسنجی", "انتخاب بانک", "نتیجه"];

  // Prevent scroll jump on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowVideo(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowVideo(false);
    }
  };

  const getBestLoan = () => {
    const { hasJobCertificate, hasCreditHistory, selectedBank } = stepData;

    let recommendation = "";
    let discount = 0;

    if (hasJobCertificate) discount += 2;
    if (hasCreditHistory) discount += 1;

    const selectedBankData = banks.find((b) => b.id === selectedBank);

    if (selectedBankData) {
      const finalRate = Math.max(
        Number.parseFloat(selectedBankData.rate) - discount,
        12
      );
      recommendation = `بر اساس اطلاعات شما، ${selectedBankData.name} با نرخ ${finalRate}% بهترین گزینه است.`;
    }

    return { recommendation, discount };
  };

  // Minimal styles
  const gradientBg = {
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    minHeight: "100vh",
  };

  const glassCard = {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  };

  const buttonPrimary = {
    background: "#1f2937",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const buttonSecondary = {
    background: "transparent",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    color: "#374151",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const buttonSelected = {
    background: "#1f2937",
    border: "2px solid #1f2937",
    borderRadius: "12px",
    color: "white",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const alertBox = {
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    padding: "16px",
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div style={gradientBg} className="p-3 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 pt-4 sm:pt-8"
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            خرید امتیاز وام
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            مسیر هوشمند برای دریافت بهترین وام
          </p>
        </motion.div>

        {/* Minimal Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 sm:mb-8"
        >
          {/* Progress Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-900">
              <span className="text-lg sm:text-xl font-semibold">
                {steps[currentStep]}
              </span>
            </div>
            <div className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
              <span className="font-medium">{currentStep + 1}</span>
              <span className="mx-1">از</span>
              <span className="font-medium">{steps.length}</span>
            </div>
          </div>

          {/* Simple Progress Bar */}
          <div className="relative mb-4">
            <div className="h-2 rounded-full bg-gray-200">
              <motion.div
                className="h-full rounded-full bg-gray-900"
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Simple Progress Dots */}
            <div className="flex justify-between absolute -top-1 w-full">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white"
                  style={{
                    borderColor: index <= currentStep ? "#1f2937" : "#d1d5db",
                  }}
                >
                  {index < currentStep && (
                    <CheckCircle size={10} className="text-gray-900" />
                  )}
                  {index === currentStep && (
                    <div className="w-2 h-2 bg-gray-900 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Labels for Desktop */}
          <div className="hidden sm:flex justify-between text-xs text-gray-500">
            {steps.map((step, index) => (
              <span
                key={index}
                className={
                  index <= currentStep ? "text-gray-900 font-medium" : ""
                }
              >
                {step}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          style={glassCard}
          className="p-4 sm:p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Content Container with Fixed Min Height */}
          <div className="min-h-[400px] sm:min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
              {/* Step 1: Job Certificate */}
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center flex-1 flex flex-col justify-center"
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-100">
                      <TrendingUp
                        size={24}
                        className="text-gray-700 sm:w-8 sm:h-8"
                      />
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                    مدرک شغلی دارید؟
                  </h2>

                  <div style={alertBox} className="mb-6">
                    <div className="flex items-center justify-center mb-2">
                      <AlertCircle className="text-gray-600 mr-2" size={16} />
                      <span className="text-gray-700 font-medium text-sm">
                        نکته مهم
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      داشتن مدرک شغلی می‌تواند نرخ سود شما را تا ۲٪ کاهش دهد
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setStepData({ ...stepData, hasJobCertificate: true })
                      }
                      style={
                        stepData.hasJobCertificate === true
                          ? buttonSelected
                          : buttonSecondary
                      }
                      className="px-6 py-3 sm:px-8 sm:py-3 transition-all text-sm sm:text-base"
                    >
                      بله، دارم
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setStepData({ ...stepData, hasJobCertificate: false })
                      }
                      style={
                        stepData.hasJobCertificate === false
                          ? buttonSelected
                          : buttonSecondary
                      }
                      className="px-6 py-3 sm:px-8 sm:py-3 transition-all text-sm sm:text-base"
                    >
                      خیر، ندارم
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowVideo(!showVideo)}
                    style={alertBox}
                    className="flex items-center justify-center mx-auto text-gray-600 hover:text-gray-800 transition-all cursor-pointer border-none text-sm sm:text-base w-full sm:w-auto"
                  >
                    <Play size={16} className="mr-2" />
                    مدرک شغلی چیست؟
                  </motion.button>

                  <AnimatePresence>
                    {showVideo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl p-3 sm:p-4 bg-gray-50 border border-gray-200"
                      >
                        <div className="aspect-video rounded-lg flex items-center justify-center bg-gray-200">
                          <p className="text-gray-600 text-sm sm:text-base">
                            ویدیو توضیحی مدرک شغلی
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Step 2: Credit History */}
              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center flex-1 flex flex-col justify-center"
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-100">
                      <Shield
                        size={24}
                        className="text-gray-700 sm:w-8 sm:h-8"
                      />
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                    اعتبارسنجی مرات دارید؟
                  </h2>

                  <div style={alertBox} className="mb-6">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="text-gray-600 mr-2" size={16} />
                      <span className="text-gray-700 font-medium text-sm">
                        مزیت اضافی
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      اعتبارسنجی مثبت نرخ سود را ۱٪ کاهش می‌دهد
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setStepData({ ...stepData, hasCreditHistory: true })
                      }
                      style={
                        stepData.hasCreditHistory === true
                          ? buttonSelected
                          : buttonSecondary
                      }
                      className="px-6 py-3 sm:px-8 sm:py-3 transition-all text-sm sm:text-base"
                    >
                      بله، دارم
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setStepData({ ...stepData, hasCreditHistory: false })
                      }
                      style={
                        stepData.hasCreditHistory === false
                          ? buttonSelected
                          : buttonSecondary
                      }
                      className="px-6 py-3 sm:px-8 sm:py-3 transition-all text-sm sm:text-base"
                    >
                      خیر، ندارم
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Bank Selection */}
              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-6 sm:mb-8">
                    انتخاب بانک
                  </h2>

                  <div className="space-y-4">
                    {banks.map((bank, index) => (
                      <motion.div
                        key={bank.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() =>
                          setStepData({ ...stepData, selectedBank: bank.id })
                        }
                        className="p-4 sm:p-5 cursor-pointer transition-all border-2 relative"
                        style={{
                          borderRadius: "16px",
                          borderColor:
                            stepData.selectedBank === bank.id
                              ? "#1f2937"
                              : "#e5e7eb",
                          background:
                            stepData.selectedBank === bank.id
                              ? "#f9fafb"
                              : "white",
                        }}
                      >
                        {stepData.selectedBank === bank.id && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle size={18} className="text-gray-900" />
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center mb-3 sm:mb-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center ml-3 sm:ml-4">
                              <span className="text-gray-700 font-semibold text-sm sm:text-base">
                                {bank.name.charAt(4)}
                              </span>
                              {/* <Image
                                src={bank.logo}
                                alt={bank.name}
                                layout="fill"
                                objectFit="contain"
                              /> */}
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                {bank.name}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                نرخ سود: {bank.rate}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-gray-900 font-semibold text-sm sm:text-base">
                              {bank.maxAmount}
                            </p>
                            <p className="text-gray-500 text-xs sm:text-sm">
                              حداکثر مبلغ
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                          {bank.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="text-gray-600 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm bg-gray-100"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Result */}
              {currentStep === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="text-center flex-1 flex flex-col justify-center"
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-100">
                      <CheckCircle
                        size={24}
                        className="text-gray-700 sm:w-8 sm:h-8"
                      />
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
                    نتیجه نهایی
                  </h2>

                  <div
                    className="p-4 sm:p-6 mb-6 border border-gray-200 bg-gray-50"
                    style={{ borderRadius: "16px" }}
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                      توصیه ما برای شما
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {getBestLoan().recommendation}
                    </p>

                    {getBestLoan().discount > 0 && (
                      <div className="mt-4 p-3 sm:p-4 border border-gray-200 bg-white rounded-xl">
                        <p className="text-gray-800 font-medium text-sm sm:text-base">
                          تبریک! شما {getBestLoan().discount}٪ تخفیف دریافت
                          کردید
                        </p>
                      </div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      ...buttonPrimary,
                      padding: "14px 28px",
                      fontSize: "16px",
                    }}
                    className="w-full sm:w-auto"
                  >
                    <span className="flex items-center justify-center">
                      درخواست وام
                      <ArrowLeft size={16} className="mr-2" />
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 sm:mt-8 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center px-4 py-2 sm:px-6 sm:py-3 transition-all text-sm sm:text-base"
              style={
                currentStep === 0
                  ? {
                      background: "#f3f4f6",
                      color: "#9ca3af",
                      cursor: "not-allowed",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                    }
                  : { ...buttonSecondary, borderRadius: "12px" }
              }
            >
              <ChevronRight size={16} className="ml-1 sm:ml-2" />
              قبلی
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={nextStep}
              disabled={
                currentStep === steps.length - 1 ||
                (currentStep === 0 && stepData.hasJobCertificate === null) ||
                (currentStep === 1 && stepData.hasCreditHistory === null) ||
                (currentStep === 2 && stepData.selectedBank === null)
              }
              className="flex items-center px-4 py-2 sm:px-6 sm:py-3 transition-all text-sm sm:text-base"
              style={
                currentStep === steps.length - 1 ||
                (currentStep === 0 && stepData.hasJobCertificate === null) ||
                (currentStep === 1 && stepData.hasCreditHistory === null) ||
                (currentStep === 2 && stepData.selectedBank === null)
                  ? {
                      background: "#f3f4f6",
                      color: "#9ca3af",
                      cursor: "not-allowed",
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                    }
                  : { ...buttonPrimary, borderRadius: "12px" }
              }
            >
              {currentStep === steps.length - 1 ? "تمام" : "بعدی"}
              <ChevronLeft size={16} className="mr-1 sm:mr-2" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
