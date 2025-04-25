"use client";

import React, { useRef, useEffect, useState } from "react";
import { ILuckyDraw } from "@/app/interfaces/ILuckyDraw";
import { FaHeart, FaGift, FaMoneyBillWave } from "react-icons/fa";
import { IoDiamondSharp } from "react-icons/io5";
import { RiEmotionSadLine } from "react-icons/ri";
import { IconType } from "react-icons/lib";
import Winwheel from "winwheel";
import gsap from "gsap";

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).TweenMax = gsap;
}

interface Prize {
  color: string;
  text: string;
  message: string;
  icon?: IconType;
}

interface LuckySpinProps {
  luckyDraw: ILuckyDraw;
  onCloseModal?: () => void;
}

interface WinwheelInstance extends Winwheel {
  animation: {
    stopAngle: number;
  };
  startAnimation: () => void;
  getRandomForSegment: (segment: number) => number;
}

const prizes: Prize[] = [
  {
    color: "#c0392b",
    text: "Giải Đặc Biệt",
    message: "CHÚC MỪNG BẠN TRÚNG ĐƯỢC GIẢI ĐẶC BIỆT",
    icon: FaGift,
  },
  {
    color: "#16a085",
    text: "100.000 VNĐ",
    message: "CHÚC MỪNG BẠN TRÚNG ĐƯỢC 100.000 VNĐ",
    icon: FaMoneyBillWave,
  },
  {
    color: "#f39c12",
    text: "Thử Lại",
    message: "CHÚC BẠN MAY MẮN LẦN SAU",
    icon: RiEmotionSadLine,
  },
  {
    color: "#2980b9",
    text: "50.000 VNĐ",
    message: "CHÚC MỪNG BẠN TRÚNG ĐƯỢC 50.000 VNĐ",
    icon: FaMoneyBillWave,
  },
  {
    color: "#d35400",
    text: "Chúc May Mắn",
    message: "CHÚC BẠN MAY MẮN LẦN SAU",
    icon: FaHeart,
  },
  {
    color: "#34495e",
    text: "200.000 VNĐ",
    message: "CHÚC MỪNG BẠN TRÚNG ĐƯỢC 200.000 VNĐ",
    icon: FaMoneyBillWave,
  },
  {
    color: "#8e44ad",
    text: "Phiếu Quà Tặng",
    message: "CHÚC MỪNG BẠN TRÚNG ĐƯỢC PHIẾU QUÀ TẶNG",
    icon: IoDiamondSharp,
  },
];
const LuckySpin: React.FC<LuckySpinProps> = ({ onCloseModal }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);
  const wheelRef = useRef<WinwheelInstance | null>(null);
  const [showPrizeList, setShowPrizeList] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) {
      console.log("Canvas không sẵn sàng.");
      return;
    }

    try {
      const wheel = new Winwheel({
        canvasId: canvasRef.current.id,
        numSegments: prizes.length,
        outerRadius: 140,
        textFontSize: 14,
        textAlignment: "outer",
        textOrientation: "curved",
        textMargin: 10,
        segments: prizes.map((prize) => ({
          fillStyle: prize.color,
          text: prize.text,
          textFillStyle: "#ffffff",
          textFontFamily: "Arial",
        })),
        animation: {
          type: "spinToStop",
          duration: 5,
          spins: 8,
          animation: "spinToStop",
          callbackFinished: (indicatedSegment: { text: string }) => {
            const selectedPrize = prizes.find((p) => p.text === indicatedSegment.text);
            setPrize(selectedPrize || null);
            setShowCongrats(true);
            setIsSpinning(false);
          },
        },
        pointerAngle: 0,
        drawMode: "code",
        wash: "none",
      }) as WinwheelInstance;

      wheelRef.current = wheel;
      wheel.draw();
      console.log("Vẽ vòng quay thành công:", wheel);
    } catch (error) {
      console.error("Lỗi khi khởi tạo Winwheel:", error);
    }
  }, []);

  const handleSpin = () => {
    if (isSpinning || !wheelRef.current) {
      console.log("Không thể quay: Đang quay hoặc wheel chưa sẵn sàng.");
      return;
    }

    setIsSpinning(true);
    setPrize(null);
    setShowCongrats(false);

    const randomIndex = Math.floor(Math.random() * prizes.length);
    const stopAt = wheelRef.current.getRandomForSegment(randomIndex + 1);

    wheelRef.current.animation.stopAngle = stopAt;
    wheelRef.current.startAnimation();
  };

  const handleClose = () => {
    setShowCongrats(false);
    setPrize(null);
    if (onCloseModal) {
      onCloseModal();
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Nút toggle danh sách giải thưởng trên mobile */}
      <button
        className="md:hidden mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setShowPrizeList(!showPrizeList)}
      >
        {showPrizeList ? "Ẩn giải thưởng" : "Hiện giải thưởng"}
      </button>

      {/* Danh sách giải thưởng */}
      <div
        className={`w-full md:w-auto mb-8 md:mb-0 md:mr-12 ${
          showPrizeList ? "block" : "hidden md:block"
        }`}
      >
        <div className="mb-4 text-center md:text-left text-base md:text-lg font-semibold">
          Giải thưởng:
        </div>
        <div className="grid grid-cols-3 gap-2">
          {prizes.map((prize, index) => (
            <div key={index} className="flex items-center mb-2">
              <div
                className="w-6 h-6 md:w-10 md:h-10 mr-3 md:mr-5"
                style={{ backgroundColor: prize.color }}
              ></div>
              <div className="text-sm md:text-base">{prize.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vòng quay */}
      <div className="relative">
        <div className="w-[312px] h-[312px] rounded-full border-[6px] border-white shadow-md flex items-center justify-center">
          <canvas
            ref={canvasRef}
            id="luckySpinCanvas"
            width="300"
            height="300"
            className="absolute"
          />
          <div className="absolute top-[121px] left-[115px] w-[70px] h-[70px] bg-white rounded-full flex justify-center items-center z-10">
            <button
              className={`w-[60px] h-[60px] rounded-full bg-gray-200 hover:text-green-500 text-lg font-semibold ${
                isSpinning ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSpin}
              disabled={isSpinning}
            >
              QUAY
            </button>
          </div>
          <div className="absolute w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-red-600 top-[-10px] left-[141px] z-20" />
        </div>
      </div>

      {/* Modal kết quả */}
      {showCongrats && prize && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h3 className="text-xl font-bold text-yellow-500 mb-4">Chúc mừng!</h3>
            <div
              className="w-10 h-10 mx-auto mb-4"
              style={{ backgroundColor: prize.color }}
            ></div>
            {prize.icon && <prize.icon className="text-3xl mx-auto mb-4" />}
            <p className="text-lg font-semibold mb-2">{prize.text}</p>
            <p>{prize.message}</p>
            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckySpin;