import React from "react";
import Skeleton from "./Skeleton";

const InfoCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-6 space-x-reverse">
      <div className="flex-shrink-0">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    </div>
  );
};

export default InfoCardSkeleton;
