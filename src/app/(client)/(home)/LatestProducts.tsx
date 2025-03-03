"use client";
import React from "react";
import { Card, Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import image from "../../../../public/client/images/image.jpg";
import Link from "next/link";
import Image from "next/image";

const LatestProducts = () => {
  const products = [
    {
      id: 1,
      name: "Random fisch lv500+ random nhiều cần + coin",
      price: "250.000đ",
      oldPrice: "507.000đ",
      discount: "51%",
      image: image
    },
    {
      id: 2,
      name: "Random fisch lv750+ random nhiều cần + coin",
      price: "350.000đ",
      oldPrice: "455.000đ",
      discount: "23%",
      image: image
    },
    {
      id: 3,
      name: "Random fisch lv300+ random nhiều cần + coin",
      price: "100.000đ",
      oldPrice: "200.000đ",
      discount: "50%",
      image: image
    },
    {
      id: 4,
      name: "Random fisch 2m Coins",
      price: "20.000đ",
      oldPrice: "104.000đ",
      discount: "81%",
      image: image
    },
    {
      id: 5,
      name: "Random Fisch 5M Coin",
      price: "65.000đ",
      oldPrice: "100.000đ",
      discount: "35%",
      image: image
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Nick Free Fire mới nhất</h2>
        <Link
          href="/products"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          Xem tất cả <span className="ml-1">&gt;</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            hoverable
            className="overflow-hidden border rounded-lg"
            cover={
              <div className="relative bg-purple-100 flex items-center justify-center overflow-hidden">
                <div className="absolute right-2 z-10">
                  <Badge.Ribbon
                    className="animate-bounce"
                    text={
                      <span className="animate-bounce inline-block">NEW</span>
                    }
                    color="magenta"
                  />
                </div>
                <div className="group w-full h-full overflow-hidden">
                  <img
                    alt={product.name}
                    src={product.image.src}
                    className="h-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                </div>
              </div>
            }
          >
            <div className="mt-2">
              <h3 className="text-sm font-medium line-clamp-2 h-10">
                {product.name}
              </h3>
              <div className="flex items-center mt-2">
                <span className="text-blue-600 font-bold">{product.price}</span>
                <span className="ml-2 text-gray-400 line-through text-xs">
                  {product.oldPrice}
                </span>
                <span className="ml-2 text-xs text-white bg-pink-500 px-1 rounded">
                  {product.discount}
                </span>
              </div>
              <button className="mt-3 w-full bg-blue-600 text-white py-1 px-2 rounded-md flex items-center justify-center text-sm">
                <ShoppingCartOutlined className="mr-1" /> Thêm vào giỏ hàng
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
