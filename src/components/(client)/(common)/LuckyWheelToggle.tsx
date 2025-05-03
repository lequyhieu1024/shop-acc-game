"use client";

// import React, { useState, useRef, useEffect } from 'react';
// import { useLuckyDraws } from '@/hooks/useLuckyDraws';
// import { LuckyDraw } from '@/types/luckyDraw';
// import { Button } from '@/components/ui/button';
// import LuckyWheel from "@/components/(client)/(common)/LuckySpin";

// const LuckyWheelToggle: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedLuckyDraw, setSelectedLuckyDraw] = useState<LuckyDraw | null>(null);
//   const wheelRef = useRef<HTMLDivElement>(null);
//   const animationRef = useRef<number | null>(null);
//   const { data: luckyDraws, isLoading } = useLuckyDraws();

//   useEffect(() => {
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, []);

//   const animateWheel = () => {
//     if (wheelRef.current) {
//       wheelRef.current.style.transform = `rotate(${Date.now() / 20}deg)`;
//       animationRef.current = requestAnimationFrame(animateWheel);
//     }
//   };

//   useEffect(() => {
//     if (isModalOpen) {
//       animationRef.current = requestAnimationFrame(animateWheel);
//     } else if (animationRef.current) {
//       cancelAnimationFrame(animationRef.current);
//     }
//   }, [isModalOpen]);

//   const handleOpenModal = (luckyDraw: LuckyDraw) => {
//     setSelectedLuckyDraw(luckyDraw);
//     setIsModalOpen(true);
//   };

//   if (isLoading) return null;

//   return (
//     <>
//       <div
//         ref={wheelRef}
//         className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
//         onClick={() => luckyDraws && luckyDraws.length > 0 && handleOpenModal(luckyDraws[0])}
//       >
//         <svg
//           className="w-8 h-8 text-white"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//           />
//         </svg>
//       </div>

//       {isModalOpen && selectedLuckyDraw && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <h2 className="text-2xl font-bold mb-4">Vòng quay may mắn</h2>
//             <LuckyWheel luckyDraw={selectedLuckyDraw} onCloseModal={() => setIsModalOpen(false)}/>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default LuckyWheelToggle;