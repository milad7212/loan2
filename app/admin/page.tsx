"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import moment from "jalali-moment";
import { supabase } from "../../lib/supabaseClient";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  Users,
  CircleDollarSign,
  Landmark,
  BadgePercent,
  Wallet,
  UserPlus,
  Briefcase,
} from "lucide-react";
import InfoCard from "./components/InfoCard";
import InfoCardSkeleton from "./components/InfoCardSkeleton";
import SellerForm from "./components/SellerForm";
import BuyerList from "./components/BuyerList";
import TransactionMatching from "./components/TransactionMatching";
import TransactionHistory from "./components/TransactionHistory";
import TransactionHistorySkeleton from "./components/TransactionHistorySkeleton";
import Modal from "./components/Modal";
import PrintableDocument from "./components/PrintableDocument";

// Interfaces (keep them in the main page or move to a separate types file)
interface Buyer {
  id: string;
  name: string;
  phone: string;
  nationalId: string;
  referrer_id?: string;
  requestedAmount: number;
  remainingAmount: number;
  status: "pending" | "partial" | "completed";
  description?: string;
}

interface Seller {
  id: string;
  fullName: string;
  phone: string;
  accountNumber: string;
  cardNumber: string;
  creditAmount: number;
  remainingAmount: number;
  status: "active" | "completed";
  description?: string;
}

interface Transaction {
  id: string;
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
  trackingCode: string;
  message: string;
  history: Array<{
    status: string;
    description: string;
    date: string;
    time: string;
    image?: string;
  }>;
}

interface PaymentGroup {
  sellerPhone: string;
  sellerName: string;
  sellerCardNumber: string;
  transactions: Transaction[];
  totalAmount: number;
  referrerPayments: Array<{
    referrerName: string;
    totalAmount: number;
    transactions: Transaction[];
  }>;
}

interface Referrer {
  id: string;
  name: string;
}

// Constants
const REFERRER_COMMISSION = 5000;

