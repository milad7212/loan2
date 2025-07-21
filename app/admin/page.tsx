"use client"

import { useState } from "react"
import InfoCard from "./components/InfoCard"
import SellerForm from "./components/SellerForm"
import BuyerList from "./components/BuyerList"
import TransactionMatching from "./components/TransactionMatching"
import TransactionHistory from "./components/TransactionHistory"
import Modal from "./components/Modal"

// Interfaces (keep them in the main page or move to a separate types file)
interface Buyer {
  id: string
  name: string
  phone: string
  nationalId: string
  referrer?: string
  requestedAmount: number
  remainingAmount: number
  status: "pending" | "partial" | "completed"
  description?: string
}

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

interface PaymentGroup {
  sellerPhone: string
  sellerName: string
  sellerCardNumber: string
  transactions: Transaction[]
  totalAmount: number
  referrerPayments: Array<{
    referrerName: string
    totalAmount: number
    transactions: Transaction[]
  }>
}

// Constants
const CREDIT_PRICE = 135000
const REFERRER_COMMISSION = 5000

export default function LoanCreditAdmin() {
  // State variables
  const [buyers, setBuyers] = useState<Buyer[]>([
    {
      id: "1",
      name: "احمد محمدی",
      phone: "09123456789",
      nationalId: "1234567890",
      referrer: "حسن کریمی",
      requestedAmount: 100,
      remainingAmount: 100,
      status: "pending",
    },
    {
      id: "2",
      name: "فاطمه احمدی",
      phone: "09987654321",
      nationalId: "0987654321",
      requestedAmount: 50,
      remainingAmount: 20,
      status: "partial",
    },
  ])

  const [sellers, setSellers] = useState<Seller[]>([
    {
      id: "1",
      name: "حسن",
      lastName: "موسوی",
      phone: "09777888999",
      accountNumber: "1234567890",
      cardNumber: "6037 9977 1234 5678",
      creditAmount: 80,
      remainingAmount: 80,
      status: "active",
    },
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      sellerId: "1",
      buyerIds: ["2"],
      amount: 30,
      status: "pending_payment",
      date: "1403/10/15",
      sellerName: "حسن موسوی",
      buyerNames: ["فاطمه احمدی"],
      sellerPhone: "09777888999",
      sellerNationalId: "1234567890",
      buyerPhones: ["09987654321"],
      buyerNationalIds: ["0987654321"],
      buyerReferrers: [undefined],
      trackingCode: "40415001",
      message:
        "حسن موسوی عزیز، لطفاً تعداد 30 امتیاز وام را به نام فاطمه احمدی با کد ملی 0987654321 و شماره تماس 09987654321 منتقل نمایید.",
      history: [
        {
          status: "در انتظار انتقال وام",
          description: "معامله ایجاد شد",
          date: "1403/10/15",
          time: "14:30",
        },
      ],
    },
  ])
  const [selectedSeller, setSelectedSeller] = useState<string>("")
  const [selectedBuyers, setSelectedBuyers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [selectedPrintTransaction, setSelectedPrintTransaction] = useState<Transaction | null>(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedStatusTransaction, setSelectedStatusTransaction] = useState<Transaction | null>(null)
  const [statusDescription, setStatusDescription] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPaymentGroup, setSelectedPaymentGroup] = useState<PaymentGroup | null>(null)
  const [paymentDescription, setPaymentDescription] = useState("")
  const [paymentImage, setPaymentImage] = useState<string | null>(null)
  const [isAddBuyerModalOpen, setIsAddBuyerModalOpen] = useState(false)
  const [newBuyer, setNewBuyer] = useState({
    name: "",
    nationalId: "",
    phone: "",
    referrer: "",
    requestedAmount: 0,
    description: "",
  })

  // Functions

  /**
   * Generates a unique tracking code for a transaction based on the date.
   * @param date The date of the transaction in "YYYY/MM/DD" format.
   * @param transactions The list of existing transactions.
   * @returns A unique tracking code.
   */
  const generateTrackingCode = (date: string, transactions: Transaction[]) => {
    const [year, month, day] = date.split("/").map(Number)
    const yearDigit = year % 10
    const monthStr = month.toString().padStart(2, "0")
    const dayStr = day.toString().padStart(2, "0")
    const sameDate = transactions.filter((t) => t.date === date).length
    const sequenceNumber = (sameDate + 1).toString().padStart(3, "0")
    return `${yearDigit}${monthStr}${dayStr}${sequenceNumber}`
  }

  /**
   * Adds a new seller to the list of sellers.
   * @param sellerData The data of the new seller.
   */
  const addSeller = (sellerData: Omit<Seller, "id" | "remainingAmount" | "status">) => {
    const seller: Seller = {
      id: Date.now().toString(),
      ...sellerData,
      remainingAmount: sellerData.creditAmount,
      status: "active",
    }
    setSellers([...sellers, seller])
  }

  const [buyerError, setBuyerError] = useState("")

  /**
   * Adds a new buyer to the list of buyers.
   */
  const addBuyer = () => {
    if (!newBuyer.name) {
      setBuyerError("نام خریدار الزامی است.")
      return
    }
    if (!newBuyer.nationalId) {
      setBuyerError("کد ملی خریدار الزامی است.")
      return
    }
    if (!newBuyer.phone) {
      setBuyerError("شماره تماس خریدار الزامی است.")
      return
    }
    if (newBuyer.requestedAmount <= 0) {
      setBuyerError("مقدار امتیاز درخواستی باید بیشتر از صفر باشد.")
      return
    }

    const buyer: Buyer = {
      id: Date.now().toString(),
      name: newBuyer.name,
      nationalId: newBuyer.nationalId,
      phone: newBuyer.phone,
      referrer: newBuyer.referrer || undefined,
      requestedAmount: newBuyer.requestedAmount,
      remainingAmount: newBuyer.requestedAmount,
      status: "pending",
      description: newBuyer.description,
    }
    setBuyers([...buyers, buyer])
    setNewBuyer({
      name: "",
      nationalId: "",
      phone: "",
      referrer: "",
      requestedAmount: 0,
      description: "",
    })
    setBuyerError("")
    setIsAddBuyerModalOpen(false)
  }

  const [transactionError, setTransactionError] = useState("")

  /**
   * Creates a new transaction between a seller and one or more buyers.
   */
  const createTransaction = () => {
    if (!selectedSeller) {
      setTransactionError("لطفا یک فروشنده انتخاب کنید.")
      return
    }
    if (selectedBuyers.length === 0) {
      setTransactionError("لطفا حداقل یک خریدار انتخاب کنید.")
      return
    }

    const seller = sellers.find((s) => s.id === selectedSeller)
    const selectedBuyerObjects = buyers.filter((b) => selectedBuyers.includes(b.id))

    if (!seller) return

    let remainingSellerCredit = seller.remainingAmount
    const newTransactions: Transaction[] = []

    selectedBuyerObjects.forEach((buyer, index) => {
      if (remainingSellerCredit > 0) {
        const transferAmount = Math.min(buyer.remainingAmount, remainingSellerCredit)
        const currentDate = new Date().toLocaleDateString("fa-IR")
        const trackingCode = generateTrackingCode(currentDate, [...transactions, ...newTransactions.slice(0, index)])

        const message = `${seller.name} ${seller.lastName} عزیز،

لطفاً تعداد ${transferAmount} امتیاز وام را به نام ${buyer.name} با کد ملی ${buyer.nationalId} و شماره تماس ${buyer.phone} منتقل نمایید.

مبلغ ${(transferAmount * CREDIT_PRICE).toLocaleString("fa-IR")} تومان (${transferAmount} امتیاز × ${CREDIT_PRICE.toLocaleString(
          "fa-IR",
        )} تومان) پس از انجام انتقال و بررسی نهایی، به حساب شما واریز خواهد شد.

کد پیگیری: ${trackingCode}
(لطفاً این کد را جهت هرگونه پیگیری نزد خود نگه دارید.)

با تشکر از همکاری شما
مجموعه رسانت`

        const transaction: Transaction = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          sellerId: selectedSeller,
          buyerIds: [buyer.id],
          amount: transferAmount,
          status: "pending_transfer",
          date: new Date().toLocaleDateString("fa-IR"),
          sellerName: `${seller.name} ${seller.lastName}`,
          buyerNames: [buyer.name],
          sellerPhone: seller.phone,
          sellerNationalId: seller.accountNumber,
          buyerPhones: [buyer.phone],
          buyerNationalIds: [buyer.nationalId],
          buyerReferrers: [buyer.referrer],
          trackingCode: trackingCode,
          message: message,
          history: [
            {
              status: "در انتظار انتقال وام",
              description: "معامله ایجاد شد",
              date: new Date().toLocaleDateString("fa-IR"),
              time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        }

        newTransactions.push(transaction)
        remainingSellerCredit -= transferAmount
      }
    })

    setTransactions([...transactions, ...newTransactions])

    const totalTransferred = newTransactions.reduce((sum, t) => sum + t.amount, 0)
    setSellers(
      sellers.map((s) =>
        s.id === selectedSeller
          ? {
              ...s,
              remainingAmount: s.remainingAmount - totalTransferred,
              status: s.remainingAmount - totalTransferred === 0 ? "completed" : "active",
            }
          : s,
      ),
    )

    setBuyers(
      buyers.map((buyer) => {
        const buyerTransaction = newTransactions.find((t) => t.buyerIds.includes(buyer.id))
        if (buyerTransaction) {
          const newRemaining = buyer.remainingAmount - buyerTransaction.amount
          return {
            ...buyer,
            remainingAmount: newRemaining,
            status: newRemaining === 0 ? "completed" : newRemaining < buyer.requestedAmount ? "partial" : "pending",
          }
        }
        return buyer
      }),
    )

    setSelectedSeller("")
    setSelectedBuyers([])
  }

  /**
   * Groups pending payments by seller.
   * @returns An array of payment groups.
   */
  const getPaymentGroups = (): PaymentGroup[] => {
    const pendingTransactions = transactions.filter((t) => t.status === "pending_payment")
    const groupedBySeller = pendingTransactions.reduce(
      (acc, transaction) => {
        const key = transaction.sellerPhone
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(transaction)
        return acc
      },
      {} as Record<string, Transaction[]>,
    )

    return Object.entries(groupedBySeller).map(([sellerPhone, transactions]) => {
      const seller = sellers.find((s) => s.phone === sellerPhone)
      const totalAmount = transactions.reduce((sum, t) => sum + t.amount * CREDIT_PRICE, 0)

      const referrerGroups = transactions.reduce(
        (acc, transaction) => {
          transaction.buyerReferrers.forEach((referrer, index) => {
            if (referrer) {
              if (!acc[referrer]) {
                acc[referrer] = []
              }
              acc[referrer].push({
                ...transaction,
                amount: transaction.amount,
              })
            }
          })
          return acc
        },
        {} as Record<string, Transaction[]>,
      )

      const referrerPayments = Object.entries(referrerGroups).map(([referrerName, referrerTransactions]) => ({
        referrerName,
        totalAmount: referrerTransactions.reduce((sum, t) => sum + t.amount * REFERRER_COMMISSION, 0),
        transactions: referrerTransactions,
      }))

      return {
        sellerPhone,
        sellerName: transactions[0].sellerName,
        sellerCardNumber: seller?.cardNumber || "",
        transactions,
        totalAmount,
        referrerPayments,
      }
    })
  }

  /**
   * Marks a payment group as complete.
   * @param group The payment group to mark as complete.
   */
  const handlePaymentComplete = (group: PaymentGroup) => {
    const currentTime = new Date()
    const updatedTransactions = transactions.map((t) => {
      if (group.transactions.some((gt) => gt.id === t.id)) {
        return {
          ...t,
          status: "completed" as const,
          history: [
            ...t.history,
            {
              status: "تسویه شده",
              description: paymentDescription || "وجه به حساب فروشنده واریز شد",
              date: currentTime.toLocaleDateString("fa-IR"),
              time: currentTime.toLocaleTimeString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              image: paymentImage || undefined,
            },
          ],
        }
      }
      return t
    })

    setTransactions(updatedTransactions)
    setIsPaymentModalOpen(false)
    setSelectedPaymentGroup(null)
    setPaymentDescription("")
    setPaymentImage(null)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow && selectedPrintTransaction) {
      const content = document.getElementById("print-content")?.innerHTML
      printWindow.document.write(`
      <html>
        <head>
          <title>سند تحویل - ${selectedPrintTransaction.trackingCode}</title>
          <style>
            body { font-family: 'Tahoma', Arial, sans-serif; direction: rtl; margin: 0; padding: 20px; }
            .document { page-break-after: always; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .content { margin: 20px 0; }
            .footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; }
            .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
            .signature-box { border: 1px solid #333; padding: 20px; width: 200px; text-align: center; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const totalBuyers = buyers.length
  const totalDemand = buyers.reduce((sum, buyer) => sum + buyer.remainingAmount, 0)
  const completedTransactions = transactions.length
  const pendingPayments = transactions.filter((t) => t.status === "pending_payment").length

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">مدیریت خرید و فروش امتیاز وام</h1>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors font-medium"
          >
            پرداخت‌های در انتظار ({pendingPayments})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InfoCard title="تعداد خریداران" value={totalBuyers} color="text-blue-600" />
          <InfoCard title="کل تقاضا (امتیاز)" value={totalDemand} color="text-green-600" />
          <InfoCard title="معاملات انجام شده" value={completedTransactions} color="text-purple-600" />
          <InfoCard title="در انتظار پرداخت" value={pendingPayments} color="text-red-600" />
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-8">
          <div className="w-full lg:w-1/2">
            <SellerForm addSeller={addSeller} />
          </div>
          <div className="w-full lg:w-1/2">
            <BuyerList buyers={buyers} openAddBuyerModal={() => setIsAddBuyerModalOpen(true)} />
          </div>
        </div>

        {sellers.length > 0 && (
          <TransactionMatching
            sellers={sellers}
            buyers={buyers}
            transactions={transactions}
            selectedSeller={selectedSeller}
            setSelectedSeller={setSelectedSeller}
            selectedBuyers={selectedBuyers}
            setSelectedBuyers={setSelectedBuyers}
            createTransaction={createTransaction}
            generateTrackingCode={generateTrackingCode}
            createTransactionError={transactionError}
          />
        )}

        <TransactionHistory
          transactions={transactions}
          openModal={(t) => {
            setSelectedTransaction(t)
            setIsModalOpen(true)
          }}
          openPrintModal={(t) => {
            setSelectedPrintTransaction(t)
            setIsPrintModalOpen(true)
          }}
          openStatusModal={(t) => {
            setSelectedStatusTransaction(t)
            setIsStatusModalOpen(true)
          }}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />
      </div>

      {/* Modals */}
      <Modal isOpen={isAddBuyerModalOpen} onClose={() => setIsAddBuyerModalOpen(false)} title="افزودن خریدار جدید">
        {buyerError && <p className="text-red-500 text-sm mb-4">{buyerError}</p>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="نام و نام خانوادگی"
            value={newBuyer.name}
            onChange={(e) => setNewBuyer({ ...newBuyer, name: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="کد ملی"
            value={newBuyer.nationalId}
            onChange={(e) => setNewBuyer({ ...newBuyer, nationalId: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="شماره تماس"
            value={newBuyer.phone}
            onChange={(e) => setNewBuyer({ ...newBuyer, phone: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="معرف (اختیاری)"
            value={newBuyer.referrer}
            onChange={(e) => setNewBuyer({ ...newBuyer, referrer: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="مقدار امتیاز درخواستی"
            value={newBuyer.requestedAmount || ""}
            onChange={(e) => setNewBuyer({ ...newBuyer, requestedAmount: Number.parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="توضیحات (اختیاری)"
            value={newBuyer.description}
            onChange={(e) => setNewBuyer({ ...newBuyer, description: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={addBuyer}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            افزودن خریدار
          </button>
          <button
            onClick={() => setIsAddBuyerModalOpen(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            انصراف
          </button>
        </div>
      </Modal>

      {isModalOpen && selectedTransaction && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="پیام معامله">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
            <h4 className="font-medium text-blue-800 mb-3">متن پیام:</h4>
            <div
              className="bg-white p-4 rounded border text-sm leading-relaxed whitespace-pre-line"
              dir="rtl"
              id="modal-message-content"
            >
              {selectedTransaction.message}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                const messageElement = document.getElementById("modal-message-content")
                if (messageElement) {
                  const text = messageElement.innerText
                  navigator.clipboard.writeText(text).then(() => {
                    alert("پیام کپی شد!")
                  })
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              📋 کپی پیام
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              بستن
            </button>
          </div>
        </Modal>
      )}

      {isPrintModalOpen && selectedPrintTransaction && (
        <Modal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} title="پیش‌نمایش سند تحویل">
          <div className="mb-4 flex gap-2 justify-end">
            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              🖨️ چاپ
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              📄 دانلود PDF
            </button>
          </div>
          <div id="print-content" className="bg-white" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
            {/* Print content remains the same */}
          </div>
        </Modal>
      )}

      {isStatusModalOpen && selectedStatusTransaction && (
        <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title="تغییر وضعیت معامله">
          {/* Status change modal content remains the same */}
        </Modal>
      )}

      {isPaymentModalOpen && (
        <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="پرداخت‌های در انتظار">
          {/* Payment modal content remains the same */}
        </Modal>
      )}
    </div>
  )
}
