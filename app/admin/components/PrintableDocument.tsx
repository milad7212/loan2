import React from "react";

interface Transaction {
  id: string;
  sellerName: string;
  sellerNationalId: string;
  sellerPhone: string;
  buyerNames: string[];
  buyerNationalIds: string[];
  buyerPhones:string[];
  amount: number;
  date: string;
  tracking_code: string;
}

interface PrintableDocumentProps {
  transaction: Transaction;
  copyType: "فروشنده" | "خریدار";
}

const PrintableDocument: React.FC<PrintableDocumentProps> = ({
  transaction,
  copyType,
}) => {
  return (
    <div className="a5-page">
      <div className="header">
        <div className="logo">مجموعه رسانت</div>
        <div className="tracking-code">
          <span>کد پیگیری:</span>
          <span>{transaction.tracking_code}</span>
        </div>
      </div>
      <h1 className="title">سند تحویل امتیاز وام</h1>
      <div className="date">
        <span>تاریخ:</span>
        <span>{transaction.date}</span>
      </div>
      <div className="content">
        <p>
          اینجانب، <strong>{transaction.sellerName}</strong> به کد ملی{" "}
          <strong>{transaction.sellerNationalId}</strong> و شماره تماس{" "}
          <strong>{transaction.sellerPhone}</strong>، اقرار می‌نمایم که تعداد{" "}
          <strong>{transaction.amount}</strong> امتیاز وام رسالت را به نام آقا/خانم{" "}
          <strong>{transaction.buyerNames.join(", ")}</strong> به کد ملی{" "}
          <strong>{transaction.buyerNationalIds.join(", ")}</strong> منتقل کرده‌ام.
        </p>
        <p>
          مبلغ کل این معامله با مجموعه رسانت تسویه شده است و اینجانب هیچ‌گونه
          ادعای مالی در آینده نخواهم داشت.
        </p>
        <p>
          این سند به عنوان رسید قطعی تحویل امتیاز و تسویه حساب کامل تلقی
          می‌گردد.
        </p>
      </div>
      <div className="signature-section">
        <div className="signature-box">
          <p>امضاء فروشنده</p>
        </div>
        <div className="signature-box">
          <p>امضاء مجموعه رسانت</p>
        </div>
      </div>
      <div className="footer">
        <p>نسخه {copyType}</p>
      </div>
    </div>
  );
};

export default PrintableDocument;
