"use client";
import React, { useState, useRef } from "react";
import {
  FaHeart,
  FaGift,
  FaMoneyBillWave,
  FaHatCowboySide
} from "react-icons/fa";
import { IoDiamondSharp } from "react-icons/io5";
import { GiAbdominalArmor } from "react-icons/gi";
import { RiEmotionSadLine } from "react-icons/ri";
import { IconType } from "react-icons/lib";

interface Prize {
  color: string;
  text: string;
  message: string;
  icon?: IconType;
}
interface LuckyWheelProps {
  onCloseModal?: () => void; // Nhận prop để đóng modal từ cha
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({ onCloseModal }) => {
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [prize, setPrize] = useState<string>("");
  const [showCongrats, setShowCongrats] = useState<boolean>(false);

  const wheelRef = useRef<HTMLDivElement>(null);

  // Array of prizes
  const prizes: Prize[] = [
    {
      color: "#16a085",
      text: "1 CĂN NHÀ LẦU 4 TẦNG",
      message: "CHÚC MỪNG BẠN TRÚNG ĐƯỢC MỘT CĂN NHÀ LẦU 4 TẦNG",
      icon: FaHeart
    },
    {
      color: "#2980b9",
      text: "1 CHUYẾN DU LỊCH MIỀN TÂY",
      message: "CHÚC MỪNG BẠN TRÚNG ĐƯỢC MỘT CHUYẾN DU LỊCH MIỀN TÂY",
      icon: IoDiamondSharp
    },
    {
      color: "#34495e",
      text: "1 THẺ CÀO 100K",
      message: "CHÚC MỪNG BẠN TRÚNG ĐƯỢC MỘT THẺ CÀO 100K",
      icon: GiAbdominalArmor
    },
    {
      color: "#f39c12",
      text: "1 THẺ CÀO 200K",
      message: "CHÚC MỪNG BẠN TRÚNG ĐƯỢC MỘT THẺ CÀO 200K",
      icon: FaMoneyBillWave
    },
    {
      color: "#d35400",
      text: "CHÚC BẠN MAY MẮN LẦN SAU",
      message: "CHÚC BẠN MAY MẮN LẦN SAU",
      icon: RiEmotionSadLine
    },
    {
      color: "#c0392b",
      text: "1 PHẦN QUÀ BÍ ẨN",
      message: "CHÚC MỪNG BẠN TRÚNG ĐƯỢC 1 PHẦN QUÀ BÍ ẨN",
      icon: FaGift
    },
    {
      color: "#8e44ad",
      text: "GIẢI ĐẶC BIỆT",
      message: "CHÚC MỪNG BẠN ĐÃ TRÚNG GIẢI ĐẶC BIỆT!",
      icon: FaHatCowboySide
    }
  ];

  const getPrize = (position: number): string => {
    const normalizedPosition = position % 360;
    const prizeAngle = 360 / prizes.length;

    for (let i = 0; i < prizes.length; i++) {
      const minAngle = prizeAngle * i;
      const maxAngle = prizeAngle * (i + 1);
      if (normalizedPosition >= minAngle && normalizedPosition < maxAngle) {
        return prizes[i].message;
      }
    }
    return prizes[0].message; // Default fallback
  };

  const handleSpin = (): void => {
    if (isSpinning) return;

    setIsSpinning(true);

    const randomDegrees = Math.floor(Math.random() * 360);
    const spinCount = Math.floor(Math.random() * 3) + 2; // 2-5 full rotations
    const totalRotation = spinCount * 360 + randomDegrees;

    setRotation(rotation + totalRotation);

    setTimeout(() => {
      setPrize(getPrize(rotation + totalRotation));
      setShowCongrats(true);
      setIsSpinning(false);
    }, 5000);
  };

  const handleClose = () => {
    setShowCongrats(false);
    setPrize("");
    if (onCloseModal) {
      onCloseModal();
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const CustomModal = ({
    title,
    isOpen,
    onClose,
    children
  }: {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-yellow-500">{title}</h3>
            <button
              onClick={onClose}
              className="text-red-600 hover:text-red-800 transition-all duration-300 hover:rotate-90"
            >
              ✕
            </button>
          </div>
          <div className="mb-6">{children}</div>
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center font-['Open_Sans']">
      <div className="flex flex-col md:flex-row items-center">
        <div className="mr-0 md:mr-12 mb-8 md:mb-0">
          <div className="mb-6 text-center md:text-left text-lg font-semibold">
            Giải thưởng:
          </div>
          {prizes.map((prize, index) => (
            <div key={index} className="flex items-center mb-5">
              <div
                className="w-12 h-12 mr-5"
                style={{ backgroundColor: prize.color }}
              ></div>
              <div>{prize.text}</div>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="w-[312px] h-[312px] rounded-full border-[6px] border-white shadow-md">
            <div
              ref={wheelRef}
              className="w-[300px] h-[300px] rounded-full relative overflow-hidden transition-all duration-[5000ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
              style={{ transform: `rotate(${rotation}deg) ` }}
            >
              {prizes.map((prize, index) => {
                const angle = (360 / prizes.length) * index;
                const IconComponent = prize.icon;

                return (
                  <div
                    key={index}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                      background: `conic-gradient(${prizes
                        .map((prize, index) => {
                          const startAngle = (360 / prizes.length) * index;
                          const endAngle = (360 / prizes.length) * (index + 1);
                          return `${prize.color} ${startAngle}deg ${endAngle}deg`;
                        })
                        .join(", ")})`,
                      transform: `rotate(${angle}deg)`
                    }}
                  >
                    {IconComponent && (
                      <div
                        className="absolute flex items-center justify-center"
                        style={{
                          top: "35%",
                          left: "50%",
                          transform:
                            "translate(-50%, -50%) rotate(-" + angle + "deg)"
                        }}
                      >
                        <IconComponent className="text-white w-12 h-12 opacity-80" />
                      </div>
                    )}
                    <div
                      className="absolute left-1/2 top-[60%] transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-semibold text-center"
                      style={{
                        transform: `rotate(-${angle}deg)`,
                        writingMode: "vertical-rl",
                        textOrientation: "mixed"
                      }}
                    >
                      {prize.text}
                    </div>
                  </div>
                );
              })}
            </div>
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
          </div>
        </div>
      </div>
      {showCongrats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-yellow-500">Chúc mừng!</h3>
            <p className="mt-4">{prize}</p>
            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyWheel;
