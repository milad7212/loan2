import React from "react";
import { type LucideIcon } from "lucide-react";

interface InfoCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  onEdit?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  icon: Icon,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-6 space-x-reverse">
      <div className="flex-shrink-0">
        <div className="bg-blue-100 rounded-full p-3">
          <Icon className="h-7 w-7 text-blue-600" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-baseline space-x-2 space-x-reverse">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path
                  fillRule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
