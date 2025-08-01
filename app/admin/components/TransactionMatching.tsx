import React from "react";

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

interface Buyer {
  id: string;
  name: string;
  phone: string;
  nationalId: string;
  referrer?: string;
  requestedAmount: number;
  remainingAmount: number;
  status: "pending" | "partial" | "completed";
}

interface TransactionMatchingProps {
  sellers: Seller[];
  buyers: Buyer[];
  selectedSeller: string;
  setSelectedSeller: (id: string) => void;
  selectedBuyers: string[];
  setSelectedBuyers: (ids: string[]) => void;
  createTransaction: () => void;
  createTransactionError: string;
}

const TransactionMatching: React.FC<TransactionMatchingProps> = ({
  sellers,
  buyers,
  selectedSeller,
  setSelectedSeller,
  selectedBuyers,
  setSelectedBuyers,
  createTransaction,
  createTransactionError,
}) => {
  const selectedSellerInfo = sellers.find((s) => s.id === selectedSeller);
  const selectedBuyersInfo = buyers.filter((b) => selectedBuyers.includes(b.id));

  const totalSelectedDemand = selectedBuyersInfo.reduce(
    (sum, b) => sum + b.remainingAmount,
    0
  );
  const availableCredit = selectedSellerInfo?.remainingAmount || 0;
  const transferableAmount = Math.min(availableCredit, totalSelectedDemand);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">ایجاد معامله جدید</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-medium mb-3 text-lg">۱. انتخاب فروشنده</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto p-2">
            {sellers
              .filter((s) => s.status === "active")
              .map((seller) => (
                <div
                  key={seller.id}
                  onClick={() => setSelectedSeller(seller.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedSeller === seller.id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-blue-400"
                  }`}
                >
                  <div className="font-semibold text-gray-800">{seller.fullName}</div>
                  <div className="text-sm text-gray-500">{seller.phone}</div>
                  <div className="text-sm text-green-600 mt-2 font-medium">
                    موجودی: {seller.remainingAmount.toLocaleString()} امتیاز
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3 text-lg">۲. انتخاب خریداران</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto p-2">
            {buyers
              .filter((b) => b.remainingAmount > 0)
              .map((buyer) => (
                <div
                  key={buyer.id}
                  onClick={() => {
                    if (selectedBuyers.includes(buyer.id)) {
                      setSelectedBuyers(
                        selectedBuyers.filter((id) => id !== buyer.id)
                      );
                    } else {
                      setSelectedBuyers([...selectedBuyers, buyer.id]);
                    }
                  }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedBuyers.includes(buyer.id)
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-blue-400"
                  }`}
                >
                  <div className="font-semibold text-gray-800">{buyer.name}</div>
                  <div className="text-sm text-gray-500">{buyer.phone}</div>
                  <div className="text-sm text-red-600 mt-2 font-medium">
                    نیاز: {buyer.remainingAmount.toLocaleString()} امتیاز
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {selectedSeller && selectedBuyers.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600">
              مقدار قابل انتقال:{" "}
              <span className="font-bold text-lg text-blue-600">
                {transferableAmount.toLocaleString()}
              </span>{" "}
              امتیاز
            </p>
            <p className="text-xs text-gray-500 mt-1">
              (از موجودی {availableCredit.toLocaleString()} فروشنده و نیاز{" "}
              {totalSelectedDemand.toLocaleString()} خریداران)
            </p>
          </div>

          {createTransactionError && (
            <p className="text-red-500 text-sm mt-4 text-center">
              {createTransactionError}
            </p>
          )}
          <button
            onClick={createTransaction}
            className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
          >
            ایجاد و ارسال پیامک معامله
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionMatching;
