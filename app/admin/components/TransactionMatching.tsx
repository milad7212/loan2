import React from "react"

const CREDIT_PRICE = 135000

interface Seller {
  id: string
  fullName: string
  phone: string
  accountNumber: string
  cardNumber: string
  creditAmount: number
  remainingAmount: number
  status: "active" | "completed"
  description?: string
}

interface Buyer {
  id: string
  name: string
  phone: string
  nationalId: string
  referrer?: string
  requestedAmount: number
  remainingAmount: number
  status: "pending" | "partial" | "completed"
}

interface Transaction {
  id: string
  sellerId: string
  buyerIds: string[]
  amount: number
  status: "pending_transfer" | "transferred" | "pending_payment" | "completed" | "cancelled" | "paid"
  date: string
  sellerName: string
  buyerNames: string[]
  sellerPhone: string
  sellerNationalId: string
  buyerPhones: string[]
  buyerNationalIds: string[]
  buyerReferrers: (string | undefined)[]
  trackingCode: string
  message: string
  history: Array<{
    status: string
    description: string
    date: string
    time: string
    image?: string
  }>
}

interface TransactionMatchingProps {
  sellers: Seller[]
  buyers: Buyer[]
  transactions: Transaction[]
  selectedSeller: string
  setSelectedSeller: (id: string) => void
  selectedBuyers: string[]
  setSelectedBuyers: (ids: string[]) => void
  createTransaction: () => void
  generateTrackingCode: (date: string, transactions: Transaction[]) => string
  createTransactionError: string
}

/**
 * A component for matching sellers and buyers to create transactions.
 */
const TransactionMatching: React.FC<TransactionMatchingProps> = ({
  sellers,
  buyers,
  transactions,
  selectedSeller,
  setSelectedSeller,
  selectedBuyers,
  setSelectedBuyers,
  createTransaction,
  generateTrackingCode,
  createTransactionError,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">تطبیق فروشنده و خریدار</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-3">انتخاب فروشنده</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
            {sellers
              .filter((s) => s.status === "active")
              .map((seller) => (
                <div
                  key={seller.id}
                  onClick={() => setSelectedSeller(seller.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer ${
                    selectedSeller === seller.id ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="font-semibold">{seller.fullName}</div>
                  <div className="text-sm text-gray-600">{seller.phone}</div>
                  <div className="text-sm text-green-600 mt-2">موجودی: {seller.remainingAmount} امتیاز</div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">انتخاب خریداران</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
            {buyers
              .filter((b) => b.remainingAmount > 0)
              .map((buyer) => (
                <div
                  key={buyer.id}
                  onClick={() => {
                    if (selectedBuyers.includes(buyer.id)) {
                      setSelectedBuyers(selectedBuyers.filter((id) => id !== buyer.id))
                    } else {
                      setSelectedBuyers([...selectedBuyers, buyer.id])
                    }
                  }}
                  className={`p-4 rounded-lg border-2 cursor-pointer ${
                    selectedBuyers.includes(buyer.id) ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="font-semibold">{buyer.name}</div>
                  <div className="text-sm text-gray-600">{buyer.phone}</div>
                  <div className="text-sm text-red-600 mt-2">نیاز: {buyer.remainingAmount} امتیاز</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {selectedSeller && selectedBuyers.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">
            مقدار قابل انتقال:{" "}
            {Math.min(
              sellers.find((s) => s.id === selectedSeller)?.remainingAmount || 0,
              buyers.filter((b) => selectedBuyers.includes(b.id)).reduce((sum, b) => sum + b.remainingAmount, 0),
            )}{" "}
            امتیاز
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-3">پیام‌های برای فروشنده:</h4>
            <div className="space-y-4">
              {(() => {
                const seller = sellers.find((s) => s.id === selectedSeller)
                const selectedBuyerObjects = buyers.filter((b) => selectedBuyers.includes(b.id))
                let remainingSellerCredit = seller?.remainingAmount || 0
                const newTransactions: Transaction[] = []

                return selectedBuyerObjects.map((buyer, index) => {
                  if (remainingSellerCredit <= 0) return null

                  const transferAmount = Math.min(buyer.remainingAmount, remainingSellerCredit)
                  remainingSellerCredit -= transferAmount
                  const currentDate = new Date().toLocaleDateString("fa-IR")
                  const trackingCode = generateTrackingCode(currentDate, [
                    ...transactions,
                    ...newTransactions.slice(0, index),
                  ])

                  return (
                    <div key={buyer.id} className="bg-white p-4 rounded border">
                      <div className="text-xs text-gray-500 mb-2">پیام #{index + 1}</div>
                      <div className="text-sm leading-relaxed" dir="rtl" id={`message-content-${buyer.id}`}>
                        {seller?.fullName} عزیز،
                        <br />
                        <br />
                        لطفاً تعداد {transferAmount} امتیاز وام را به نام {buyer.name} با کد ملی {buyer.nationalId} و
                        شماره تماس {buyer.phone} منتقل نمایید.
                        <br />
                        <br />
                        مبلغ {(transferAmount * CREDIT_PRICE).toLocaleString("fa-IR")} تومان ({transferAmount} امتیاز
                        × {CREDIT_PRICE.toLocaleString("fa-IR")} تومان) پس از انجام انتقال و بررسی نهایی، به حساب شما
                        واریز خواهد شد.
                        <br />
                        <br />
                        کد پیگیری: {trackingCode}
                        <br />
                        (لطفاً این کد را جهت هرگونه پیگیری نزد خود نگه دارید.)
                        <br />
                        <br />
                        با تشکر از همکاری شما
                        <br />
                        مجموعه رسانت
                      </div>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => {
                            const messageElement = document.getElementById(`message-content-${buyer.id}`)
                            if (messageElement) {
                              const text = messageElement.innerText
                              navigator.clipboard.writeText(text).then(() => {
                                alert(`پیام ${buyer.name} کپی شد!`)
                              })
                            }
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs"
                        >
                          📋 کپی
                        </button>

                        <button
                          onClick={() => {
                            const messageElement = document.getElementById(`message-content-${buyer.id}`)
                            if (messageElement) {
                              const text = messageElement.innerText
                              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
                              window.open(whatsappUrl, "_blank")
                            }
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-xs flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 12A10 10 0 0 0 12 2" />
                            <path d="M22 12A10 10 0 0 1 12 22" />
                            <path d="M12 2A10 10 0 0 0 2 12" />
                            <path d="M12 22A10 10 0 0 1 2 12" />
                            <path d="M15.5 8.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-6a.5.5 0 0 1 .5-.5h7z" />
                            <path d="M17.5 10.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h11z" />
                          </svg>
                          واتس‌اپ
                        </button>
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>

          {createTransactionError && <p className="text-red-500 text-sm mt-4">{createTransactionError}</p>}
          <button
            onClick={createTransaction}
            className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            ایجاد معامله
          </button>
        </div>
      )}
    </div>
  )
}

export default TransactionMatching
