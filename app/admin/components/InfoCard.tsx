import React from "react";

interface InfoCardProps {
  title: string;
  value: string | number;
  color: string;
  onEdit?: () => void;
}

/**
 * A card component to display a single piece of information.
 */
const InfoCard: React.FC<InfoCardProps> = ({ title, value, color, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="flex justify-between items-center mt-2">
        <div className="text-gray-600">{title}</div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
  );
};

export default InfoCard;
