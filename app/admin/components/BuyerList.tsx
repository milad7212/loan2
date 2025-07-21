import React from "react"

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

interface BuyerListProps {
  buyers: Buyer[]
  openAddBuyerModal: () => void
}

/**
 * A component to display a list of buyers.
 */
const BuyerList: React.FC<BuyerListProps> = ({ buyers, openAddBuyerModal }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">لیست خریداران</h2>
        <button
          onClick={openAddBuyerModal}
          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
        >
          + افزودن خریدار جدید
        </button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {buyers.map((buyer) => (
          <div key={buyer.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{buyer.name}</h3>
                <p className="text-sm text-gray-600">{buyer.phone}</p>
                <p className="text-sm text-gray-600">کد ملی: {buyer.nationalId}</p>
                {buyer.referrer && <p className="text-sm text-blue-600">معرف: {buyer.referrer}</p>}
                <p className="text-sm mt-1">
                  درخواست: {buyer.requestedAmount} امتیاز | باقیمانده: {buyer.remainingAmount} امتیاز
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  buyer.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : buyer.status === "partial"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {buyer.status === "completed"
                  ? "تکمیل شده"
                  : buyer.status === "partial"
                  ? "نیمه تکمیل"
                  : "در انتظار"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuyerList
