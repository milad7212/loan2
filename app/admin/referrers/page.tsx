"use client";

import { useState, useEffect } from "react";
import moment from "jalali-moment";
import { supabase } from "../../../lib/supabaseClient";

interface Referrer {
  id: string;
  name: string;
  phone?: string;
  national_id?: string;
}

export default function ReferrersPage() {
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [newReferrer, setNewReferrer] = useState({
    name: "",
    phone: "",
    national_id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferrers();
  }, []);

  const fetchReferrers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("referrers").select("*");
    if (error) {
      console.error("Error fetching referrers:", error);
      setError("خطا در دریافت لیست معرف‌ها");
    } else {
      setReferrers(data);
    }
    setLoading(false);
  };

  const handleAddReferrer = async () => {
    if (!newReferrer.name) {
      setError("نام معرف الزامی است.");
      return;
    }

    const { data, error } = await supabase
      .from("referrers")
      .insert([
        {
          name: newReferrer.name,
          phone: newReferrer.phone || null,
          national_id: newReferrer.national_id || null,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding referrer:", error);
      setError("خطا در افزودن معرف");
    } else {
      if (data) {
        setReferrers([...referrers, ...data]);
      }
      setNewReferrer({ name: "", phone: "", national_id: "" });
      setError("");
    }
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
                  value={newReferrer.national_id}
                  onChange={(e) =>
                    setNewReferrer({ ...newReferrer, national_id: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddReferrer}
                  disabled={!newReferrer.name || loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? "در حال افزودن..." : "افزودن معرف"}
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
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8">
                        در حال بارگذاری...
                      </td>
                    </tr>
                  ) : (
                    referrers.map((referrer) => (
                      <tr key={referrer.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {referrer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {referrer.phone || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {referrer.national_id || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
