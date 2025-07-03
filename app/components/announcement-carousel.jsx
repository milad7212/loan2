"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, AlertCircle, Bell } from "lucide-react";

export default function AnnouncementCarousel({ announcements }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + announcements.length) % announcements.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-200 text-red-700";
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      default:
        return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "medium":
        return <Bell className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="relative h-64 md:h-56">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.5 }}
              className="absolute inset-0 p-6"
            >
              <div
                className={`h-full rounded-lg p-6 border ${getPriorityColor(
                  announcements[currentIndex].priority
                )}`}
              >
                <div className="flex items-start">
                  <div className="mr-4 flex-shrink-0">
                    {getPriorityIcon(announcements[currentIndex].priority)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">
                        {announcements[currentIndex].title}
                      </h3>
                      <span className="text-sm opacity-70">
                        {announcements[currentIndex].date}
                      </span>
                    </div>
                    <p className="text-base">
                      {announcements[currentIndex].content}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center mt-4">
        <button
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-2 hover:bg-gray-50 transition-colors duration-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center">
          {announcements.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 mx-1 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-blue-600 w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center ml-2 hover:bg-gray-50 transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
