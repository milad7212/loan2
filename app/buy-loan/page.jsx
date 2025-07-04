"use client";
import { useState } from "react";

// Progress Bar Component
function ProgressBar({ step, total }) {
  return (
    <div className="flex items-center w-full max-w-xs mx-auto my-6">
      {[...Array(total)].map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 mx-1 rounded-full transition-all duration-500
            ${i < step ? "bg-blue-500" : "bg-blue-100"}`}
        />
      ))}
    </div>
  );
}

// Step 1: Intro
function StepIntro({ onNext }) {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <div className="mb-4">
        {/* جایگزین با Lottie یا SVG */}
        <span className="inline-block w-20 h-20 bg-blue-100 rounded-full mb-2" />
      </div>
      <h2 className="text-2xl font-bold mb-2">خوش آمدید!</h2>
      <p className="mb-4 text-gray-600">
        با پاسخ به چند سوال کوتاه، بهترین گزینه وام را برای شما پیدا می‌کنیم.
      </p>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-600 transition"
        onClick={onNext}
      >
        شروع سفر
      </button>
    </div>
  );
}

// Step 2: Occupational Document
function StepOccupationalDoc({ value, setValue, onNext }) {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <div className="mb-4">
        {/* ویدیو یا انیمیشن */}
        <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
          <span className="text-xs text-gray-500">ویدیو مدرک شغلی</span>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-2">آیا مدرک شغلی دارید؟</h2>
      <p className="text-sm text-gray-500 mb-2">
        <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
          داشتن مدرک می‌تواند هزینه وام را کاهش دهد.
        </span>
      </p>
      <div className="flex gap-4 my-4">
        <button
          className={`px-6 py-2 rounded-xl border transition
            ${
              value === "yes"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border-blue-500"
            }
            hover:scale-105`}
          onClick={() => setValue("yes")}
        >
          بله
        </button>
        <button
          className={`px-6 py-2 rounded-xl border transition
            ${
              value === "no"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border-blue-500"
            }
            hover:scale-105`}
          onClick={() => setValue("no")}
        >
          خیر
        </button>
      </div>
      <button
        className="mt-2 text-sm text-blue-500 underline"
        onClick={onNext}
        disabled={!value}
      >
        مرحله بعد
      </button>
    </div>
  );
}

// Step 3: Credit Validation
function StepCreditValidation({ value, setValue, onNext }) {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <div className="mb-4">
        {/* نشان اعتبار */}
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
          ${
            value === "yes"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {value === "yes" ? "اعتبارسنجی معتبر دارید" : "اعتبارسنجی مرات"}
        </span>
      </div>
      <h2 className="text-xl font-bold mb-2">
        آیا اعتبارسنجی مرات معتبر دارید؟
      </h2>
      <p className="text-sm text-gray-500 mb-2">
        این کار باعث تسریع تایید درخواست شما می‌شود.
      </p>
      <div className="flex gap-4 my-4">
        <button
          className={`px-6 py-2 rounded-xl border transition
            ${
              value === "yes"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border-blue-500"
            }
            hover:scale-105`}
          onClick={() => setValue("yes")}
        >
          بله
        </button>
        <button
          className={`px-6 py-2 rounded-xl border transition
            ${
              value === "no"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border-blue-500"
            }
            hover:scale-105`}
          onClick={() => setValue("no")}
        >
          خیر
        </button>
      </div>
      <button
        className="mt-2 text-sm text-blue-500 underline"
        onClick={onNext}
        disabled={!value}
      >
        مرحله بعد
      </button>
    </div>
  );
}

// Step 4: Bank Select
const banks = [
  {
    name: "بانک ملت",
    logo: "/bank-mellat.png", // آدرس لوگو را جایگزین کنید
    rate: "۱۸٪",
    period: "۳۶ ماه",
    docs: "مدرک شغلی، اعتبارسنجی",
  },
  {
    name: "بانک ملی",
    logo: "/bank-melli.png",
    rate: "۲۰٪",
    period: "۲۴ ماه",
    docs: "مدرک شغلی",
  },
  {
    name: "بانک صادرات",
    logo: "/bank-saderat.png",
    rate: "۱۹٪",
    period: "۴۸ ماه",
    docs: "اعتبارسنجی",
  },
];

function StepBankSelect({ value, setValue, onNext }) {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <h2 className="text-xl font-bold mb-2">کدام بانک را ترجیح می‌دهید؟</h2>
      <p className="text-sm text-gray-500 mb-4">
        بانک مورد علاقه خود را انتخاب کنید و شرایط را مقایسه نمایید.
      </p>
      <div className="flex flex-col md:flex-row gap-4 mb-4 w-full justify-center">
        {banks.map((bank, idx) => (
          <div
            key={bank.name}
            className={`flex-1 border rounded-xl p-4 cursor-pointer transition hover:shadow-lg
              ${
                value === idx
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            onClick={() => setValue(idx)}
          >
            <div className="flex flex-col items-center">
              <img src={bank.logo} alt={bank.name} className="w-12 h-12 mb-2" />
              <div className="font-bold mb-1">{bank.name}</div>
              <div className="text-xs text-gray-500 mb-1">
                نرخ سود: {bank.rate}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                مدت بازپرداخت: {bank.period}
              </div>
              <div className="text-xs text-gray-500">مدارک: {bank.docs}</div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="mt-2 text-sm text-blue-500 underline"
        onClick={onNext}
        disabled={value === null}
      >
        مرحله بعد
      </button>
    </div>
  );
}

// Step 5: Recommendation
function StepRecommendation({ answers, onRestart }) {
  // الگوریتم ساده برای پیشنهاد (می‌توانید پیشرفته‌تر کنید)
  const bank = banks[answers.bank] || banks[0];
  const cost = bank.rate === "۱۸٪" ? "کمترین هزینه" : "متوسط";
  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
      <div className="mb-4">
        <span className="inline-block w-20 h-20 bg-green-100 rounded-full mb-2" />
      </div>
      <h2 className="text-2xl font-bold mb-2">پیشنهاد ویژه برای شما</h2>
      <div className="bg-white rounded-xl shadow p-4 mb-4 w-full max-w-xs mx-auto">
        <img
          src={bank.logo}
          alt={bank.name}
          className="w-12 h-12 mx-auto mb-2"
        />
        <div className="font-bold mb-1">{bank.name}</div>
        <div className="text-xs text-gray-500 mb-1">نرخ سود: {bank.rate}</div>
        <div className="text-xs text-gray-500 mb-1">
          مدت بازپرداخت: {bank.period}
        </div>
        <div className="text-xs text-gray-500 mb-1">مدارک: {bank.docs}</div>
        <div className="text-xs text-green-600 mt-2">{cost}</div>
      </div>
      <div className="flex gap-4">
        <button className="bg-blue-500 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-600 transition">
          ادامه درخواست
        </button>
        <button
          className="bg-gray-100 text-blue-500 px-6 py-2 rounded-xl shadow hover:bg-gray-200 transition"
          onClick={onRestart}
        >
          شروع مجدد
        </button>
      </div>
      <button className="mt-4 text-sm text-blue-400 underline">
        نیاز به مشاوره دارید؟
      </button>
    </div>
  );
}

// Main Journey Component
export default function BuyLoanPage() {
  const [step, setStep] = useState(0);
  const [occupationalDoc, setOccupationalDoc] = useState("");
  const [creditValidation, setCreditValidation] = useState("");
  const [bank, setBank] = useState(null);

  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center px-2">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg transition-all duration-500">
        {step === 0 && <StepIntro onNext={() => setStep(1)} />}
        {step === 1 && (
          <StepOccupationalDoc
            value={occupationalDoc}
            setValue={setOccupationalDoc}
            onNext={() => occupationalDoc && setStep(2)}
          />
        )}
        {step === 2 && (
          <StepCreditValidation
            value={creditValidation}
            setValue={setCreditValidation}
            onNext={() => creditValidation && setStep(3)}
          />
        )}
        {step === 3 && (
          <StepBankSelect
            value={bank}
            setValue={setBank}
            onNext={() => bank !== null && setStep(4)}
          />
        )}
        {step === 4 && (
          <StepRecommendation
            answers={{ occupationalDoc, creditValidation, bank }}
            onRestart={() => {
              setStep(0);
              setOccupationalDoc("");
              setCreditValidation("");
              setBank(null);
            }}
          />
        )}
      </div>
      <ProgressBar step={step + 1} total={totalSteps} />
    </div>
  );
}
