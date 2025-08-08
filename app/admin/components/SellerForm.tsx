"use client"

import React, { useState } from "react"

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
  const matches = v.match(/.{1,4}/g)
  return matches ? matches.join(" ") : ""
}

interface Seller {
  id: string
  full_name: string
  phone: string
  account_number: string
  card_number: string
  credit_amount: number
  remaining_amount: number
  status: "active" | "completed"
  description?: string
}

interface SellerFormProps {
  addSeller: (seller: Omit<Seller, "id" | "remaining_amount" | "status">) => void
  creditPrice: number
}

/**
 * A form for adding a new seller.
 */
const SellerForm: React.FC<SellerFormProps> = ({ addSeller, creditPrice }) => {
  const [newSeller, setNewSeller] = useState({
    full_name: "",
    national_id: "",
    phone: "",
    account_number: "",
    card_number: "",
    credit_amount: 0,
    description: "",
  })

  const [error, setError] = useState("")

  const handleAddSeller = () => {
    if (!newSeller.full_name || !newSeller.phone || newSeller.credit_amount <= 0) {
      setError("Please fill all required fields.")
      return
    }
    addSeller(newSeller)
    setNewSeller({
      full_name: "",
      national_id: "",
      phone: "",
      account_number: "",
      card_number: "",
      credit_amount: 0,
      description: "",
    })
    setError("")
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">اضافه کردن فروشنده جدید</h2>
      <p className="text-sm text-gray-500 mb-4">اطلاعات فروشنده جدید را برای اضافه کردن به لیست وارد کنید.</p>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="نام و نام خانوادگی"
          value={newSeller.full_name}
          onChange={(e) => setNewSeller({ ...newSeller, full_name: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="کد ملی"
          value={newSeller.national_id}
          onChange={(e) => setNewSeller({ ...newSeller, national_id: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="شماره موبایل"
          value={newSeller.phone}
          onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="شماره حساب"
          value={newSeller.account_number}
          onChange={(e) => setNewSeller({ ...newSeller, account_number: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="شماره کارت"
          value={newSeller.card_number}
          onChange={(e) => setNewSeller({ ...newSeller, card_number: formatCardNumber(e.target.value) })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ltr-input"
        />
        <input
          type="number"
          placeholder="مقدار امتیاز برای فروش"
          value={newSeller.credit_amount || ""}
          onChange={(e) => setNewSeller({ ...newSeller, credit_amount: Number.parseInt(e.target.value) || 0 })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="توضیحات (اختیاری)"
          value={newSeller.description}
          onChange={(e) => setNewSeller({ ...newSeller, description: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        {newSeller.credit_amount > 0 && (
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200 mb-4">
            <div className="text-sm text-gray-600">ارزش کل امتیاز</div>
            <div className="text-2xl font-bold text-green-600">
              {(newSeller.credit_amount * creditPrice).toLocaleString("fa-IR")} تومان
            </div>
            <div className="text-xs text-gray-500">
              {newSeller.credit_amount} امتیاز × {creditPrice.toLocaleString("fa-IR")} تومان
            </div>
          </div>
        )}
        <button
          onClick={handleAddSeller}
          disabled={!newSeller.full_name || !newSeller.phone || newSeller.credit_amount <= 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          اضافه کردن فروشنده
        </button>
      </div>
    </div>
  )
}

export default SellerForm
