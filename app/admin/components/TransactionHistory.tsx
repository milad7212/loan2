import React from "react";
import * as XLSX from "xlsx";
import {
  FileDown,
  Eye,
  Printer,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

interface Transaction {
  id:string;
  seller_id: string;
  buyer_ids: string[];
  amount: number;
  status:
    | "pending_transfer"
    | "transferred"
    | "pending_payment"
    | "completed"
    | "cancelled"
    | "paid";
  date: string;
  sellerName: string;
  buyerNames: string[];
  sellerPhone: string;
  sellerNationalId: string;
  buyerPhones: string[];
  buyerNationalIds: string[];
  buyerReferrers: (string | undefined)[];
  tracking_code: string;
  message: string;
  history: Array<{
    status: string;
    description: string;
    date: string;
    time: string;
    image?: string;
  }>;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  openModal: (transaction: Transaction) => void;
  openPrintModal: (transaction: Transaction) => void;
  openStatusModal: (transaction: Transaction) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortField: string;
  setSortField: (field: string) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
}

const SortableHeader = ({
  label,
  field,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
}: {
  label: string;
  field: string;
  sortField: string;
  sortDirection: "asc" | "desc";
  setSortField: (field: string) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
}) => (
  <th
    className="text-right py-3 px-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
    onClick={() => {
      setSortField(field);
      setSortDirection(sortField === field && sortDirection === "asc" ? "desc" : "asc");
    }}
  >
    <div className="flex items-center gap-2">
      {label}
      {sortField === field && <ArrowUpDown className="h-4 w-4" />}
    </div>
  </th>
);

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
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return (
      transaction.sellerName.toLowerCase().includes(lowercasedSearchTerm) ||
      transaction.buyerNames.some((name) =>
        name.toLowerCase().includes(lowercasedSearchTerm)
      ) ||
      transaction.tracking_code.toLowerCase().includes(lowercasedSearchTerm) ||
      transaction.sellerPhone.includes(searchTerm) ||
      transaction.buyerPhones.some((phone) => phone.includes(searchTerm)) ||
      transaction.sellerNationalId.includes(searchTerm) ||
      transaction.buyerNationalIds.some((id) => id.includes(searchTerm)) ||
      transaction.date.includes(searchTerm) ||
      (transaction.buyerReferrers &&
        transaction.buyerReferrers.some(
          (referrer) =>
            referrer && referrer.toLowerCase().includes(lowercasedSearchTerm)
        ))
    );
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue: any = a[sortField as keyof Transaction];
    let bValue: any = b[sortField as keyof Transaction];

    if (sortField === "date") {
      aValue = new Date(a.date.replace(/\//g, "-")).getTime();
      bValue = new Date(b.date.replace(/\//g, "-")).getTime();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

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
        معرف:
          t.buyerReferrers && t.buyerReferrers.filter(Boolean).join(", ")
            ? t.buyerReferrers.filter(Boolean).join(", ")
            : "-",
        مقدار: t.amount,
        "کد پیگیری": t.tracking_code,
        وضعیت: t.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">تاریخچه معاملات</h2>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            title="خروجی اکسل"
          >
            <FileDown className="h-4 w-4" />
            خروجی اکسل
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending_transfer">در انتظار انتقال</option>
              <option value="transferred">منتقل شده</option>
              <option value="pending_payment">در انتظار پرداخت</option>
              <option value="completed">تکمیل شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader label="تاریخ" field="date" {...{ sortField, setSortField, sortDirection, setSortDirection }} />
              <SortableHeader label="فروشنده" field="sellerName" {...{ sortField, setSortField, sortDirection, setSortDirection }} />
              <th className="py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">خریدار</th>
              <SortableHeader label="مقدار" field="amount" {...{ sortField, setSortField, sortDirection, setSortDirection }} />
              <th className="py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">کد پیگیری</th>
              <SortableHeader label="وضعیت" field="status" {...{ sortField, setSortField, sortDirection, setSortDirection }} />
              <th className="py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-100 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap">{transaction.date}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="font-medium text-gray-800">{transaction.sellerName}</div>
                  <div className="text-gray-500">{transaction.sellerPhone}</div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="font-medium text-gray-800">{transaction.buyerNames.join(", ")}</div>
                  <div className="text-gray-500">{transaction.buyerPhones.join(", ")}</div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">{transaction.amount} امتیاز</td>
                <td className="py-4 px-4 whitespace-nowrap font-mono text-xs">{transaction.tracking_code}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                      ? "تکمیل شده"
                      : transaction.status === "pending_payment"
                      ? "در انتظار پرداخت"
                      : transaction.status === "transferred"
                      ? "منتقل شده"
                      : transaction.status === "cancelled"
                      ? "لغو شده"
                      : "در انتظار انتقال"}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(transaction)}
                      className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-700 transition-colors"
                      title="مشاهده پیام"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openPrintModal(transaction)}
                      className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-700 transition-colors"
                      title="چاپ سند"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openStatusModal(transaction)}
                      className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-700 transition-colors"
                      title="تغییر وضعیت"
                      disabled={transaction.status === "completed" || transaction.status === "cancelled"}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedTransactions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>هیچ معامله‌ای یافت نشد.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
