import React from "react";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  tracking_code: string;
  seller: {
    full_name: string;
    phone: string;
    national_id: string;
  };
  buyers: {
    buyer: {
      name: string;
      national_id: string;
    };
  }[];
}

interface PrintableDocumentProps {
  transaction: Transaction;
  copyType: "فروشنده" | "خریدار";
}

const PrintableDocument: React.FC<PrintableDocumentProps> = ({
  transaction,
  copyType,
}) => {
  const buyerNames = transaction.buyers.map(b => b.buyer.name).join(", ");
  const buyerNationalIds = transaction.buyers.map(b => b.buyer.national_id).join(", ");

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
          اینجانب، <strong>{transaction.seller.full_name}</strong> به کد ملی{" "}
          <strong>{transaction.seller.national_id}</strong> و شماره تماس{" "}
          <strong>{transaction.seller.phone}</strong>، اقرار می‌نمایم که تعداد{" "}
          <strong>{transaction.amount}</strong> امتیاز وام رسالت را به نام آقا/خانم{" "}
          <strong>{buyerNames}</strong> به کد ملی{" "}
          <strong>{buyerNationalIds}</strong> منتقل کرده‌ام.
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
