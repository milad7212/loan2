import React from "react"
import * as XLSX from "xlsx"

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

interface TransactionHistoryProps {
  transactions: Transaction[]
  openModal: (transaction: Transaction) => void
  openPrintModal: (transaction: Transaction) => void
  openStatusModal: (transaction: Transaction) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  sortField: string
  setSortField: (field: string) => void
  sortDirection: "asc" | "desc"
  setSortDirection: (direction: "asc" | "desc") => void
}

/**
 * A component to display the history of transactions.
 */
const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  openModal,
  openPrintModal,
  openStatusModal,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}) => {
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyerNames.some((name) => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      transaction.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.sellerPhone.includes(searchTerm) ||
      transaction.buyerPhones.some((phone) => phone.includes(searchTerm)) ||
      transaction.sellerNationalId.includes(searchTerm) ||
      transaction.buyerNationalIds.some((id) => id.includes(searchTerm)) ||
      transaction.date.includes(searchTerm) ||
      transaction.buyerReferrers.some((referrer) => referrer?.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue: any = a[sortField as keyof Transaction]
    let bValue: any = b[sortField as keyof Transaction]

    if (sortField === "date") {
      aValue = new Date(a.date.replace(/\//g, "-"))
      bValue = new Date(b.date.replace(/\//g, "-"))
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sortedTransactions.map((t) => ({
        تاریخ: t.date,
        فروشنده: t.sellerName,
        "کد ملی فروشنده": t.sellerNationalId,
        "موبایل فروشنده": t.sellerPhone,
        خریدار: t.buyerNames.join(", "),
        "کد ملی خریدار": t.buyerNationalIds.join(", "),
        "موبایل خریدار": t.buyerPhones.join(", "),
        معرف: t.buyerReferrers.filter(Boolean).join(", ") || "-",
        مقدار: t.amount,
        "کد پیگیری": t.trackingCode,
        وضعیت: t.status,
      })),
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions")
    XLSX.writeFile(workbook, "transactions.xlsx")
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">تاریخچه معاملات</h2>
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
          title="خروجی اکسل"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.293a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <input
            type="text"
            placeholder="جستجو در معاملات (نام، کد ملی، شماره تماس، کد پیگیری، تاریخ، معرف)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="pending_transfer">در انتظار انتقال وام</option>
            <option value="transferred">وام منتقل شد</option>
            <option value="pending_payment">در انتظار پرداخت وجه</option>
            <option value="completed">تسویه شده</option>
            <option value="cancelled">لغو</option>
          </select>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">تاریخ</option>
            <option value="sellerName">فروشنده</option>
            <option value="amount">مقدار</option>
            <option value="status">وضعیت</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            className="border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50"
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-right py-2 px-2">تاریخ</th>
              <th className="text-right py-2 px-2">فروشنده</th>
              <th className="text-right py-2 px-2">کد ملی فروشنده</th>
              <th className="text-right py-2 px-2">موبایل فروشنده</th>
              <th className="text-right py-2 px-2">خریدار</th>
              <th className="text-right py-2 px-2">کد ملی خریدار</th>
              <th className="text-right py-2 px-2">موبایل خریدار</th>
              <th className="text-right py-2 px-2">معرف</th>
              <th className="text-right py-2 px-2">مقدار</th>
              <th className="text-right py-2 px-2">کد پیگیری</th>
              <th className="text-right py-2 px-2">وضعیت</th>
              <th className="text-right py-2 px-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">{transaction.date}</td>
                <td className="py-2 px-2">{transaction.sellerName}</td>
                <td className="py-2 px-2">{transaction.sellerNationalId}</td>
                <td className="py-2 px-2">{transaction.sellerPhone}</td>
                <td className="py-2 px-2">{transaction.buyerNames.join(", ")}</td>
                <td className="py-2 px-2">{transaction.buyerNationalIds.join(", ")}</td>
                <td className="py-2 px-2">{transaction.buyerPhones.join(", ")}</td>
                <td className="py-2 px-2">{transaction.buyerReferrers.filter(Boolean).join(", ") || "-"}</td>
                <td className="py-2 px-2">{transaction.amount} امتیاز</td>
                <td className="py-2 px-2 font-mono text-xs">{transaction.trackingCode}</td>
                <td className="py-2 px-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : transaction.status === "pending_payment"
                        ? "bg-yellow-100 text-yellow-800"
                        : transaction.status === "transferred"
                        ? "bg-blue-100 text-blue-800"
                        : transaction.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {transaction.status === "completed"
                      ? "تسویه شده"
                      : transaction.status === "pending_payment"
                      ? "در انتظار پرداخت وجه"
                      : transaction.status === "transferred"
                      ? "وام منتقل شد"
                      : transaction.status === "cancelled"
                      ? "لغو"
                      : "در انتظار انتقال وام"}
                  </span>
                </td>
                <td className="py-2 px-2 flex gap-2">
                  <button
                    onClick={() => openModal(transaction)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    title="مشاهده پیام"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => openPrintModal(transaction)}
                    className="text-green-600 hover:text-green-800 cursor-pointer"
                    title="چاپ سند"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => openStatusModal(transaction)}
                    className="text-orange-600 hover:text-orange-800 cursor-pointer"
                    title="تغییر وضعیت"
                    disabled={transaction.status === "completed" || transaction.status === "cancelled"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 011.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">هیچ معامله‌ای یافت نشد</div>
        )}
      </div>
    </div>
  )
}

export default TransactionHistory
