"use client";
import React from "react";
import { Card, Badge } from "antd";
import { ShoppingCartOutlined, RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";

interface ProductItem {
  id: number;
  name?: string;
  price?: string; // Giá có thể không cần thiết nếu dùng cho dịch vụ
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
  badgeText?: string; // Nhãn hiển thị trên sản phẩm (ví dụ: "NEW", "SALE")
  showPrice?: boolean; // Nếu false thì ẩn giá (dành cho dịch vụ)
}

const BoxCommon: React.FC<BoxCommonProps> = ({
  title,
  items,
  link = "/products",
  badgeText = "NEW",
  showPrice = true
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
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
            className="overflow-hidden border rounded-lg"
            cover={
              <div className="relative bg-purple-100 flex items-center justify-center overflow-hidden">
                {badgeText && (
                  <div className="absolute right-2 z-10">
                    <Badge.Ribbon text={badgeText} color="magenta" />
                  </div>
                )}
                <div className="group w-full h-full overflow-hidden">
                  <Image
                    height={100}
                    width={100}
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
              {/* Nếu là sản phẩm, hiển thị giá */}
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

              {/* Nếu là dịch vụ, hiển thị số lượng giao dịch */}
              {item.transactions !== undefined && (
                <p className="text-xs text-gray-500">
                  Giao dịch: {item.transactions.toLocaleString()}
                </p>
              )}

              {/* Nút thêm vào giỏ hàng nếu là sản phẩm */}
              {showPrice && (
                <button className="mt-3 w-full bg-blue-600 text-white py-1 px-2 rounded-md flex items-center justify-center text-sm">
                  <ShoppingCartOutlined className="mr-1" /> Thêm vào giỏ hàng
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BoxCommon;
