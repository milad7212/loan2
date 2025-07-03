"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function LoanActionCard({
  title,
  description,
  icon,
  buttonText,
  href,
  color,
}) {
  const getColorClasses = () => {
    switch (color) {
      case "green":
        return {
          bg: "bg-green-50",
          border: "border-green-100",
          button: "bg-green-600 hover:bg-green-700",
          text: "text-green-700",
        };
      case "blue":
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-100",
          button: "bg-blue-600 hover:bg-blue-700",
          text: "text-blue-700",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-xl ${colors.bg} ${colors.border} border overflow-hidden`}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 relative">
            <Image
              src={icon || "/placeholder.svg?height=48&width=48"}
              alt={title}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h3 className={`text-xl font-bold ${colors.text} mr-3`}>{title}</h3>
        </div>

        <p className="text-gray-600 mb-6">{description}</p>

        <Link href={href}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-lg text-white font-medium transition-colors duration-200 ${colors.button}`}
          >
            {buttonText}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
