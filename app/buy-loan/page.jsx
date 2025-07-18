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
      setShowVideo(false); // Reset video state
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowVideo(false); // Reset video state
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

  // Custom styles
  const gradientBg = {
    background:
      "linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #be185d 100%)",
    minHeight: "100vh",
  };

  const glassCard = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "24px",
  };

  const buttonPrimary = {
    background: "linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)",
    border: "none",
    borderRadius: "16px",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
  };

  const buttonSecondary = {
    background: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    color: "white",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  };

  const alertSuccess = {
    background: "rgba(34, 197, 94, 0.15)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    borderRadius: "16px",
    padding: "16px",
    backdropFilter: "blur(10px)",
  };

  const alertInfo = {
    background: "rgba(59, 130, 246, 0.15)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "16px",
    padding: "16px",
    backdropFilter: "blur(10px)",
  };

  const alertWarning = {
    background: "rgba(245, 158, 11, 0.15)",
    border: "1px solid rgba(245, 158, 11, 0.3)",
    borderRadius: "16px",
    padding: "16px",
    backdropFilter: "blur(10px)",
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
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
            خرید امتیاز وام
          </h1>
          <p className="text-purple-200 text-sm sm:text-base">
            مسیر هوشمند برای دریافت بهترین وام
          </p>
        </motion.div>

        {/* Modern Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 sm:mb-8"
        >
          {/* Progress Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-white">
              <span className="text-lg sm:text-xl font-bold">
                {steps[currentStep]}
              </span>
            </div>
            <div className="text-purple-200 text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="font-medium">{currentStep + 1}</span>
              <span className="mx-1">از</span>
              <span className="font-medium">{steps.length}</span>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="relative mb-4">
            {/* Background Bar */}
            <div
              className="h-3 rounded-full relative overflow-hidden"
              style={{ background: "rgba(255, 255, 255, 0.15)" }}
            >
              {/* Animated Progress Fill */}
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)",
                  boxShadow: "0 0 20px rgba(236, 72, 153, 0.5)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
                  }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-between absolute -top-1 w-full">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-10"
                  style={{
                    background:
                      index <= currentStep
                        ? "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)"
                        : "rgba(255, 255, 255, 0.2)",
                    borderColor:
                      index <= currentStep
                        ? "white"
                        : "rgba(255, 255, 255, 0.3)",
                    boxShadow:
                      index <= currentStep
                        ? "0 0 15px rgba(236, 72, 153, 0.6)"
                        : "none",
                  }}
                  animate={{
                    scale: index === currentStep ? 1.3 : 1,
                    rotate: index < currentStep ? 360 : 0,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {index < currentStep && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <CheckCircle size={12} className="text-white" />
                    </motion.div>
                  )}
                  {index === currentStep && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Step Labels for Desktop */}
          <div className="hidden sm:flex justify-between text-xs text-purple-200">
            {steps.map((step, index) => (
              <motion.span
                key={index}
                className={`transition-all duration-300 ${
                  index <= currentStep ? "text-white font-medium" : ""
                }`}
                animate={{ opacity: index <= currentStep ? 1 : 0.6 }}
              >
                {step}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Main Content - Fixed Height Container */}
        <motion.div
          style={glassCard}
          className="p-4 sm:p-8 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Content Container with Fixed Min Height */}
          <div className="min-h-[400px] sm:min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
              {/* Step 1: Job Certificate */}
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="text-center flex-1 flex flex-col justify-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="mb-6"
                  >
                    <div
                      className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{
                        background:
                          "linear-gradient(90deg, #fbbf24 0%, #f97316 100%)",
                      }}
                    >
                      <TrendingUp
                        size={24}
                        className="text-white sm:w-10 sm:h-10"
                      />
                    </div>
                  </motion.div>

                  <h2 className="text-xl sm:text-3xl font-bold text-white mb-4">
                    مدرک شغلی دارید؟
                  </h2>

                  <div style={alertSuccess} className="mb-6">
                    <div className="flex items-center justify-center mb-2">
                      <AlertCircle className="text-green-400 mr-2" size={18} />
                      <span className="text-green-300 font-semibold text-sm sm:text-base">
                        نکته مهم
                      </span>
                    </div>
                    <p className="text-green-200 text-xs sm:text-sm leading-relaxed">
                      داشتن مدرک شغلی می‌تواند نرخ سود شما را تا ۲٪ کاهش دهد!
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
                          ? buttonPrimary
                          : buttonSecondary
                      }
                      className="px-6 py-3 sm:px-8 sm:py-4 font-semibold transition-all text-sm sm:text-base"
                    >
                      ✅ بله، دارم
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setStepData({ ...stepData, hasJobCertificate: false })
                      }
                      style={
                        stepData.hasJobCertificate === false
                          ? {
                              ...buttonPrimary,
                              background:
                                "linear-gradient(90deg, #ef4444 0%, #ec4899 100%)",
                            }
                          : buttonSecondary
                      }
                      className="px-6 py-3 sm:px-8 sm:py-4 font-semibold transition-all text-sm sm:text-base"
                    >
                      ❌ خیر، ندارم
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowVideo(!showVideo)}
                    style={alertInfo}
                    className="flex items-center justify-center mx-auto text-blue-300 hover:bg-blue-500/30 transition-all cursor-pointer border-none text-sm sm:text-base w-full sm:w-auto"
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
                        className="rounded-xl p-3 sm:p-4"
                        style={{ background: "rgba(0, 0, 0, 0.3)" }}
                      >
                        <div
                          className="aspect-video rounded-lg flex items-center justify-center"
                          style={{ background: "#1f2937" }}
                        >
                          <p className="text-gray-300 text-sm sm:text-base">
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
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="text-center flex-1 flex flex-col justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="mb-6"
                  >
                    <div
                      className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{
                        background:
                          "linear-gradient(90deg, #60a5fa 0%, #06b6d4 100%)",
                      }}
                    >
                      <Shield
                        size={24}
                        className="text-white sm:w-10 sm:h-10"
                      />
                    </div>
                  </motion.div>

                  <h2 className="text-xl sm:text-3xl font-bold text-white mb-4">
                    اعتبارسنجی مرات دارید؟
                  </h2>

                  <div style={alertInfo} className="mb-6">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="text-blue-400 mr-2" size={18} />
                      <span className="text-blue-300 font-semibold text-sm sm:text-base">
                        مزیت اضافی
                      </span>
                    </div>
                    <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">
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
                          ? buttonPrimary
                          : buttonSecondary
                      }
                      className="px-6 py-3 sm:px-8 sm:py-4 font-semibold transition-all text-sm sm:text-base"
                    >
                      ✅ بله، دارم
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setStepData({ ...stepData, hasCreditHistory: false })
                      }
                      style={
                        stepData.hasCreditHistory === false
                          ? {
                              ...buttonPrimary,
                              background:
                                "linear-gradient(90deg, #ef4444 0%, #ec4899 100%)",
                            }
                          : buttonSecondary
                      }
                      className="px-6 py-3 sm:px-8 sm:py-4 font-semibold transition-all text-sm sm:text-base"
                    >
                      ❌ خیر، ندارم
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Bank Selection */}
              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex-1"
                >
                  <h2 className="text-xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">
                    انتخاب بانک
                  </h2>

                  <div className="space-y-4">
                    {banks.map((bank, index) => (
                      <motion.div
                        key={bank.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() =>
                          setStepData({ ...stepData, selectedBank: bank.id })
                        }
                        className="p-4 sm:p-6 cursor-pointer transition-all border-2 relative overflow-hidden"
                        style={{
                          borderRadius: "20px",
                          borderColor:
                            stepData.selectedBank === bank.id
                              ? "white"
                              : "rgba(255, 255, 255, 0.2)",
                          background:
                            stepData.selectedBank === bank.id
                              ? "rgba(255, 255, 255, 0.25)"
                              : "rgba(255, 255, 255, 0.1)",
                          boxShadow:
                            stepData.selectedBank === bank.id
                              ? "0 8px 32px rgba(236, 72, 153, 0.3)"
                              : "none",
                          backdropFilter: "blur(20px)",
                        }}
                      >
                        {stepData.selectedBank === bank.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3"
                          >
                            <CheckCircle size={20} className="text-green-400" />
                          </motion.div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center mb-3 sm:mb-0">
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 ${bank.bgColor} rounded-full flex items-center justify-center ml-3 sm:ml-4`}
                            >
                              <span className="text-white font-bold text-sm sm:text-lg">
                                {bank.name.charAt(4)}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-white">
                                {bank.name}
                              </h3>
                              <p className="text-purple-200 text-sm">
                                نرخ سود: {bank.rate}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-white font-semibold text-sm sm:text-base">
                              {bank.maxAmount}
                            </p>
                            <p className="text-purple-200 text-xs sm:text-sm">
                              حداکثر مبلغ
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                          {bank.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm"
                              style={{ background: "rgba(255, 255, 255, 0.2)" }}
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="text-center flex-1 flex flex-col justify-center"
                >
                  <motion.div
                    // animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="mb-6"
                  >
                    <div
                      className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{
                        background:
                          "linear-gradient(90deg, #4ade80 0%, #10b981 100%)",
                      }}
                    >
                      <CheckCircle
                        size={24}
                        className="text-white sm:w-10 sm:h-10"
                      />
                    </div>
                  </motion.div>

                  <h2 className="text-xl sm:text-3xl font-bold text-white mb-6">
                    🎉 نتیجه نهایی
                  </h2>

                  <div
                    className="p-4 sm:p-6 mb-6 border"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)",
                      borderColor: "#22c55e",
                      borderRadius: "20px",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-green-300 mb-4">
                      💡 توصیه ما برای شما
                    </h3>
                    <p className="text-green-200 text-sm sm:text-lg leading-relaxed">
                      {getBestLoan().recommendation}
                    </p>

                    {getBestLoan().discount > 0 && (
                      <div
                        className="mt-4 p-3 sm:p-4 border"
                        style={alertWarning}
                      >
                        <p className="text-yellow-300 font-semibold text-sm sm:text-base">
                          🎉 تبریک! شما {getBestLoan().discount}٪ تخفیف دریافت
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
                      boxShadow: "0 10px 25px rgba(236, 72, 153, 0.4)",
                    }}
                    className="w-full sm:w-auto"
                  >
                    <span className="flex items-center justify-center">
                      درخواست وام
                      <ArrowLeft size={18} className="mr-2" />
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
              className="flex items-center px-4 py-2 sm:px-6 sm:py-3 font-semibold transition-all text-sm sm:text-base"
              style={
                currentStep === 0
                  ? {
                      background: "rgba(75, 85, 99, 0.5)",
                      color: "#9ca3af",
                      cursor: "not-allowed",
                      borderRadius: "16px",
                      border: "1px solid rgba(75, 85, 99, 0.3)",
                    }
                  : { ...buttonSecondary, borderRadius: "16px" }
              }
            >
              <ChevronRight size={18} className="ml-1 sm:ml-2" />
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
              className="flex items-center px-4 py-2 sm:px-6 sm:py-3 font-semibold transition-all text-sm sm:text-base"
              style={
                currentStep === steps.length - 1 ||
                (currentStep === 0 && stepData.hasJobCertificate === null) ||
                (currentStep === 1 && stepData.hasCreditHistory === null) ||
                (currentStep === 2 && stepData.selectedBank === null)
                  ? {
                      background: "rgba(75, 85, 99, 0.5)",
                      color: "#9ca3af",
                      cursor: "not-allowed",
                      borderRadius: "16px",
                      border: "1px solid rgba(75, 85, 99, 0.3)",
                    }
                  : { ...buttonPrimary, borderRadius: "16px" }
              }
            >
              {currentStep === steps.length - 1 ? "تمام" : "بعدی"}
              <ChevronLeft size={18} className="mr-1 sm:mr-2" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
