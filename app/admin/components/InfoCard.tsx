import React from "react"

interface InfoCardProps {
  title: string
  value: string | number
  color: string
}

/**
 * A card component to display a single piece of information.
 */
const InfoCard: React.FC<InfoCardProps> = ({ title, value, color }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-gray-600">{title}</div>
    </div>
  )
}

export default InfoCard
