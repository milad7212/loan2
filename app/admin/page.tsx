"use client"

import { useState } from "react"

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
  status: "pending_transfer" | "transferred" | "pending_payment" | "completed" | "cancelled"
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

export default function LoanCreditAdmin() {
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
    {
      id: "3",
      name: "علی رضایی",
      phone: "09111222333",
      nationalId: "1122334455",
      referrer: "مریم صادقی",
      requestedAmount: 75,
      remainingAmount: 75,
      status: "pending",
    },
    {
      id: "4",
      name: "مریم کریمی",
      phone: "09444555666",
      nationalId: "5566778899",
      requestedAmount: 200,
      remainingAmount: 0,
      status: "completed",
    },
  ])

  const [sellers, setSellers] = useState<Seller[]>([
    {
      id: "1",
      name: "حسن",
      lastName: "موسوی",
      phone: "09777888999",
      accountNumber: "1234567890",
      cardNumber: "6037-9977-1234-5678",
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
        {
          status: "وام منتقل شد",
          description: "انتقال وام توسط فروشنده تأیید شد",
          date: "1403/10/16",
          time: "09:15",
        },
      ],
    },
    {
      id: "2",
      sellerId: "1",
      buyerIds: ["4"],
      amount: 200,
      status: "completed",
      date: "1403/10/10",
      sellerName: "حسن موسوی",
      buyerNames: ["مریم کریمی"],
      sellerPhone: "09777888999",
      sellerNationalId: "1234567890",
      buyerPhones: ["09444555666"],
      buyerNationalIds: ["5566778899"],
      buyerReferrers: [undefined],
      trackingCode: "40414001",
      message:
        "حسن موسوی عزیز، لطفاً تعداد 200 امتیاز وام را به نام مریم کریمی با کد ملی 5566778899 و شماره تماس 09444555666 منتقل نمایید.",
      history: [
        {
          status: "در انتظار انتقال وام",
          description: "معامله ایجاد شد",
          date: "1403/10/10",
          time: "10:00",
        },
        {
          status: "وام منتقل شد",
          description: "انتقال وام تأیید شد",
          date: "1403/10/11",
          time: "11:30",
        },
        {
          status: "در انتظار پرداخت وجه",
          description: "در انتظار واریز وجه به حساب فروشنده",
          date: "1403/10/11",
          time: "11:35",
        },
        {
          status: "تسویه شده",
          description: "وجه به حساب فروشنده واریز شد",
          date: "1403/10/12",
          time: "16:45",
        },
      ],
    },
  ])

  const [newSeller, setNewSeller] = useState({
    name: "",
    lastName: "",
    phone: "",
    accountNumber: "",
    cardNumber: "",
    creditAmount: 0,
  })

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

  // اضافه کردن state جدید برای مودال اضافه کردن خریدار
  const [isAddBuyerModalOpen, setIsAddBuyerModalOpen] = useState(false)
  const [newBuyer, setNewBuyer] = useState({
    name: "",
    nationalId: "",
    phone: "",
    referrer: "",
    requestedAmount: 0,
    description: "",
  })

  const CREDIT_PRICE = 135000 // قیمت هر امتیاز به تومان
  const REFERRER_COMMISSION = 5000 // پاداش معرف به ازای هر امتیاز

  const generateTrackingCode = (date: string, transactions: Transaction[]) => {
    // Parse Persian date (YYYY/MM/DD format)
    const [year, month, day] = date.split("/").map(Number)

    // Get last digit of year
    const yearDigit = year % 10

    // Format month and day as two digits
    const monthStr = month.toString().padStart(2, "0")
    const dayStr = day.toString().padStart(2, "0")

    // Count transactions for the same date
    const sameDate = transactions.filter((t) => t.date === date).length
    const sequenceNumber = (sameDate + 1).toString().padStart(3, "0")

    return `${yearDigit}${monthStr}${dayStr}${sequenceNumber}`
  }

  const addSeller = () => {
    if (newSeller.name && newSeller.lastName && newSeller.phone && newSeller.creditAmount > 0) {
      const seller: Seller = {
        id: Date.now().toString(),
        ...newSeller,
        remainingAmount: newSeller.creditAmount,
        status: "active",
      }
      setSellers([...sellers, seller])
      setNewSeller({
        name: "",
        lastName: "",
        phone: "",
        accountNumber: "",
        cardNumber: "",
        creditAmount: 0,
      })
    }
  }

  // اضافه کردن تابع برای افزودن خریدار جدید
  const addBuyer = () => {
    if (newBuyer.name && newBuyer.nationalId && newBuyer.phone && newBuyer.requestedAmount > 0) {
      const buyer: Buyer = {
        id: Date.now().toString(),
        name: newBuyer.name,
        nationalId: newBuyer.nationalId,
        phone: newBuyer.phone,
        referrer: newBuyer.referrer || undefined,
        requestedAmount: newBuyer.requestedAmount,
        remainingAmount: newBuyer.requestedAmount,
        status: "pending",
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
      setIsAddBuyerModalOpen(false)
    }
  }

  const createTransaction = () => {
    if (!selectedSeller || selectedBuyers.length === 0) return

    const seller = sellers.find((s) => s.id === selectedSeller)
    const selectedBuyerObjects = buyers.filter((b) => selectedBuyers.includes(b.id))

    if (!seller) return

    let remainingSellerCredit = seller.remainingAmount
    const newTransactions: Transaction[] = []

    // ایجاد معامله جداگانه برای هر خریدار
    selectedBuyerObjects.forEach((buyer, index) => {
      if (remainingSellerCredit > 0) {
        const transferAmount = Math.min(buyer.remainingAmount, remainingSellerCredit)
        const currentDate = new Date().toLocaleDateString("fa-IR")
        const trackingCode = generateTrackingCode(currentDate, [...transactions, ...newTransactions.slice(0, index)])

        const message = `${seller.name} ${seller.lastName} عزیز،

لطفاً تعداد ${transferAmount} امتیاز وام را به نام ${buyer.name} با کد ملی ${buyer.nationalId} و شماره تماس ${buyer.phone} منتقل نمایید.

مبلغ ${(transferAmount * CREDIT_PRICE).toLocaleString("fa-IR")} تومان (${transferAmount} امتیاز × ${CREDIT_PRICE.toLocaleString("fa-IR")} تومان) پس از انجام انتقال و بررسی نهایی، به حساب شما واریز خواهد شد.

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
          sellerNationalId: seller.accountNumber, // فرض می‌کنیم accountNumber همان کد ملی است
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

    // Update seller remaining amount
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

    // Update buyers remaining amounts
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

  const totalBuyers = buyers.length
  const totalDemand = buyers.reduce((sum, buyer) => sum + buyer.remainingAmount, 0)
  const completedTransactions = transactions.length
  const pendingPayments = transactions.filter((t) => t.status === "pending_payment").length

  // Group pending payments by seller phone
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

      // Group by referrer
      const referrerGroups = transactions.reduce(
        (acc, transaction) => {
          transaction.buyerReferrers.forEach((referrer, index) => {
            if (referrer) {
              if (!acc[referrer]) {
                acc[referrer] = []
              }
              acc[referrer].push({
                ...transaction,
                amount: transaction.amount, // Keep original amount for this specific buyer
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

  const generatePaymentMessage = (group: PaymentGroup, isReferrer = false, referrerName?: string) => {
    if (isReferrer && referrerName) {
      const referrerPayment = group.referrerPayments.find((rp) => rp.referrerName === referrerName)
      if (!referrerPayment) return ""

      return `${referrerName} عزیز،

بابت معرفی مشتریان زیر، مبلغ ${referrerPayment.totalAmount.toLocaleString("fa-IR")} تومان پاداش معرف به حساب شما واریز می‌شود:

${referrerPayment.transactions
  .map(
    (t, index) =>
      `${index + 1}. ${t.buyerNames[0]} - ${t.amount} امتیاز - ${(t.amount * REFERRER_COMMISSION).toLocaleString("fa-IR")} تومان`,
  )
  .join("\n")}

مجموع پاداش: ${referrerPayment.totalAmount.toLocaleString("fa-IR")} تومان

با تشکر از همکاری شما
مجموعه رسانت`
    }

    return `${group.sellerName} عزیز،

بابت انتقال امتیازات وام زیر، مبلغ ${group.totalAmount.toLocaleString("fa-IR")} تومان به حساب شما واریز می‌شود:

${group.transactions
  .map(
    (t, index) =>
      `${index + 1}. کد پیگیری: ${t.trackingCode} - ${t.amount} امتیاز - ${(t.amount * CREDIT_PRICE).toLocaleString("fa-IR")} تومان`,
  )
  .join("\n")}

شماره کارت: ${group.sellerCardNumber}
مجموع مبلغ: ${group.totalAmount.toLocaleString("fa-IR")} تومان

با تشکر از همکاری شما
مجموعه رسانت`
  }

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

  // Filter and sort transactions
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

  const openModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedTransaction(null)
    setIsModalOpen(false)
  }

  const openPrintModal = (transaction: Transaction) => {
    setSelectedPrintTransaction(transaction)
    setIsPrintModalOpen(true)
  }

  const closePrintModal = () => {
    setSelectedPrintTransaction(null)
    setIsPrintModalOpen(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    // Simple PDF download using browser's print to PDF
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

        {/* آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{totalBuyers}</div>
            <div className="text-gray-600">تعداد خریداران</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{totalDemand}</div>
            <div className="text-gray-600">کل تقاضا (امتیاز)</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">{completedTransactions}</div>
            <div className="text-gray-600">معاملات انجام شده</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">{pendingPayments}</div>
            <div className="text-gray-600">در انتظار پرداخت</div>
          </div>
        </div>

        {/* قیمت خرید امتیاز */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">قیمت خرید امتیاز از فروشنده</h2>
            <div className="text-sm text-gray-500 mb-1">بانک رسالت</div>
            <div className="text-4xl font-bold text-green-600 mb-1">{(135000).toLocaleString("fa-IR")}</div>
            <div className="text-lg text-gray-600">تومان</div>
            <div className="text-xs text-gray-500 mt-2">قیمت هر امتیاز برای خرید از فروشندگان</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* فرم اضافه کردن فروشنده */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">اضافه کردن فروشنده جدید</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="نام"
                  value={newSeller.name}
                  onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="نام خانوادگی"
                  value={newSeller.lastName}
                  onChange={(e) => setNewSeller({ ...newSeller, lastName: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                value={newSeller.accountNumber}
                onChange={(e) => setNewSeller({ ...newSeller, accountNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="شماره کارت"
                value={newSeller.cardNumber}
                onChange={(e) => setNewSeller({ ...newSeller, cardNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="مقدار امتیاز برای فروش"
                value={newSeller.creditAmount || ""}
                onChange={(e) => setNewSeller({ ...newSeller, creditAmount: Number.parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {newSeller.creditAmount > 0 && (
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200 mb-4">
                  <div className="text-sm text-gray-600">ارزش کل امتیاز</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(newSeller.creditAmount * CREDIT_PRICE).toLocaleString("fa-IR")} تومان
                  </div>
                  <div className="text-xs text-gray-500">
                    {newSeller.creditAmount} امتیاز × {CREDIT_PRICE.toLocaleString("fa-IR")} تومان
                  </div>
                </div>
              )}
              <button
                onClick={addSeller}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                اضافه کردن فروشنده
              </button>
            </div>
          </div>

          {/* لیست خریداران */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">لیست خریداران</h2>
              <button
                onClick={() => setIsAddBuyerModalOpen(true)}
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
        </div>

        {/* بخش تطبیق فروشنده و خریدار */}
        {sellers.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">تطبیق فروشنده و خریدار</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">انتخاب فروشنده</h3>
                <div className="space-y-2">
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

                {/* پیام برای فروشنده */}
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
                              لطفاً تعداد {transferAmount} امتیاز وام را به نام {buyer.name} با کد ملی {buyer.nationalId}{" "}
                              و شماره تماس {buyer.phone} منتقل نمایید.
                              <br />
                              <br />
                              مبلغ {(transferAmount * CREDIT_PRICE).toLocaleString("fa-IR")} تومان ({transferAmount}{" "}
                              امتیاز × {CREDIT_PRICE.toLocaleString("fa-IR")} تومان) پس از انجام انتقال و بررسی نهایی،
                              به حساب شما واریز خواهد شد.
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

                            {/* دکمه‌های کپی و اشتراک برای هر پیام */}
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
                                    navigator.share({
                                      title: `پیام انتقال امتیاز وام - ${buyer.name}`,
                                      text: text,
                                    })
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

                <button
                  onClick={createTransaction}
                  className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  ایجاد معامله
                </button>
              </div>
            )}
          </div>
        )}

        {/* لیست معاملات */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">تاریخچه معاملات</h2>

          {/* Search and Sort Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
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
                  <th className="text-right py-2">تاریخ</th>
                  <th className="text-right py-2">فروشنده</th>
                  <th className="text-right py-2">کد ملی فروشنده</th>
                  <th className="text-right py-2">موبایل فروشنده</th>
                  <th className="text-right py-2">خریدار</th>
                  <th className="text-right py-2">کد ملی خریدار</th>
                  <th className="text-right py-2">موبایل خریدار</th>
                  <th className="text-right py-2">معرف</th>
                  <th className="text-right py-2">مقدار</th>
                  <th className="text-right py-2">کد پیگیری</th>
                  <th className="text-right py-2">وضعیت</th>
                  <th className="text-right py-2">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{transaction.date}</td>
                    <td className="py-2">{transaction.sellerName}</td>
                    <td className="py-2">{transaction.sellerNationalId}</td>
                    <td className="py-2">{transaction.sellerPhone}</td>
                    <td className="py-2">{transaction.buyerNames.join(", ")}</td>
                    <td className="py-2">{transaction.buyerNationalIds.join(", ")}</td>
                    <td className="py-2">{transaction.buyerPhones.join(", ")}</td>
                    <td className="py-2">{transaction.buyerReferrers.filter(Boolean).join(", ") || "-"}</td>
                    <td className="py-2">{transaction.amount} امتیاز</td>
                    <td className="py-2 font-mono text-xs">{transaction.trackingCode}</td>
                    <td className="py-2">
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
                    <td className="py-2">
                      <button
                        onClick={() => openModal(transaction)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs"
                      >
                        مشاهده پیام
                      </button>
                      <button
                        onClick={() => openPrintModal(transaction)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-xs mr-2"
                      >
                        چاپ سند
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStatusTransaction(transaction)
                          setIsStatusModalOpen(true)
                          setStatusDescription("")
                          setUploadedImage(null)
                        }}
                        className="bg-orange-600 text-white px-3 py-1 rounded-md hover:bg-orange-700 transition-colors text-xs mr-2"
                        disabled={transaction.status === "completed" || transaction.status === "cancelled"}
                      >
                        تغییر وضعیت
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

        {/* Payment Modal */}
        {isPaymentModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsPaymentModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">پرداخت‌های در انتظار</h3>
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {getPaymentGroups().map((group, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{group.sellerName}</h4>
                        <p className="text-sm text-gray-600">{group.sellerPhone}</p>
                        <p className="text-sm text-gray-600">کارت: {group.sellerCardNumber}</p>
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-bold text-green-600">
                          {group.totalAmount.toLocaleString("fa-IR")} تومان
                        </div>
                        <div className="text-sm text-gray-600">{group.transactions.length} معامله</div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">جزئیات معاملات:</h5>
                      <div className="space-y-2">
                        {group.transactions.map((transaction, tIndex) => (
                          <div key={tIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-mono text-xs">{transaction.trackingCode}</span>
                              <span className="mx-2">-</span>
                              <span>{transaction.buyerNames[0]}</span>
                              <span className="mx-2">-</span>
                              <span>{transaction.amount} امتیاز</span>
                            </div>
                            <div className="font-medium">
                              {(transaction.amount * CREDIT_PRICE).toLocaleString("fa-IR")} تومان
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Referrer Payments */}
                    {group.referrerPayments.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">پرداخت‌های معرف:</h5>
                        <div className="space-y-2">
                          {group.referrerPayments.map((referrerPayment, rIndex) => (
                            <div key={rIndex} className="p-3 bg-blue-50 rounded border border-blue-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{referrerPayment.referrerName}</span>
                                <span className="font-bold text-blue-600">
                                  {referrerPayment.totalAmount.toLocaleString("fa-IR")} تومان
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {referrerPayment.transactions.length} معامله ×{" "}
                                {REFERRER_COMMISSION.toLocaleString("fa-IR")} تومان
                              </div>
                              <div className="mt-2">
                                <button
                                  onClick={() => {
                                    const message = generatePaymentMessage(group, true, referrerPayment.referrerName)
                                    navigator.clipboard.writeText(message).then(() => {
                                      alert(`پیام پرداخت معرف ${referrerPayment.referrerName} کپی شد!`)
                                    })
                                  }}
                                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs mr-2"
                                >
                                  📋 کپی پیام معرف
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          const message = generatePaymentMessage(group)
                          navigator.clipboard.writeText(message).then(() => {
                            alert(`پیام پرداخت ${group.sellerName} کپی شد!`)
                          })
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        📋 کپی پیام پرداخت
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPaymentGroup(group)
                          setPaymentDescription("")
                          setPaymentImage(null)
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        ✅ تسویه شده
                      </button>
                    </div>
                  </div>
                ))}

                {getPaymentGroups().length === 0 && (
                  <div className="text-center py-8 text-gray-500">هیچ پرداخت در انتظاری وجود ندارد</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Completion Modal */}
        {selectedPaymentGroup && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60"
            onClick={() => setSelectedPaymentGroup(null)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">تأیید تسویه</h3>
                <button
                  onClick={() => setSelectedPaymentGroup(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm">
                  <div>
                    <span className="font-medium">فروشنده:</span> {selectedPaymentGroup.sellerName}
                  </div>
                  <div>
                    <span className="font-medium">مبلغ کل:</span>{" "}
                    {selectedPaymentGroup.totalAmount.toLocaleString("fa-IR")} تومان
                  </div>
                  <div>
                    <span className="font-medium">تعداد معاملات:</span> {selectedPaymentGroup.transactions.length}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات پرداخت</label>
                <textarea
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  placeholder="توضیحات مربوط به پرداخت را وارد کنید..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">بارگذاری رسید پرداخت</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        setPaymentImage(e.target?.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {paymentImage && (
                  <div className="mt-2">
                    <img
                      src={paymentImage || "/placeholder.svg"}
                      alt="رسید پرداخت"
                      className="max-w-xs max-h-48 object-contain border rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handlePaymentComplete(selectedPaymentGroup)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  تأیید تسویه
                </button>
                <button
                  onClick={() => setSelectedPaymentGroup(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Transaction Message */}
        {isModalOpen && selectedTransaction && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">پیام معامله</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-xl">
                  ×
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">کد پیگیری:</span> {selectedTransaction.trackingCode}
                  </div>
                  <div>
                    <span className="font-medium">تاریخ:</span> {selectedTransaction.date}
                  </div>
                  <div>
                    <span className="font-medium">مقدار:</span> {selectedTransaction.amount} امتیاز
                  </div>
                  <div>
                    <span className="font-medium">وضعیت:</span>
                    <span
                      className={`mr-2 px-2 py-1 rounded-full text-xs ${
                        selectedTransaction.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : selectedTransaction.status === "transferred"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedTransaction.status === "paid"
                        ? "پرداخت شده"
                        : selectedTransaction.status === "transferred"
                          ? "انتقال یافته"
                          : "در انتظار"}
                    </span>
                  </div>
                </div>
              </div>

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
                  onClick={() => {
                    const messageElement = document.getElementById("modal-message-content")
                    if (messageElement && navigator.share) {
                      const text = messageElement.innerText
                      navigator.share({
                        title: `پیام انتقال امتیاز وام - ${selectedTransaction.trackingCode}`,
                        text: text,
                      })
                    } else {
                      alert("قابلیت اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود")
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  📤 اشتراک‌گذاری
                </button>

                <button
                  onClick={closeModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Print Modal */}
        {isPrintModalOpen && selectedPrintTransaction && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closePrintModal}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">پیش‌نمایش سند تحویل</h3>
                <button onClick={closePrintModal} className="text-gray-500 hover:text-gray-700 text-xl">
                  ×
                </button>
              </div>

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

              {/* Print Content */}
              <div id="print-content" className="bg-white" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
                {/* نسخه فروشنده */}
                <div
                  className="document border-2 border-gray-300 p-6 mb-4"
                  style={{ height: "400px", pageBreakAfter: "always" }}
                >
                  <div className="header text-center mb-4 border-b-2 border-gray-800 pb-3">
                    <h2 className="text-xl font-bold">سند تحویل امتیاز وام</h2>
                    <p className="text-sm text-gray-600 mt-1">نسخه فروشنده</p>
                  </div>

                  <div className="content">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <strong>کد پیگیری:</strong> {selectedPrintTransaction.trackingCode}
                      </div>
                      <div>
                        <strong>تاریخ:</strong> {selectedPrintTransaction.date}
                      </div>
                      <div>
                        <strong>نام فروشنده:</strong> {selectedPrintTransaction.sellerName}
                      </div>
                      <div>
                        <strong>موبایل فروشنده:</strong> {selectedPrintTransaction.sellerPhone}
                      </div>
                      <div>
                        <strong>نام خریدار:</strong> {selectedPrintTransaction.buyerNames.join(", ")}
                      </div>
                      <div>
                        <strong>موبایل خریدار:</strong> {selectedPrintTransaction.buyerPhones.join(", ")}
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-100 rounded">
                      <strong>مقدار امتیاز منتقل شده:</strong> {selectedPrintTransaction.amount} امتیاز
                    </div>

                    <div className="mb-4">
                      <p className="text-sm leading-relaxed">
                        بدینوسیله تأیید می‌شود که مقدار {selectedPrintTransaction.amount} امتیاز وام از طرف آقای/خانم{" "}
                        {selectedPrintTransaction.sellerName}
                        به نام {selectedPrintTransaction.buyerNames.join(" و ")} منتقل گردیده است.
                      </p>
                      <p className="text-sm leading-relaxed mt-2">
                        مبلغ {(selectedPrintTransaction.amount * CREDIT_PRICE).toLocaleString("fa-IR")} تومان (
                        {selectedPrintTransaction.amount} امتیاز × {CREDIT_PRICE.toLocaleString("fa-IR")} تومان) پس از
                        بررسی نهایی، به حساب فروشنده واریز خواهد شد.
                      </p>
                    </div>
                  </div>

                  <div className="footer">
                    <div className="signature-section flex justify-between mt-8">
                      <div className="signature-box border border-gray-800 p-4 text-center" style={{ width: "150px" }}>
                        <p className="text-xs mb-8">امضای فروشنده</p>
                        <div className="border-t border-gray-400 pt-1">
                          <p className="text-xs">{selectedPrintTransaction.sellerName}</p>
                        </div>
                      </div>
                      <div className="signature-box border border-gray-800 p-4 text-center" style={{ width: "150px" }}>
                        <p className="text-xs mb-8">مهر و امضای مغازه</p>
                        <div className="border-t border-gray-400 pt-1">
                          <p className="text-xs">مجموعه رسانت</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* نسخه مغازه */}
                <div className="document border-2 border-gray-300 p-6" style={{ height: "400px" }}>
                  <div className="header text-center mb-4 border-b-2 border-gray-800 pb-3">
                    <h2 className="text-xl font-bold">سند تحویل امتیاز وام</h2>
                    <p className="text-sm text-gray-600 mt-1">نسخه مغازه</p>
                  </div>

                  <div className="content">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <strong>کد پیگیری:</strong> {selectedPrintTransaction.trackingCode}
                      </div>
                      <div>
                        <strong>تاریخ:</strong> {selectedPrintTransaction.date}
                      </div>
                      <div>
                        <strong>نام فروشنده:</strong> {selectedPrintTransaction.sellerName}
                      </div>
                      <div>
                        <strong>موبایل فروشنده:</strong> {selectedPrintTransaction.sellerPhone}
                      </div>
                      <div>
                        <strong>نام خریدار:</strong> {selectedPrintTransaction.buyerNames.join(", ")}
                      </div>
                      <div>
                        <strong>موبایل خریدار:</strong> {selectedPrintTransaction.buyerPhones.join(", ")}
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-100 rounded">
                      <strong>مقدار امتیاز منتقل شده:</strong> {selectedPrintTransaction.amount} امتیاز
                    </div>

                    <div className="mb-4">
                      <p className="text-sm leading-relaxed">
                        بدینوسیله تأیید می‌شود که مقدار {selectedPrintTransaction.amount} امتیاز وام از طرف آقای/خانم{" "}
                        {selectedPrintTransaction.sellerName}
                        به نام {selectedPrintTransaction.buyerNames.join(" و ")} منتقل گردیده است.
                      </p>
                      <p className="text-sm leading-relaxed mt-2">
                        مبلغ مربوط به فروش امتیاز پس از بررسی نهایی، به حساب فروشنده واریز خواهد شد.
                      </p>
                    </div>
                  </div>

                  <div className="footer">
                    <div className="signature-section flex justify-between mt-8">
                      <div className="signature-box border border-gray-800 p-4 text-center" style={{ width: "150px" }}>
                        <p className="text-xs mb-8">امضای فروشنده</p>
                        <div className="border-t border-gray-400 pt-1">
                          <p className="text-xs">{selectedPrintTransaction.sellerName}</p>
                        </div>
                      </div>
                      <div className="signature-box border border-gray-800 p-4 text-center" style={{ width: "150px" }}>
                        <p className="text-xs mb-8">مهر و امضای مغازه</p>
                        <div className="border-t border-gray-400 pt-1">
                          <p className="text-xs">مجموعه رسانت</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={closePrintModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Change Modal */}
        {isStatusModalOpen && selectedStatusTransaction && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsStatusModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">تغییر وضعیت معامله</h3>
                <button
                  onClick={() => setIsStatusModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">کد پیگیری:</span> {selectedStatusTransaction.trackingCode}
                  </div>
                  <div>
                    <span className="font-medium">وضعیت فعلی:</span>
                    <span className="mr-2 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {selectedStatusTransaction.status === "completed"
                        ? "تسویه شده"
                        : selectedStatusTransaction.status === "pending_payment"
                          ? "در انتظار پرداخت وجه"
                          : selectedStatusTransaction.status === "transferred"
                            ? "وام منتقل شد"
                            : selectedStatusTransaction.status === "cancelled"
                              ? "لغو"
                              : "در انتظار انتقال وام"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-3">تاریخچه معامله</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedStatusTransaction.history.map((historyItem, index) => (
                    <div key={index} className="flex items-start space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{historyItem.status}</span>
                          <span className="text-xs text-gray-500">
                            {historyItem.date} - {historyItem.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{historyItem.description}</p>
                        {historyItem.image && (
                          <img
                            src={historyItem.image || "/placeholder.svg"}
                            alt="رسید"
                            className="mt-2 max-w-xs max-h-24 object-contain border rounded"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                <textarea
                  value={statusDescription}
                  onChange={(e) => setStatusDescription(e.target.value)}
                  placeholder="توضیحات مربوط به تغییر وضعیت را وارد کنید..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              {selectedStatusTransaction.status === "pending_payment" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">بارگذاری رسید پرداخت</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          setUploadedImage(e.target?.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {uploadedImage && (
                    <div className="mt-2">
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="رسید پرداخت"
                        className="max-w-xs max-h-48 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                {selectedStatusTransaction.status === "pending_transfer" && (
                  <>
                    <button
                      onClick={() => {
                        const currentTime = new Date()
                        setTransactions(
                          transactions.map((t) =>
                            t.id === selectedStatusTransaction.id
                              ? {
                                  ...t,
                                  status: "transferred" as const,
                                  history: [
                                    ...t.history,
                                    {
                                      status: "وام منتقل شد",
                                      description: statusDescription || "انتقال وام توسط فروشنده تأیید شد",
                                      date: currentTime.toLocaleDateString("fa-IR"),
                                      time: currentTime.toLocaleTimeString("fa-IR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }),
                                    },
                                  ],
                                }
                              : t,
                          ),
                        )
                        setIsStatusModalOpen(false)
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      وام منتقل شد
                    </button>
                    <button
                      onClick={() => {
                        const currentTime = new Date()
                        setTransactions(
                          transactions.map((t) =>
                            t.id === selectedStatusTransaction.id
                              ? {
                                  ...t,
                                  status: "cancelled" as const,
                                  history: [
                                    ...t.history,
                                    {
                                      status: "لغو",
                                      description: statusDescription || "معامله لغو شد",
                                      date: currentTime.toLocaleDateString("fa-IR"),
                                      time: currentTime.toLocaleTimeString("fa-IR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }),
                                    },
                                  ],
                                }
                              : t,
                          ),
                        )
                        setIsStatusModalOpen(false)
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      لغو
                    </button>
                  </>
                )}

                {selectedStatusTransaction.status === "transferred" && (
                  <button
                    onClick={() => {
                      const currentTime = new Date()
                      setTransactions(
                        transactions.map((t) =>
                          t.id === selectedStatusTransaction.id
                            ? {
                                ...t,
                                status: "pending_payment" as const,
                                history: [
                                  ...t.history,
                                  {
                                    status: "در انتظار پرداخت وجه",
                                    description: statusDescription || "در انتظار واریز وجه به حساب فروشنده",
                                    date: currentTime.toLocaleDateString("fa-IR"),
                                    time: currentTime.toLocaleTimeString("fa-IR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }),
                                  },
                                ],
                              }
                            : t,
                        ),
                      )
                      setIsStatusModalOpen(false)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    در انتظار پرداخت وجه
                  </button>
                )}

                {selectedStatusTransaction.status === "pending_payment" && (
                  <>
                    <button
                      onClick={() => {
                        const currentTime = new Date()
                        setTransactions(
                          transactions.map((t) =>
                            t.id === selectedStatusTransaction.id
                              ? {
                                  ...t,
                                  status: "completed" as const,
                                  history: [
                                    ...t.history,
                                    {
                                      status: "تسویه شده",
                                      description: statusDescription || "وجه به حساب فروشنده واریز شد",
                                      date: currentTime.toLocaleDateString("fa-IR"),
                                      time: currentTime.toLocaleTimeString("fa-IR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }),
                                      image: uploadedImage || undefined,
                                    },
                                  ],
                                }
                              : t,
                          ),
                        )
                        setIsStatusModalOpen(false)
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      وجه پرداخت شد
                    </button>
                    <button
                      onClick={() => {
                        const currentTime = new Date()
                        setTransactions(
                          transactions.map((t) =>
                            t.id === selectedStatusTransaction.id
                              ? {
                                  ...t,
                                  status: "cancelled" as const,
                                  history: [
                                    ...t.history,
                                    {
                                      status: "لغو",
                                      description: statusDescription || "معامله لغو شد",
                                      date: currentTime.toLocaleDateString("fa-IR"),
                                      time: currentTime.toLocaleTimeString("fa-IR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }),
                                    },
                                  ],
                                }
                              : t,
                          ),
                        )
                        setIsStatusModalOpen(false)
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      لغو
                    </button>
                  </>
                )}

                <button
                  onClick={() => setIsStatusModalOpen(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
  @media print {
    body * {
      visibility: hidden;
    }
    #print-content, #print-content * {
      visibility: visible;
    }
    #print-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .document {
      page-break-after: always;
      height: 50vh;
      border: 2px solid #000 !important;
    }
  }
`}</style>
    </div>
  )
}
