import React from "react"

const CREDIT_PRICE = 135000

interface Seller {
  id: string
  name: string
  lastName: string
  phone: string
  accountNumber: string
  cardNumber: string
  creditAmount: number
  remainingAmount: number
  status: "active" | "completed"
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
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sellers
              .filter((s) => s.status === "active")
              .map((seller) => (
                <label key={seller.id} className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="radio"
                    name="seller"
                    value={seller.id}
                    checked={selectedSeller === seller.id}
                    onChange={(e) => setSelectedSeller(e.target.value)}
                    className="text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">
                      {seller.name} {seller.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {seller.phone} | باقیمانده: {seller.remainingAmount} امتیاز
                    </div>
                  </div>
                </label>
              ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">انتخاب خریداران</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {buyers
              .filter((b) => b.remainingAmount > 0)
              .map((buyer) => (
                <label key={buyer.id} className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    value={buyer.id}
                    checked={selectedBuyers.includes(buyer.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBuyers([...selectedBuyers, buyer.id])
                      } else {
                        setSelectedBuyers(selectedBuyers.filter((id) => id !== buyer.id))
                      }
                    }}
                    className="text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{buyer.name}</div>
                    <div className="text-sm text-gray-600">نیاز: {buyer.remainingAmount} امتیاز</div>
                  </div>
                </label>
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
                        {seller?.name} {seller?.lastName} عزیز،
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
                            if (messageElement && navigator.share) {
                              const text = messageElement.innerText
                              navigator
                                .share({
                                  title: `پیام انتقال امتیاز وام - ${buyer.name}`,
                                  text: text,
                                })
                                .catch((err) => console.error(err))
                            } else {
                              alert("قابلیت اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود")
                            }
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-xs"
                        >
                          📤 اشتراک
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
