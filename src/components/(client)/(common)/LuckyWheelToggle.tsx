"use client";

import React, {useRef, useState, useEffect} from "react";
import api from "@/app/services/axiosService";
import {ILuckyDraw} from "@/app/interfaces/ILuckyDraw";
import LuckyWheel from "@/components/(client)/(common)/LuckySpin";

const LuckyWheelToggle: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [rotation, setRotation] = useState<number>(0);
    const wheelRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const [luckyDraws, setLuckyDraws] = useState<ILuckyDraw[]>([]);
    const [selectedLuckyDraw, setSelectedLuckyDraw] = useState<ILuckyDraw | null>(null);

    const colors = [
        "#16a085",
        "#2980b9",
        "#34495e",
        "#f39c12",
        "#d35400",
        "#c0392b",
    ];

    const animateWheel = () => {
        setRotation((prev) => (prev + 5) % 360);
        animationRef.current = requestAnimationFrame(animateWheel);
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(animateWheel);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchLuckyDraws = async () => {
            try {
                const response = await api.get('/lucky-draws');

                const draws = response.data.luckyDraws || [];

                const activeLuckyDraws = draws.filter(
                    (draw: ILuckyDraw) => draw.accept_draw === true && draw.deleted_at === null
                );


                setLuckyDraws(activeLuckyDraws);
                if (activeLuckyDraws.length > 0) {
                    setSelectedLuckyDraw(activeLuckyDraws[0]);
                }
            } catch (error) {
                console.error("Error fetching lucky draws:", error);
            }
        };

        fetchLuckyDraws();
    }, []);

    const handleToggleModal = () => {
        setIsModalOpen(true);
    };

    const handleSelectLuckyDraw = (luckyDraw: ILuckyDraw) => {
        setSelectedLuckyDraw(luckyDraw);
    };

    return (
        <>
            <div
                className="fixed right-6 top-2/3 -translate-y-2/3 z-50 cursor-pointer group"
                onClick={handleToggleModal}
            >
                <div className="relative w-12 h-12">
                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden relative">
                        <div
                            ref={wheelRef}
                            className="w-full h-full rounded-full relative overflow-hidden"
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                transition: "transform 0.1s linear",
                            }}
                        >
                            {colors.map((color, index) => (
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
                                        transition: "transform 0.1s linear",
                                    }}
                                ></div>
                            ))}
                        </div>

                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full flex justify-center items-center z-10">
                            <div
                                className="w-3 h-3 rounded-full bg-gray-200 flex items-center justify-center text-[6px] font-bold">
                                QUAY
                            </div>
                        </div>

                        <div
                            className="absolute w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-white top-[-4px] left-[8px] z-20"></div>
                    </div>

                    <div
                        className="absolute inset-0 rounded-full bg-yellow-300 opacity-0 group-hover:opacity-40 filter blur-md -z-10 transition-opacity duration-300"></div>
                </div>

                <div
                    className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                    Vòng Quay May Mắn
                </div>
            </div>

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

                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Chọn Vòng Quay May Mắn</h3>
                            <div className="flex flex-wrap gap-2">
                                {luckyDraws.length > 0 ? (
                                    luckyDraws.map((draw) => (
                                        <button
                                            key={draw.id}
                                            onClick={() => handleSelectLuckyDraw(draw)}
                                            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                                                selectedLuckyDraw?.id === draw.id
                                                    ? "bg-blue-600"
                                                    : "bg-gray-500 hover:bg-gray-600"
                                            }`}
                                        >
                                            {draw.name}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Không có vòng quay nào đang hoạt động.</p>
                                )}
                            </div>
                        </div>

                        {selectedLuckyDraw ? (
                            <LuckyWheel luckyDraw={selectedLuckyDraw} onCloseModal={() => setIsModalOpen(false)}/>
                        ) : (
                            <p className="text-center text-gray-500">Vui lòng chọn một vòng quay để bắt đầu.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default LuckyWheelToggle;