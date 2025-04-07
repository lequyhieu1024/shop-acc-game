"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, Badge, Modal } from "antd";
import {
  RightOutlined,
  CheckCircleFilled
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/app/contexts/CartContext";
import {IProduct} from "@/app/interfaces/IProduct";
import { useRouter } from "next/navigation";
import {BsCartPlus} from "react-icons/bs";

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
  link = "/danh-muc",
  badgeText = "",
  showPrice = true
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clickedButtons, setClickedButtons] = useState<Record<number, boolean>>(
    {}
  );
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
        0% {
          left: 10px;
          opacity: 1;
        }
        70% {
          left: calc(100% - 30px);
          opacity: 1;
        }
        100% {
          left: calc(100% - 30px);
          opacity: 0;
        }
      }
      
      @keyframes shakeCart {
        25% {
          transform: translateX(6px);
        }
        50% {
          transform: translateX(-4px);
        }
        75% {
          transform: translateX(2px);
        }
        100% {
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent, item: IProduct) => {
      console.log("handleAddToCart called for item:", item.id);
      e.stopPropagation();
      if (isAdding) return;
      setIsAdding(true);
      setClickedButtons((prev) => ({
        ...prev,
        [item.id]: true
      }));
      const cartItem = {
        id: item.id.toString(),
        name: item.name || "",
        price: item?.sale_price!.toString() || "0",
        quantity: 1,
        image: item.thumbnail
      };

      addItem(cartItem);
      setIsModalVisible(true);
      setTimeout(() => {
        setIsModalVisible(false);
      }, 2000);

      setTimeout(() => {
        setClickedButtons((prev) => ({
          ...prev,
          [item.id]: false
        }));
      }, 1000);
      setTimeout(() => {
        setIsAdding(false);
      }, 1000);
    },
    [isAdding, addItem]
  );

  const handleRedirect = (item: IProduct) => {
    if (typeof window !== "undefined") {
      router.push(`/san-pham/${item.id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 relative">
      {/* Giỏ hàng */}
      {/* <div className="cart" data-totalitems={totalItems}>
        <ShoppingCartOutlined style={{ fontSize: 24, color: 'white' }} />
      </div> */}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link
          href={link}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          Xem tất cả <RightOutlined className="ml-1" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            hoverable
            onClick={() => handleRedirect(item)}
            className="overflow-hidden border rounded-lg"
            cover={
              <div className="relative bg-purple-100 flex items-center justify-center overflow-hidden">
                {badgeText && (
                  <div className="absolute right-2 z-10">
                    <Badge.Ribbon
                      className="animate-bounce"
                      text={
                        <span className="animate-bounce inline-block">
                          {badgeText}
                        </span>
                      }
                      color="magenta"
                    />
                  </div>
                )}
                <div className="group w-full h-full overflow-hidden" style={{ height: "120px" }}>
                  <Image
                    width={500}
                    height={120}
                    alt={item?.name || "Product image"}
                    src={String(item.thumbnail) || "/client/assets/images/placeholder.png"}
                    className="h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                </div>
              </div>
            }
          >
            <div>
              {item.name && (
                <h3 className="text-sm font-medium line-clamp-2">
                  {item.name}
                </h3>
              )}
              {showPrice && (
                <div className="flex items-center">
                  <span className="text-blue-600 font-bold">{item.sale_price}</span>
                  {item.regular_price && (
                    <span className="ml-2 text-gray-400 line-through text-xs">
                      {item.regular_price}
                    </span>
                  )}
                  {item.sale_price && (
                    <span className="ml-2 text-xs text-white bg-pink-500 px-1 rounded">
                                {Math.round(((item.regular_price - item.sale_price) / item.regular_price) * 100)}%
                    </span>
                  )}
                </div>
              )}

              {item.register_by && (
                <p className="text-xs text-gray-500">
                  Đăng ký: {item.register_by}
                </p>
              )}

              <div className="flex items-center gap-2 flex-col">
                <button
                  className={`mt-3 w-full bg-blue-500 text-white py-2 px-2 rounded-md flex items-center justify-center text-sm hover:bg-blue-600 transition cart-button ${
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
                      justifyContent: "center"
                    }}
                  >
                    <FaShoppingCart
                      style={{ fontSize: "16px", color: "white" }}
                    />
                  </div>
                  <span className="add-to-cart relative z-10 !flex !items-center gap-1">
                    <BsCartPlus /> giỏ hàng
                  </span>
                  <span className="added">Đã thêm</span>
                </button>
                <button className="w-full bg-pink-100 text-pink-500 py-2 px-4 rounded-md flex items-center justify-center text-sm hover:text-white hover:bg-pink-500 transition">
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
          mask: { backgroundColor: "rgba(0, 0, 0, 0.45)" },
          body: { padding: "24px", textAlign: "center" }
        }}
      >
        <div className="flex flex-col items-center">
          <CheckCircleFilled style={{ fontSize: 48, color: "#52c41a" }} />
          <p className="mt-4 text-lg">Thêm sản phẩm thành công!</p>
        </div>
      </Modal>
    </div>
  );
};

export default BoxCommon;
