"use client";

// import React, { useEffect, useRef, useState } from "react";
// import Winwheel from "winwheel";
// import { ILuckyDraw } from "@/app/interfaces/ILuckyDraw";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import api from "@/app/services/axiosService";

// interface WinwheelInstance extends Winwheel {
//   getRandomForSegment: (segmentNumber: number) => number;
// }

// interface LuckyWheelProps {
//   luckyDraw: ILuckyDraw;
//   onCloseModal: () => void;
// }

// const LuckyWheel: React.FC<LuckyWheelProps> = ({ luckyDraw, onCloseModal }) => {
//   const [isSpinning, setIsSpinning] = useState(false);
//   const [hasSpun, setHasSpun] = useState(false);
//   const wheelRef = useRef<WinwheelInstance | null>(null);
//   const { toast } = useToast();

//   useEffect(() => {
//     if (!luckyDraw || !luckyDraw.prizes) return;

//     const wheel = new Winwheel({
//       numSegments: luckyDraw.prizes.length,
//       outerRadius: 170,
//       centerX: 200,
//       centerY: 200,
//       textFontSize: 16,
//       textOrientation: "vertical",
//       textAlignment: "outer",
//       textMargin: 5,
//       textFontFamily: "Arial",
//       strokeStyle: "#000000",
//       lineWidth: 2,
//       segments: luckyDraw.prizes.map((prize, index) => ({
//         fillStyle: prize.color || getRandomColor(),
//         text: prize.name,
//         textFillStyle: "#ffffff",
//       })),
//       animation: {
//         type: "spinToStop",
//         duration: 5,
//         spins: 8,
//         callbackFinished: () => {
//           setIsSpinning(false);
//           setHasSpun(true);
//         },
//       },
//     }) as WinwheelInstance;

//     wheelRef.current = wheel;
//     wheel.draw();
//     console.log("Vẽ vòng quay thành công:", wheel);

//     return () => {
//       if (wheelRef.current) {
//         wheelRef.current = null;
//       }
//     };
//   }, [luckyDraw]);

//   const getRandomColor = () => {
//     const colors = [
//       "#FF6B6B",
//       "#4ECDC4",
//       "#45B7D1",
//       "#96CEB4",
//       "#FFEEAD",
//       "#D4A5A5",
//       "#9B59B6",
//       "#3498DB",
//     ];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   const handleSpin = async () => {
//     if (isSpinning || !wheelRef.current) {
//       console.log("Không thể quay: Đang quay hoặc wheel chưa sẵn sàng.");
//       return;
//     }

//     try {
//       setIsSpinning(true);
//       const response = await api.post(`/lucky-draws/${luckyDraw.id}/spin`);
//       const { prize_index } = response.data;

//       const randomIndex = Math.floor(Math.random() * luckyDraw.prizes.length);
//       const stopAt = wheelRef.current.getRandomForSegment(randomIndex + 1);

//       wheelRef.current.animation.stopAngle = stopAt;
//       wheelRef.current.startAnimation();

//       toast({
//         title: "Chúc mừng!",
//         description: `Bạn đã nhận được ${luckyDraw.prizes[prize_index].name}`,
//       });
//     } catch (error) {
//       console.error("Lỗi khi quay:", error);
//       toast({
//         title: "Lỗi",
//         description: "Có lỗi xảy ra khi quay. Vui lòng thử lại sau.",
//         variant: "destructive",
//       });
//       setIsSpinning(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div id="wheel" className="mb-4" />
//       <div className="flex gap-2">
//         <Button
//           onClick={handleSpin}
//           disabled={isSpinning || hasSpun}
//           className="bg-blue-500 hover:bg-blue-600"
//         >
//           {isSpinning ? "Đang quay..." : hasSpun ? "Đã quay" : "Quay ngay"}
//         </Button>
//         <Button
//           onClick={onCloseModal}
//           variant="outline"
//           className="border-gray-300 hover:bg-gray-100"
//         >
//           Đóng
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default LuckyWheel;