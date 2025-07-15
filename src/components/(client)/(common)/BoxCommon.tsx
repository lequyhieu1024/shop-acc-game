"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, Badge, Modal } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/app/contexts/CartContext";
import { IProduct } from "@/app/interfaces/IProduct";
import { useRouter } from "next/navigation";
import { BsCartPlus } from "react-icons/bs";
import {convertToInt} from "@/app/helpers/common";

interface BoxCommonProps {
    title: string;
    items: IProduct[];
    link?: string;
    badgeText?: string;
    showPrice?: boolean;
}

const BoxCommon: React.FC<BoxCommonProps> = ({
                                                 title,
                                                 items,
                                                 badgeText = "",
                                                 showPrice = true,
                                             }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [clickedButtons, setClickedButtons] = useState<Record<number, boolean>>({});
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const { addItem } = useCart();
    useEffect(() => {
        const styleElement = document.createElement("style");
        styleElement.innerHTML = `
      .cart-button {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .cart-button .add-to-cart {
        display: block;
        transition: all 0.3s ease;
      }
      .cart-button .added {
        position: absolute;
        width: 100%;
        top: 50%;
        left: 0;
        transform: translateY(50%);
        opacity: 0;
        transition: all 0.3s ease;
      }
      .cart-button.clicked .add-to-cart {
        opacity: 0;
        transform: translateY(-50%);
      }
      .cart-button.clicked .added {
        opacity: 1;
        transform: translateY(-50%);
      }
      .cart-button .cart-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0;
        z-index: 20;
      }
      .cart-button.clicked .cart-icon {
        animation: moveRight 1.3s forwards ease-in-out;
        opacity: 1;
      }
      .cart {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #292d48;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        z-index: 1000;
      }
      .cart::before {
        content: attr(data-totalitems);
        font-size: 12px;
        font-weight: 600;
        position: absolute;
        top: -12px;
        right: -12px;
        background: #2bd156;
        line-height: 24px;
        padding: 0 5px;
        height: 24px;
        min-width: 24px;
        color: white;
        text-align: center;
        border-radius: 24px;
      }
      .cart.shake {
        animation: shakeCart 0.4s ease-in-out forwards;
      }
      @keyframes moveRight {
        0% { left: 10px; opacity: 1; }
        70% { left: calc(100% - 30px); opacity: 1; }
        100% { left: calc(100% - 30px); opacity: 0; }
      }
      @keyframes shakeCart {
        25% { transform: translateX(6px); }
        50% { transform: translateX(-4px); }
        75% { transform: translateX(2px); }
        100% { transform: translateX(0); }
      }
    `;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
            // No return statement needed, or explicitly return undefined
        };
    }, []);

    const handleAddToCart = useCallback(
        (e: React.MouseEvent, item: IProduct) => {
            e.stopPropagation();
            if (isAdding) return;
            setIsAdding(true);
            setClickedButtons((prev) => ({ ...prev, [item.id]: true }));
            const cartItem = {
                id: item.id.toString(),
                name: item.name || "",
                sale_price: item?.sale_price!.toString() || "0",
                regular_price: item?.regular_price!.toString() || "0",
                quantity: 1,
                image: item.thumbnail,
            };
            addItem(cartItem);
            setIsModalVisible(true);
            setTimeout(() => setIsModalVisible(false), 2000);
            setTimeout(() => {
                setClickedButtons((prev) => ({ ...prev, [item.id]: false }));
                setIsAdding(false);
            }, 1000);
        },
        [isAdding, addItem]
    );

    const handleBuyNow = useCallback(
        (e: React.MouseEvent, item: IProduct) => {
            e.stopPropagation();
            if (isAdding) return;
            setIsAdding(true);
            const cartItem = {
                id: item.id.toString(),
                name: item.name || "",
                sale_price: item?.sale_price!.toString() || "0",
                regular_price: item?.regular_price!.toString() || "0",
                quantity: 1,
                image: item.thumbnail,
            };
            localStorage.removeItem("cartItems");
            localStorage.setItem("cartItems", JSON.stringify([cartItem]));
            localStorage.setItem("totalItems", "1");
            router.push("/thanh-toan");
            setTimeout(() => setIsAdding(false), 1000);
        },
        [isAdding, router]
    );

    const handleRedirect = (item: IProduct) => {
        if (typeof window !== "undefined") {
            router.push(`/san-pham/${item.id}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 relative">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">{title}</h2>
                {/*<Link href={link} className="text-purple-600 hover:text-purple-800 flex items-center font-medium transition-all hover:scale-105">*/}
                {/*    Xem tất cả <RightOutlined className="ml-1" />*/}
                {/*</Link>*/}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                    <Card
                        key={item.id}
                        hoverable
                        onClick={() => handleRedirect(item)}
                        className="overflow-hidden border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 text-white"
                        cover={
                            <div className="relative bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center overflow-hidden">
                                {badgeText && (
                                    <div className="absolute right-2 z-10">
                                        <Badge.Ribbon
                                            className="animate-pulse"
                                            text={<span className="font-bold">{badgeText}</span>}
                                            color="purple"
                                        />
                                    </div>
                                )}
                                <div className="group w-full h-full overflow-hidden" style={{ height: "200px" }}>
                                    <Image
                                        width={500}
                                        height={200}
                                        alt={item?.name || "Product image"}
                                        src={String(item.thumbnail) || "/client/assets/images/placeholder.png"}
                                        className="h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>
                        }
                    >
                        <div className="p-3">
                            {item.name && (
                                <h3 className="text-lg font-bold mb-3 line-clamp-2 text-white hover:text-purple-400 transition-colors">
                                    {item.name}
                                </h3>
                            )}
                            {showPrice && (
                                <div className="mb-4 flex items-center justify-between">
                                    <div className={`border border-gray-300 rounded-md p-2 px-5`}>
                                        <div className="text-md">Giá ATM </div><div className="text-lg font-bold text-purple-400">{convertToInt(item.sale_price)}</div>
                                    </div>
                                    <div className={`border border-gray-300 rounded-md p-2 px-5`}>
                                        <div className="text-md">Giá CARD </div><div className="text-lg font-bold text-purple-400">{convertToInt(item.regular_price)}</div>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3 flex-col">
                                <button
                                    className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center text-sm font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] cart-button ${
                                        clickedButtons[item.id] ? "clicked" : ""
                                    }`}
                                    disabled={isAdding}
                                    onClick={(e) => handleAddToCart(e, item)}
                                >
                                    <div
                                        className="cart-icon"
                                        style={{
                                            width: "24px",
                                            height: "24px",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <FaShoppingCart style={{ fontSize: "16px", color: "white" }} />
                                    </div>
                                    <span className="add-to-cart relative z-10 !flex !items-center gap-2">
                                        <BsCartPlus className="text-lg" /> Thêm vào giỏ
                                    </span>
                                    <span className="added">Đã thêm</span>
                                </button>
                                <button
                                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-4 rounded-lg flex items-center justify-center text-sm font-bold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02]"
                                    disabled={isAdding}
                                    onClick={(e) => handleBuyNow(e, item)}
                                >
                                    Mua ngay
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <Modal
                open={isModalVisible}
                footer={null}
                closable={false}
                centered
                className="success-modal"
                styles={{
                    mask: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
                    body: { padding: "32px", textAlign: "center", background: "linear-gradient(to bottom right, #1a1a2e, #16213e)", borderRadius: "16px" }
                }}
            >
                <div className="flex flex-col items-center">
                    <CheckCircleFilled style={{ fontSize: 64, color: "#10B981" }} />
                    <p className="mt-4 text-xl font-bold text-white">Thêm sản phẩm thành công!</p>
                </div>
            </Modal>
        </div>
    );
};

export default BoxCommon;