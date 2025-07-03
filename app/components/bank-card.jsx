"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BankCard({ bank }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 relative">
              <Image
                src={bank.logo || "/placeholder.svg?height=48&width=48"}
                alt={bank.name}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mr-3">
              {bank.name}
            </h3>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
            امتیاز وام
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-lg ${
              bank.hasBuyPoints ? "bg-green-50" : "bg-gray-50"
            }`}
          >
            <div className="text-sm text-gray-500 mb-1">قیمت خرید</div>
            <div
              className={`text-lg font-bold ${
                bank.hasBuyPoints ? "text-green-600" : "text-gray-400"
              } flex items-center`}
            >
              {bank.hasBuyPoints ? (
                <>
                  {bank.buyPrice}
                  <span className="text-xs mr-1 font-normal">تومان</span>
                </>
              ) : (
                "غیرفعال"
              )}
            </div>
          </div>

          <div
            className={`p-4 rounded-lg ${
              bank.hasSellPoints ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <div className="text-sm text-gray-500 mb-1">قیمت فروش</div>
            <div
              className={`text-lg font-bold ${
                bank.hasSellPoints ? "text-blue-600" : "text-gray-400"
              } flex items-center`}
            >
              {bank.hasSellPoints ? (
                <>
                  {bank.sellPrice}
                  <span className="text-xs mr-1 font-normal">تومان</span>
                </>
              ) : (
                "غیرفعال"
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-2 space-x-reverse">
          <button
            disabled={!bank.hasBuyPoints}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              bank.hasBuyPoints
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            خرید
          </button>
          <button
            disabled={!bank.hasSellPoints}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              bank.hasSellPoints
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            فروش
          </button>
        </div>
      </div>
    </motion.div>
  );
}
