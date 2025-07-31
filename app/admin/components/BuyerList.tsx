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
  statusFilter: string
  setStatusFilter: (status: string) => void
}

const statusMap = {
  all: "همه",
  pending: "در انتظار",
  partial: "نیمه تکمیل",
  completed: "تکمیل شده",
}

/**
 * A component to display a list of buyers.
 */
const BuyerList: React.FC<BuyerListProps> = ({ buyers, openAddBuyerModal, statusFilter, setStatusFilter }) => {
  const statusCounts = buyers.reduce(
    (acc, buyer) => {
      acc[buyer.status] = (acc[buyer.status] || 0) + 1
      acc.all++
      return acc
    },
    { all: 0, pending: 0, partial: 0, completed: 0 },
  )

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">لیست خریداران</h2>
      </div>
      <div className="flex gap-2 mb-4">
        {Object.entries(statusMap).map(([status, label]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === status ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {label} <span className="text-xs">({statusCounts[status as keyof typeof statusCounts]})</span>
          </button>
        ))}
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {buyers
          .filter((buyer) => statusFilter === "all" || buyer.status === statusFilter)
          .map((buyer) => (
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
                  {statusMap[buyer.status]}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default BuyerList
