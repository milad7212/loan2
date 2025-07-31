import React from "react";
import Skeleton from "./Skeleton";

const TransactionHistorySkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md mt-8">
      <div className="p-6">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4">
                <Skeleton className="h-4 w-1/2" />
              </th>
              <th className="py-3 px-4">
                <Skeleton className="h-4 w-1/2" />
              </th>
              <th className="py-3 px-4">
                <Skeleton className="h-4 w-1/2" />
              </th>
              <th className="py-3 px-4">
                <Skeleton className="h-4 w-1/2" />
              </th>
              <th className="py-3 px-4">
                <Skeleton className="h-4 w-1/2" />
              </th>
              <th className="py-3 px-4">
                <Skeleton className="h-4 w-1/2" />
              </th>
              <th className="py-3 px-4">
                <Skeleton className="h-4 w-1/2" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="py-4 px-4">
                  <Skeleton className="h-4 w-3/4" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-4 w-3/4" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-4 w-3/4" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-4 w-3/4" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-4 w-3/4" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-4 w-2/3" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistorySkeleton;
