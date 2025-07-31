"use client";

import { useState } from "react";
import moment from "jalali-moment";
import { useReferrers } from "../context/ReferrersContext";

interface Referrer {
  id: string;
  name: string;
  phone?: string;
  nationalId?: string;
}

export default function ReferrersPage() {
  const { referrers, addReferrer } = useReferrers();
  const [newReferrer, setNewReferrer] = useState({
    name: "",
    phone: "",
    nationalId: "",
  });
  const [error, setError] = useState("");

  const handleAddReferrer = () => {
    if (!newReferrer.name) {
      setError("نام معرف الزامی است.");
      return;
    }

    addReferrer({
      name: newReferrer.name,
      phone: newReferrer.phone || undefined,
      nationalId: newReferrer.nationalId || undefined,
    });

    setNewReferrer({ name: "", phone: "", nationalId: "" });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مدیریت معرف‌ها</h1>
            <p className="text-sm text-gray-500 mt-1">
              {moment().locale("fa").format("dddd، D MMMM YYYY")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Referrer Form */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">افزودن معرف جدید</h2>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  value={newReferrer.name}
                  onChange={(e) =>
                    setNewReferrer({ ...newReferrer, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="شماره موبایل (اختیاری)"
                  value={newReferrer.phone}
                  onChange={(e) =>
                    setNewReferrer({ ...newReferrer, phone: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="کد ملی (اختیاری)"
                  value={newReferrer.nationalId}
                  onChange={(e) =>
                    setNewReferrer({ ...newReferrer, nationalId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddReferrer}
                  disabled={!newReferrer.name}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  افزودن معرف
                </button>
              </div>
            </div>
          </div>

          {/* Referrers List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      نام معرف
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      شماره موبایل
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      کد ملی
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referrers.map((referrer) => (
                    <tr key={referrer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {referrer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {referrer.phone || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {referrer.nationalId || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
