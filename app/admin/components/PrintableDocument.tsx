import React from "react"

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

interface PrintableDocumentProps {
  transaction: Transaction
}

const DocumentBody: React.FC<{ transaction: Transaction; copyType: string }> = ({ transaction, copyType }) => {
  const CREDIT_PRICE = 135000
  const totalAmount = transaction.amount * CREDIT_PRICE

  return (
    <div className="document-page">
      <div className="header text-center mb-4 pb-2 border-b-2 border-gray-800">
        <h1 className="text-2xl font-bold">رسید انتقال امتیاز وام</h1>
        <p className="text-sm text-gray-600">تاریخ صدور: {new Date().toLocaleDateString("fa-IR")}</p>
        <p className="text-lg font-semibold mt-2">{copyType}</p>
      </div>

      <div className="content my-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">اطلاعات فروشنده</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>
              <strong>نام و نام خانوادگی:</strong> {transaction.sellerName}
            </p>
            <p>
              <strong>شماره تماس:</strong> {transaction.sellerPhone}
            </p>
            <p>
              <strong>کد ملی:</strong> {transaction.sellerNationalId}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">اطلاعات خریدار</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>
              <strong>نام و نام خانوادگی:</strong> {transaction.buyerNames.join(", ")}
            </p>
            <p>
              <strong>شماره تماس:</strong> {transaction.buyerPhones.join(", ")}
            </p>
            <p>
              <strong>کد ملی:</strong> {transaction.buyerNationalIds.join(", ")}
            </p>
            {transaction.buyerReferrers.filter(Boolean).length > 0 && (
              <p>
                <strong>معرف:</strong> {transaction.buyerReferrers.filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold border-b pb-1 mb-2">اطلاعات معامله</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>
              <strong>کد پیگیری:</strong> <span className="font-mono">{transaction.trackingCode}</span>
            </p>
            <p>
              <strong>تاریخ معامله:</strong> {transaction.date}
            </p>
            <p>
              <strong>مقدار امتیاز منتقل شده:</strong> {transaction.amount} امتیاز
            </p>
            <p>
              <strong>مبلغ کل معامله:</strong> {totalAmount.toLocaleString("fa-IR")} تومان
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
          <h3 className="font-semibold mb-2">تعهدنامه</h3>
          <p>
            اینجانب <strong>{transaction.sellerName}</strong> (فروشنده)، با امضای این سند، تایید می‌نمایم که تعداد{" "}
            <strong>{transaction.amount}</strong> امتیاز وام را به{" "}
            <strong>{transaction.buyerNames.join(", ")}</strong> (خریدار) منتقل نموده‌ام.
          </p>
          <p className="mt-2">
            همچنین، اینجانب <strong>{transaction.buyerNames.join(", ")}</strong> (خریدار)، با امضای این سند، تایید
            می‌نمایم که امتیاز مذکور را از فروشنده تحویل گرفته‌ام.
          </p>
        </div>
      </div>

      <div className="footer mt-6 border-t pt-4 text-xs text-gray-600">
        <div className="flex justify-between items-center">
          <div>
            <p>این سند به منزله رسید قطعی انتقال امتیاز وام است.</p>
            <p>مجموعه رسانت</p>
          </div>
          <div className="signature-section flex justify-between mt-8 text-center">
            <div className="signature-box border border-gray-400 p-4 w-48 mx-2">
              <p className="font-semibold">امضای فروشنده</p>
              <br />
              <br />
            </div>
            <div className="signature-box border border-gray-400 p-4 w-48 mx-2">
              <p className="font-semibold">امضای خریدار</p>
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PrintableDocument: React.FC<PrintableDocumentProps> = ({ transaction }) => {
  return (
    <div className="document p-4" dir="rtl">
      <DocumentBody transaction={transaction} copyType="نسخه فروشگاه" />
      <div className="page-break"></div>
      <DocumentBody transaction={transaction} copyType="نسخه مشتری" />
    </div>
  )
}

export default PrintableDocument
