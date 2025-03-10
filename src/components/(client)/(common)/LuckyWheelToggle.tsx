"use client";

import React, { useRef, useState, useEffect } from "react";
import LuckyWheel from "./LuckySpin";

const LuckyWheelToggle: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Define colors for the mini wheel (using the same colors from your LuckyWheel)
  const colors = [
    "#16a085", // Teal
    "#2980b9", // Blue
    "#34495e", // Dark blue
    "#f39c12", // Orange
    "#d35400", // Dark orange
    "#c0392b" // Red
  ];

  // Function to animate the wheel
  const animateWheel = () => {
    setRotation((prev) => (prev + 5) % 360);
    animationRef.current = requestAnimationFrame(animateWheel);
  };

  // Start and stop animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animateWheel);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Toggle the modal
  const handleToggleModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Fixed position mini lucky wheel button */}
      <div
        className="fixed right-6 top-2/3 -translate-y-2/3 z-50 cursor-pointer group"
        onClick={handleToggleModal}
      >
        {/* The mini wheel */}
        <div className="relative w-20 h-20">
          {/* Wheel container with border */}
          <div className="w-20 h-20 rounded-full border-2 border-white shadow-lg overflow-hidden relative">
            {/* Rotating wheel */}
            <div
              ref={wheelRef}
              className="w-full h-full rounded-full relative overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: "transform 0.1s linear"
              }}
            >
              {/* Wheel segments */}
              {colors.map((color, index) => {
                // const angle = (360 / colors.length) * index;
                return (
                  <div
                    key={index}
                    className="absolute w-full h-full"
                    style={{
                      background: `conic-gradient(
                          ${colors
                            .map(
                              (color, index) =>
                                `${color} ${(index / colors.length) * 100}% ${
                                  ((index + 1) / colors.length) * 100
                                }%`
                            )
                            .join(", ")}
                        )`,
                      transform: `rotate(${rotation}deg)`,
                      transition: "transform 0.1s linear"
                    }}
                  ></div>
                );
              })}
            </div>

            {/* Center button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex justify-center items-center z-10">
              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold">
                QUAY
              </div>
            </div>

            {/* Pointer */}
            <div className="absolute w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[10px] border-b-white top-[-5px] left-[13px] z-20"></div>
          </div>

          {/* Glowing effect on hover */}
          <div className="absolute inset-0 rounded-full bg-yellow-300 opacity-0 group-hover:opacity-40 filter blur-md -z-10 transition-opacity duration-300"></div>
        </div>

        {/* Label that appears on hover */}
        <div className="absolute right-full ml-2 top-1/2 -translate-y-1/2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
          Vòng Quay May Mắn
        </div>
      </div>

      {/* Modal container */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-600 hover:text-red-800 transition-all duration-300 hover:rotate-90"
              >
                ✕
              </button>
            </div>

            {/* Your existing LuckyWheel component */}
            <LuckyWheel />
          </div>
        </div>
      )}
    </>
  );
};

export default LuckyWheelToggle;
