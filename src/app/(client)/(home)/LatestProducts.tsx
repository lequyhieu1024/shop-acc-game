"use client";
import React from "react";
import { Card, Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import image from '../../../../public/client/images/image.jpg'
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
      image:image
    }
  ];

  return (
    <div className="w-full mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm mới nhất</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            hoverable
            className="overflow-hidden border rounded-lg"
            cover={
              <div className="relative h-48 bg-purple-100 flex items-center justify-center">
                <div className="absolute top-2 right-2">
                  <Badge.Ribbon
                    text={
                      <span className="animate-pulse inline-block">NEW</span>
                    }
                    color="magenta"
                  />
                </div>
                <img
                  alt={product.name}
                  src={product.image}
                  className="h-full object-contain"
                />
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
                <ShoppingCartOutlined className="mr-1" /> Add to Cart
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
