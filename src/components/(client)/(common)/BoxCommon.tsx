"use client";
import React, { useState } from "react";
import { Card, Badge, Button, Modal } from "antd";
import { ShoppingCartOutlined, RightOutlined, CheckCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";

interface ProductItem {
  id: number;
  name?: string;
  price?: string;
  oldPrice?: string;
  discount?: string;
  image: string;
  transactions?: number;
  top?: number;
  played?: number;
}

interface BoxCommonProps {
  title: string;
  items: ProductItem[];
  link?: string;
  badgeText?: string;
  showPrice?: boolean;
}

const BoxCommon: React.FC<BoxCommonProps> = ({
  title,
  items,
  link = "/products",
  badgeText = "NEW",
  showPrice = true
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn không cho sự kiện click lan sang Card
    setIsModalVisible(true);
    setClicked(true);
    setTimeout(() => setClicked(false), 1500); // Reset sau 1.5 giây

    // Tự động đóng modal sau 2 giây
    setTimeout(() => {
      setIsModalVisible(false);
    }, 2000);
  };

  const handleRedirect = () => {
    console.log('ád');
  };




  return (
    <div className="container mx-auto px-4 py-12">
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
            onClick={() => handleRedirect()}
            className="overflow-hidden border rounded-lg"
            cover={
              <div className="relative bg-purple-100 flex items-center justify-center overflow-hidden">
                {badgeText && (
                  <div className="absolute right-2 z-10">
                    <Badge.Ribbon text={badgeText} color="magenta" />
                  </div>
                )}
                <div className="group w-full h-full overflow-hidden">
                  <Image width={500} height={500}
                    alt={item?.name || "Product image"}
                    src={item.image}
                    className="h-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                </div>
              </div>
            }
          >
            <div className="mt-2">
              <h3 className="text-sm font-medium line-clamp-2 h-10">
                {item.name}
              </h3>
              {item.played && (
                <div className="mt-2 text-gray-500">Đã chơi: {item.played}</div>
              )}
              {showPrice && (
                <div className="flex items-center mt-2">
                  <span className="text-blue-600 font-bold">{item.price}</span>
                  {item.oldPrice && (
                    <span className="ml-2 text-gray-400 line-through text-xs">
                      {item.oldPrice}
                    </span>
                  )}
                  {item.discount && (
                    <span className="ml-2 text-xs text-white bg-pink-500 px-1 rounded">
                      {item.discount}
                    </span>
                  )}
                </div>
              )}

              {item?.top && (
                <div className="absolute top-2 left-2 bg-yellow-200 px-2 rounded text-sm">
                  {item.top}
                </div>
              )}

              {item.transactions !== undefined && (
                <p className="text-xs text-gray-500">
                  Giao dịch: {item.transactions.toLocaleString()}
                </p>
              )}

              <div className="flex items-center gap-2 flex-col">
                <button
                  className={`relative w-52 h-14 bg-indigo-600 text-white rounded-lg overflow-hidden transition-transform duration-300 active:scale-90 ${clicked ? "clicked" : ""}`}
                  onClick={handleAddToCart}
                >
                  <span className={`absolute inset-0 flex items-center justify-center text-lg transition-opacity duration-300 ${clicked ? "opacity-0" : "opacity-100"}`}>Thêm vào giỏ hàng</span>
                  <span className={`absolute inset-0 flex items-center justify-center text-lg transition-opacity duration-300 ${clicked ? "opacity-100" : "opacity-0"}`}>Đã thêm</span>
                  <i className="fas fa-shopping-cart absolute text-2xl top-1/2 left-[-10%] transition-all duration-1500 ease-in-out" style={{ left: clicked ? "110%" : "-10%" }} />
                  <i className="fas fa-box absolute text-xl top-[-20%] left-[52%] transition-all duration-1500 ease-in-out" style={{ top: clicked ? "40%" : "-20%", left: clicked ? "112%" : "52%" }} />
                </button>
                <button className="w-full bg-pink-100 text-pink-500 py-1 px-2 rounded-md flex items-center justify-center text-sm hover:text-white hover:bg-pink-500 transition">
                  Mua ngay
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal thông báo thêm sản phẩm thành công */}
      <Modal
        open={isModalVisible}
        footer={null}
        closable={false}
        centered
        className="success-modal"
        styles={{
          mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
          body: { padding: '24px', textAlign: 'center' }
        }}
      >
        <div className="flex flex-col items-center">
          <CheckCircleFilled style={{ fontSize: 48, color: '#52c41a' }} />
          <p className="mt-4 text-lg">Thêm sản phẩm thành công!</p>
        </div>
      </Modal>
    </div>
  );
};

export default BoxCommon;