export default function LoanCreditAdmin() {
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [creditPrice, setCreditPrice] = useState(135000);
  const [loading, setLoading] = useState(true);
  // State variables
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [
        buyersRes,
        sellersRes,
        transactionsRes,
        referrersRes,
      ] = await Promise.all([
        supabase.from("buyers").select("*"),
        supabase.from("sellers").select("*"),
        supabase.from("transactions").select("*, seller:sellers(fullName), buyers:transaction_buyers(buyer:buyers(name))"),
        supabase.from("referrers").select("id, name"),
      ]);

      if (buyersRes.error) console.error("Error fetching buyers:", buyersRes.error);
      else setBuyers(buyersRes.data);

      if (sellersRes.error) console.error("Error fetching sellers:", sellersRes.error);
      else setSellers(sellersRes.data);

      if (transactionsRes.error) console.error("Error fetching transactions:", transactionsRes.error);
      else setTransactions(transactionsRes.data);

      if (referrersRes.error) console.error("Error fetching referrers:", referrersRes.error);
      else setReferrers(referrersRes.data);

      setLoading(false);
    };

    fetchData();
  }, []);

  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const [selectedBuyers, setSelectedBuyers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buyerStatusFilter, setBuyerStatusFilter] = useState<string>("all");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPrintTransaction, setSelectedPrintTransaction] =
    useState<Transaction | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatusTransaction, setSelectedStatusTransaction] =
    useState<Transaction | null>(null);
  const [statusDescription, setStatusDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentGroup, setSelectedPaymentGroup] =
    useState<PaymentGroup | null>(null);
  const [paymentDescription, setPaymentDescription] = useState("");
  const [paymentImage, setPaymentImage] = useState<string | null>(null);
  const [isAddBuyerModalOpen, setIsAddBuyerModalOpen] = useState(false);
  const [isAddSellerModalOpen, setIsAddSellerModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [newPrice, setNewPrice] = useState(creditPrice);
  const [newBuyer, setNewBuyer] = useState({
    name: "",
    nationalId: "",
    phone: "",
    referrer: "",
    requestedAmount: 0,
    description: "",
  });

  // Functions

  /**
   * Generates a unique tracking code for a transaction based on the date.
   * @param date The date of the transaction in "YYYY/MM/DD" format.
   * @param transactions The list of existing transactions.
   * @returns A unique tracking code.
   */
  const generateTrackingCode = (
    jalaliDate: string,
    transactions: Transaction[]
  ) => {
    const m = moment(jalaliDate, "jYYYY/jMM/jDD");
    const year = m.jYear();
    const month = (m.jMonth() + 1).toString().padStart(2, "0");
    const day = m.jDate().toString().padStart(2, "0");

    const yearLastDigit = year.toString().slice(-1);

    const datePrefix = `${yearLastDigit}${month}${day}`;

    const sameDayTransactions = transactions.filter(
      (t) => t.date === jalaliDate
    ).length;
    const sequenceNumber = (sameDayTransactions + 1).toString().padStart(3, "0");

    return `${datePrefix}${sequenceNumber}`;
  };

  const generateMessage = (
    seller: Seller,
    buyer: Buyer,
    transferAmount: number,
    trackingCode: string
  ) => {
    return `${seller.fullName} عزیز،

لطفاً تعداد ${transferAmount} امتیاز وام را به نام ${
      buyer.name
    } با کد ملی ${buyer.nationalId} و شماره تماس ${buyer.phone} منتقل نمایید.

مبلغ ${(transferAmount * creditPrice).toLocaleString(
      "fa-IR"
    )} تومان (${transferAmount} امتیاز × ${creditPrice.toLocaleString(
      "fa-IR"
    )} تومان) پس از انجام انتقال و بررسی نهایی، به حساب شما واریز خواهد شد.

کد پیگیری: ${trackingCode}
(لطفاً این کد را جهت هرگونه پیگیری نزد خود نگه دارید.)

با تشکر از همکاری شما
مجموعه رسانت`;
  };

  /**
   * Adds a new seller to the list of sellers.
   * @param sellerData The data of the new seller.
   */
  const addSeller = async (
    sellerData: Omit<Seller, "id" | "remainingAmount" | "status">
  ) => {
    const { data, error } = await supabase
      .from("sellers")
      .insert([
        {
          ...sellerData,
          remainingAmount: sellerData.creditAmount,
          status: "active",
        },
      ])
      .select();

    if (error) {
      console.error("Error adding seller:", error);
    } else {
      if (data) {
        setSellers([...sellers, ...data]);
      }
      setIsAddSellerModalOpen(false);
    }
  };

  const [buyerError, setBuyerError] = useState("");

  /**
   * Adds a new buyer to the list of buyers.
   */
  const addBuyer = async () => {
    if (!newBuyer.name) {
      setBuyerError("نام خریدار الزامی است.");
      return;
    }
    if (!newBuyer.nationalId) {
      setBuyerError("کد ملی خریدار الزامی است.");
      return;
    }
    if (!newBuyer.phone) {
      setBuyerError("شماره تماس خریدار الزامی است.");
      return;
    }
    if (newBuyer.requestedAmount <= 0) {
      setBuyerError("مقدار امتیاز درخواستی باید بیشتر از صفر باشد.");
      return;
    }

    const { data, error } = await supabase
      .from("buyers")
      .insert([
        {
          name: newBuyer.name,
          nationalId: newBuyer.nationalId,
          phone: newBuyer.phone,
          referrer_id: newBuyer.referrer || null,
          requestedAmount: newBuyer.requestedAmount,
          remainingAmount: newBuyer.requestedAmount,
          status: "pending",
          description: newBuyer.description,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding buyer:", error);
      setBuyerError("خطا در افزودن خریدار");
    } else {
      if (data) {
        setBuyers([...buyers, ...data]);
      }
      setNewBuyer({
        name: "",
        nationalId: "",
        phone: "",
        referrer: "",
        requestedAmount: 0,
        description: "",
      });
      setBuyerError("");
      setIsAddBuyerModalOpen(false);
    }
  };

  const [transactionError, setTransactionError] = useState("");

  /**
   * Creates a new transaction between a seller and one or more buyers.
   */
  const createTransaction = async () => {
    if (!selectedSeller) {
      setTransactionError("لطفا یک فروشنده انتخاب کنید.");
      return;
    }
    if (selectedBuyers.length === 0) {
      setTransactionError("لطفا حداقل یک خریدار انتخاب کنید.");
      return;
    }

    const seller = sellers.find((s) => s.id === selectedSeller);
    if (!seller) return;

    const selectedBuyerObjects = buyers.filter((b) =>
      selectedBuyers.includes(b.id)
    );

    const amounts = selectedBuyerObjects.map((b) => b.remainingAmount);
    const currentDate = moment().locale("fa").format("YYYY/MM/DD");
    const trackingCode = generateTrackingCode(currentDate, transactions);
    const message = generateMessage(
      seller,
      selectedBuyerObjects[0],
      amounts[0],
      trackingCode
    );

    const { data, error } = await supabase.rpc("create_transaction", {
      p_seller_id: selectedSeller,
      p_buyer_ids: selectedBuyers,
      p_amounts: amounts,
      p_tracking_code: trackingCode,
      p_message: message,
    });

    if (error) {
      console.error("Error creating transaction:", error);
      setTransactionError("خطا در ایجاد معامله");
    } else {
      // Manually refetch data to update the UI.
      const [buyersRes, sellersRes, transactionsRes] = await Promise.all([
        supabase.from("buyers").select("*"),
        supabase.from("sellers").select("*"),
        supabase.from("transactions").select("*, seller:sellers(fullName), buyers:transaction_buyers(buyer:buyers(name))"),
      ]);

      if (buyersRes.data) setBuyers(buyersRes.data);
      if (sellersRes.data) setSellers(sellersRes.data);
      if (transactionsRes.data) setTransactions(transactionsRes.data);

      setSelectedSeller("");
      setSelectedBuyers([]);
      setTransactionError("");
      alert("تراکنش با موفقیت ایجاد شد.");
    }
  };

  /**
   * Groups pending payments by seller.
   * @returns An array of payment groups.
   */
  const getPaymentGroups = (): PaymentGroup[] => {
    const pendingTransactions = transactions.filter(
      (t) => t.status === "pending_payment"
    );
    const groupedBySeller = pendingTransactions.reduce((acc, transaction) => {
      const key = transaction.sellerPhone;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);

    return Object.entries(groupedBySeller).map(
      ([sellerPhone, transactions]) => {
        const seller = sellers.find((s) => s.phone === sellerPhone);
        const totalAmount = transactions.reduce(
          (sum, t) => sum + t.amount * creditPrice,
          0
        );

        const referrerGroups = transactions.reduce((acc, transaction) => {
          transaction.buyerReferrers.forEach((referrer, index) => {
            if (referrer) {
              if (!acc[referrer]) {
                acc[referrer] = [];
              }
              acc[referrer].push({
                ...transaction,
                amount: transaction.amount,
              });
            }
          });
          return acc;
        }, {} as Record<string, Transaction[]>);

        const referrerPayments = Object.entries(referrerGroups).map(
          ([referrerName, referrerTransactions]) => ({
            referrerName,
            totalAmount: referrerTransactions.reduce(
              (sum, t) => sum + t.amount * REFERRER_COMMISSION,
              0
            ),
            transactions: referrerTransactions,
          })
        );

        return {
          sellerPhone,
          sellerName: transactions[0].sellerName,
          sellerCardNumber: seller?.cardNumber || "",
          transactions,
          totalAmount,
          referrerPayments,
        };
      }
    );
  };

  /**
   * Marks a payment group as complete.
   * @param group The payment group to mark as complete.
   */
  const handlePaymentComplete = async (group: PaymentGroup) => {
    const currentTime = new Date();
    const transactionIds = group.transactions.map((t) => t.id);

    const newHistoryEntry = {
      status: "completed",
      description: paymentDescription || "وجه به حساب فروشنده واریز شد",
      date: currentTime.toLocaleDateString("fa-IR"),
      time: currentTime.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      image: paymentImage || undefined,
    };

    const { error } = await supabase
      .from("transactions")
      .update({
        status: "completed",
        history: supabase.sql`history || ${JSON.stringify(newHistoryEntry)}::jsonb`,
      })
      .in("id", transactionIds);

    if (error) {
      console.error("Error updating transactions:", error);
    } else {
      const updatedTransactions = transactions.map((t) =>
        transactionIds.includes(t.id)
          ? { ...t, status: "completed", history: [...t.history, newHistoryEntry] }
          : t
      );
      setTransactions(updatedTransactions);
      setIsPaymentModalOpen(false);
      setSelectedPaymentGroup(null);
      setPaymentDescription("");
      setPaymentImage(null);
    }
  };

  const handlePriceSave = () => {
    setCreditPrice(newPrice);
    setIsPriceModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && selectedPrintTransaction) {
      const content = document.getElementById("print-content")?.innerHTML;
      const styles = Array.from(document.styleSheets)
        .map((styleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join("");
          } catch (e) {
            console.log("Could not read stylesheet rules", e);
            return "";
          }
        })
        .join("\n");

      printWindow.document.write(`
        <html>
          <head>
            <title>سند تحویل - ${selectedPrintTransaction.trackingCode}</title>
            <style>${styles}</style>
          </head>
          <body dir="rtl">${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  const totalBuyers = buyers.length;
  const totalDemand = buyers.reduce(
    (sum, buyer) => sum + buyer.remainingAmount,
    0
  );
  const completedTransactions = transactions.length;
  const pendingPayments = transactions.filter(
    (t) => t.status === "pending_payment"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              مدیریت خرید و فروش امتیاز وام
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {moment().locale("fa").format("dddd، D MMMM YYYY")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/admin/referrers">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.82a4.994 4.994 0 00-4.5-2.18h-2a4.994 4.994 0 00-4.5 2.18c-.316.552-.5 1.167-.5 1.82v2M17 20h-2M7 20H2v-2a3 3 0 015.356-1.857M7 7a4 4 0 118 0 4 4 0 01-8 0z"
                        />
                      </svg>
                    </button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>مدیریت معرف‌ها</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddSellerModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Briefcase className="h-4 w-4" />
                افزودن فروشنده
              </button>
              <button
                onClick={() => setIsAddBuyerModalOpen(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <UserPlus className="h-4 w-4" />
                افزودن خریدار
              </button>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors font-medium"
              >
                پرداخت‌های در انتظار ({pendingPayments})
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {loading ? (
            [...Array(5)].map((_, i) => <InfoCardSkeleton key={i} />)
          ) : (
            <>
              <InfoCard
                title="تعداد خریداران"
                value={totalBuyers}
                icon={Users}
              />
              <InfoCard
                title="کل تقاضا (امتیاز)"
                value={totalDemand}
                icon={CircleDollarSign}
              />
              <InfoCard
                title="معاملات انجام شده"
                value={completedTransactions}
                icon={Landmark}
              />
              <InfoCard
                title="در انتظار پرداخت"
                value={pendingPayments}
                icon={Wallet}
              />
              <InfoCard
                title="قیمت روز"
                value={`${creditPrice.toLocaleString("fa-IR")} تومان`}
                icon={BadgePercent}
                onEdit={() => {
                  setNewPrice(creditPrice);
                  setIsPriceModalOpen(true);
                }}
              />
            </>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <BuyerList
              buyers={buyers}
              openAddBuyerModal={() => setIsAddBuyerModalOpen(true)}
              statusFilter={buyerStatusFilter}
              setStatusFilter={setBuyerStatusFilter}
            />
          </div>
          <div className="lg:col-span-2 space-y-8">
            {loading ? (
              <TransactionHistorySkeleton />
            ) : (
              <>
                {sellers.length > 0 && (
                  <TransactionMatching
                    sellers={sellers}
                    buyers={buyers}
                    selectedSeller={selectedSeller}
                    setSelectedSeller={setSelectedSeller}
                    selectedBuyers={selectedBuyers}
                    setSelectedBuyers={setSelectedBuyers}
                    createTransaction={createTransaction}
                    createTransactionError={transactionError}
                    generateMessage={generateMessage}
                    generateTrackingCode={generateTrackingCode}
                    transactions={transactions}
                  />
                )}
                <TransactionHistory
                  transactions={transactions}
                  openModal={(t) => {
                    setSelectedTransaction(t);
                    setIsModalOpen(true);
                  }}
                  openPrintModal={(t) => {
                    setSelectedPrintTransaction(t);
                    setIsPrintModalOpen(true);
                  }}
                  openStatusModal={(t) => {
                    setSelectedStatusTransaction(t);
                    setIsStatusModalOpen(true);
                  }}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={buyerStatusFilter}
                  setStatusFilter={setBuyerStatusFilter}
                  sortField={sortField}
                  setSortField={setSortField}
                  sortDirection={sortDirection}
                  setSortDirection={setSortDirection}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isAddBuyerModalOpen}
        onClose={() => setIsAddBuyerModalOpen(false)}
        title="افزودن خریدار جدید"
      >
        {buyerError && (
          <p className="text-red-500 text-sm mb-4">{buyerError}</p>
        )}
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
            onChange={(e) =>
              setNewBuyer({ ...newBuyer, nationalId: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="شماره تماس"
            value={newBuyer.phone}
            onChange={(e) =>
              setNewBuyer({ ...newBuyer, phone: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newBuyer.referrer}
            onChange={(e) =>
              setNewBuyer({ ...newBuyer, referrer: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">انتخاب معرف (اختیاری)</option>
            {referrers.map((referrer) => (
              <option key={referrer.id} value={referrer.id}>
                {referrer.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="مقدار امتیاز درخواستی"
            value={newBuyer.requestedAmount || ""}
            onChange={(e) =>
              setNewBuyer({
                ...newBuyer,
                requestedAmount: Number.parseInt(e.target.value) || 0,
              })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="توضیحات (اختیاری)"
            value={newBuyer.description}
            onChange={(e) =>
              setNewBuyer({ ...newBuyer, description: e.target.value })
            }
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
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="پیام معامله"
        >
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
                const messageElement = document.getElementById(
                  "modal-message-content"
                );
                if (messageElement) {
                  const text = messageElement.innerText;
                  navigator.clipboard.writeText(text).then(() => {
                    alert("پیام کپی شد!");
                  });
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
        <Modal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          title="پیش‌نمایش سند تحویل"
        >
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
          <div id="print-content" className="a4-page">
            <div className="a4-container">
              <PrintableDocument
                transaction={selectedPrintTransaction}
                copyType="فروشنده"
              />
              <PrintableDocument
                transaction={selectedPrintTransaction}
                copyType="خریدار"
              />
            </div>
          </div>
        </Modal>
      )}

      {isStatusModalOpen && selectedStatusTransaction && (
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title="تغییر وضعیت معامله"
        >
          <div className="space-y-4">
            {selectedStatusTransaction.history && (
              <div className="border border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                <h4 className="font-semibold mb-2">تاریخچه وضعیت</h4>
                <ul className="space-y-2 text-sm">
                  {selectedStatusTransaction.history.map((h, index) => (
                    <li key={index} className="border-b pb-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{h.status}</span>
                        <span className="text-gray-500">
                          {h.date} - {h.time}
                        </span>
                      </div>
                      <p className="text-gray-600">{h.description}</p>
                      {h.image && (
                        <a
                          href={h.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          مشاهده تصویر
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <select
              value={selectedStatusTransaction.status}
              onChange={(e) =>
                setSelectedStatusTransaction({
                  ...selectedStatusTransaction,
                  status: e.target.value as Transaction["status"],
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending_transfer">در انتظار انتقال وام</option>
              <option value="transferred">وام منتقل شد</option>
              <option value="pending_payment">در انتظار پرداخت وجه</option>
              <option value="completed">تسویه شده</option>
              <option value="cancelled">لغو</option>
            </select>
            <textarea
              placeholder="توضیحات (اختیاری)"
              value={statusDescription}
              onChange={(e) => setStatusDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setUploadedImage(event.target?.result as string);
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 justify-end mt-6">
            <button
              onClick={async () => {
                if (
                  selectedStatusTransaction.status === "cancelled" &&
                  selectedStatusTransaction
                ) {
                  // Revert buyer's remaining amount
                  const updatedBuyers = buyers.map((buyer) => {
                    if (
                      selectedStatusTransaction.buyer_ids.includes(buyer.id)
                    ) {
                      const newRemainingAmount =
                        buyer.remainingAmount +
                        selectedStatusTransaction.amount;
                      return {
                        ...buyer,
                        remainingAmount: newRemainingAmount,
                        status:
                          newRemainingAmount >= buyer.requestedAmount
                            ? "pending"
                            : "partial",
                      };
                    }
                    return buyer;
                  });
                  setBuyers(updatedBuyers);

                  // Revert seller's remaining amount
                  const updatedSellers = sellers.map((seller) => {
                    if (
                      seller.id === selectedStatusTransaction.seller_id
                    ) {
                      return {
                        ...seller,
                        remainingAmount:
                          seller.remainingAmount +
                          selectedStatusTransaction.amount,
                        status: "active",
                      };
                    }
                    return seller;
                  });
                  setSellers(updatedSellers);
                }

                const newHistoryEntry = {
                  status: selectedStatusTransaction.status,
                  description: statusDescription,
                  date: new Date().toLocaleDateString("fa-IR"),
                  time: new Date().toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  image: uploadedImage || undefined,
                };

                const { error } = await supabase
                  .from("transactions")
                  .update({
                    status: selectedStatusTransaction.status,
                    history: supabase.sql`history || ${JSON.stringify(newHistoryEntry)}::jsonb`,
                  })
                  .eq("id", selectedStatusTransaction.id);

                if (error) {
                  console.error("Error updating transaction status:", error);
                } else {
                  const updatedTransactions = transactions.map((t) =>
                    t.id === selectedStatusTransaction.id
                      ? {
                          ...t,
                          status: selectedStatusTransaction.status,
                          history: [...t.history, newHistoryEntry],
                        }
                      : t
                  );
                  setTransactions(updatedTransactions);
                  setIsStatusModalOpen(false);
                  setStatusDescription("");
                  setUploadedImage(null);
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              ذخیره تغییرات
            </button>
            <button
              onClick={() => setIsStatusModalOpen(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              انصراف
            </button>
          </div>
        </Modal>
      )}

      {isPaymentModalOpen && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title="پرداخت‌های در انتظار"
        >
          <div className="space-y-6">
            {getPaymentGroups().length > 0 ? (
              getPaymentGroups().map((group, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-semibold text-lg">
                        {group.sellerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {group.sellerPhone}
                      </p>
                      <p className="text-sm text-gray-500">
                        {group.sellerCardNumber}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-lg text-green-600">
                        {group.totalAmount.toLocaleString("fa-IR")} تومان
                      </p>
                      <p className="text-sm text-gray-500">مجموع</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">جزئیات پرداخت:</h4>
                    <ul className="space-y-2 text-sm">
                      {group.transactions.map((t) => (
                        <li key={t.id} className="flex justify-between">
                          <span>
                            {t.buyerNames.join(", ")} ({t.amount} امتیاز)
                          </span>
                          <span>
                            {(t.amount * creditPrice).toLocaleString("fa-IR")}{" "}
                            تومان
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {group.referrerPayments.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-2">پورسانت معرف:</h4>
                      <ul className="space-y-2 text-sm">
                        {group.referrerPayments.map((p, i) => (
                          <li key={i} className="flex justify-between">
                            <span>{p.referrerName}</span>
                            <span className="text-blue-600">
                              {p.totalAmount.toLocaleString("fa-IR")} تومان
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-4 flex flex-col gap-2">
                    <textarea
                      placeholder="توضیحات (اختیاری)"
                      onChange={(e) => setPaymentDescription(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    ></textarea>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setPaymentImage(event.target?.result as string);
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2 justify-end mt-4">
                    <button
                      onClick={() => handlePaymentComplete(group)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      پرداخت شد
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                در حال حاضر پرداخت در انتظاری وجود ندارد.
              </p>
            )}
          </div>
        </Modal>
      )}

      {/* Price Edit Modal */}
      <Modal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        title="تغییر قیمت روز"
      >
        <div className="space-y-4">
          <input
            type="number"
            placeholder="قیمت جدید"
            value={newPrice || ""}
            onChange={(e) => setNewPrice(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={handlePriceSave}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            ذخیره
          </button>
          <button
            onClick={() => setIsPriceModalOpen(false)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            انصراف
          </button>
        </div>
      </Modal>

      {/* Add Seller Modal */}
      <Modal
        isOpen={isAddSellerModalOpen}
        onClose={() => setIsAddSellerModalOpen(false)}
        title="افزودن فروشنده جدید"
      >
        <SellerForm addSeller={addSeller} creditPrice={creditPrice} />
      </Modal>
    </div>
  );
}
