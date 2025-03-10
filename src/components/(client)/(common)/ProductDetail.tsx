"use client";
import React, { useState } from 'react';
import { 
  FaStar, 
  FaShoppingCart, 
  FaHeart, 
  FaShareAlt, 
  FaMinus, 
  FaPlus 
} from 'react-icons/fa';
import Image from 'next/image';

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('/product-main.jpg');

  const product = {
    name: "Áo Thun Nam Cao Cấp Phong Cách Trẻ Trung",
    price: 129000,
    originalPrice: 250000,
    discount: 48,
    rating: 4.8,
    soldCount: 3200,
    images: [
      '/product-main.jpg',
      '/product-1.jpg', 
      '/product-2.jpg', 
      '/product-3.jpg',
      '/product-4.jpg'
    ],
    description: `
      - Chất liệu: Cotton cao cấp 100% 
      - Kiểu dáng: Slim fit 
      - Màu sắc: Đen, Trắng, Xanh Navy
      - Phù hợp: Đi chơi, đi làm, phong cách trẻ trung
    `
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => prev > 1 ? prev - 1 : 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-lg">
        {/* Phần Hình Ảnh */}
        <div>
          <div className="mb-4 border rounded-lg overflow-hidden">
            <Image 
              src={selectedImage} 
              alt="Ảnh sản phẩm" 
              width={500} 
              height={500} 
              className="w-full h-[400px] object-cover"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((img, index) => (
              <Image 
                key={index}
                src={img} 
                alt={`Ảnh chi tiết ${index + 1}`} 
                width={80} 
                height={80} 
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 object-cover cursor-pointer border-2 
                  ${selectedImage === img ? 'border-blue-500' : 'border-transparent'}`}
              />
            ))}
          </div>
        </div>

        {/* Phần Thông Tin Sản Phẩm */}
        <div>
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-gray-600 ml-2">
              ({product.rating}) | Đã bán {product.soldCount}
            </span>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-red-500 mr-4">
                {product.price.toLocaleString()}đ
              </span>
              <span className="line-through text-gray-500 mr-4">
                {product.originalPrice.toLocaleString()}đ
              </span>
              <span className="bg-red-500 text-white px-2 py-1 rounded">
                -{ product.discount }%
              </span>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Số Lượng</h3>
            <div className="flex items-center">
              <button 
                onClick={() => handleQuantityChange('decrease')}
                className="p-2 border rounded-l"
              >
                <FaMinus />
              </button>
              <input 
                type="number" 
                value={quantity} 
                readOnly
                className="w-16 text-center border-t border-b"
              />
              <button 
                onClick={() => handleQuantityChange('increase')}
                className="p-2 border rounded-r"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <button className="flex-1 bg-red-500 text-white py-3 rounded flex items-center justify-center hover:bg-red-600">
              <FaShoppingCart className="mr-2" /> Thêm Vào Giỏ Hàng
            </button>
            <button className="flex-1 bg-blue-500 text-white py-3 rounded flex items-center justify-center hover:bg-blue-600">
              Mua Ngay
            </button>
          </div>

          <div className="flex space-x-4">
            <button className="flex items-center text-gray-600 hover:text-blue-500">
              <FaHeart className="mr-2" /> Yêu Thích
            </button>
            <button className="flex items-center text-gray-600 hover:text-blue-500">
              <FaShareAlt className="mr-2" /> Chia Sẻ
            </button>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Mô Tả Sản Phẩm</h3>
            <pre className="whitespace-pre-wrap text-gray-700">
              {product.description}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;