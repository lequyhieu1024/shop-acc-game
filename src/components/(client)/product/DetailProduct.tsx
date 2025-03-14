"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Carousel, Card, Button, Rate, List, Avatar, Image, Modal } from "antd";
import {
  DeleteOutlined,
  UserOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  CheckCircleFilled
} from "@ant-design/icons";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/app/contexts/CartContext";
import { IProduct } from "@/app/interfaces/IProduct";

interface Review {
  id: string;
  user: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  replies?: Review[];
  sellerReply?: {
    content: string;
    date: string;
  };
}

interface Product {
  id?: number;
  name: string;
  description: string;
  images: string[];
  rating: number;
  reviews: Review[];
  price: string | number;
  oldPrice?: string | number;
  discount?: string;
  sold: number;
}

interface DetailProductProps {
  product: Product | null;
}

const DetailProduct: React.FC<DetailProductProps> = ({ product }) => {
  const [clickedButtons, setClickedButtons] = useState<Record<number, boolean>>(
    {}
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

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
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});

  const [expandedImages, setExpandedImages] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleComments = (reviewId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const toggleImages = (reviewId: string) => {
    setExpandedImages((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleAddToCart = useCallback(
    (e: React.MouseEvent, item: IProduct) => {
      console.log("handleAddToCart called for item:", item);
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
        image: item.thumbnail || ""
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
  if (!product) return <div>Loading...</div>;
  return (
    <div className="container mx-auto px-4 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Slideshow */}
        <div>
          <Carousel autoplay>
            {product!.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={product!.name}
                className="w-full h-auto rounded-lg"
              />
            ))}
          </Carousel>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold">{product?.name}</h1>
          <p className="text-lg text-gray-600">{product?.description}</p>
          <div className="flex items-center mt-2">
            <Rate allowHalf defaultValue={product?.rating} disabled />
            <span className="ml-2 text-gray-500">
              ({product?.reviews.length} đánh giá)
            </span>
          </div>
          <p className="text-xl font-semibold text-red-500 mt-2">
            {product?.price}₫
          </p>
          <p className="text-gray-500">Đã bán: {product?.sold}</p>
          <div className="flex items-center gap-2 flex-col">
            <button
              className={`mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center text-sm hover:bg-blue-600 transition cart-button ${
                clickedButtons[product?.id as number] ? "clicked" : ""
              }`}
              disabled={isAdding}
              onClick={(e) =>
                handleAddToCart(e, product as unknown as IProduct)
              }
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
                <FaShoppingCart style={{ fontSize: "16px", color: "white" }} />
              </div>
              <span className="add-to-cart relative z-10 flex items-center">
                <ShoppingCartOutlined className="mr-1" /> Thêm vào giỏ hàng
              </span>
              <span className="added">Đã thêm</span>
            </button>
            <button className="w-full bg-pink-100 text-pink-500 py-2 px-4 rounded-md flex items-center justify-center text-sm hover:text-white hover:bg-pink-500 transition">
              Mua ngay
            </button>
          </div>
        </div>
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
      {/* Reviews & Comments */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Đánh giá sản phẩm</h2>
        {product?.reviews.map((review) => (
          <Card key={review.id} className="mt-4 shadow-sm">
            <div className="flex items-start">
              <Avatar
                src={review.avatar}
                icon={!review.avatar ? <UserOutlined /> : undefined}
                size={40}
                className="mr-3"
              />
              <div className="flex-1">
                {/* User info and rating */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{review.user}</div>
                    <Rate
                      allowHalf
                      value={review.rating}
                      disabled
                      className="text-sm"
                    />
                  </div>
                  <Button type="text" icon={<DeleteOutlined />} danger />
                </div>

                {/* Review date and product details */}
                <div className="text-sm text-gray-500 mt-1">
                  {review.date}{" "}
                  {product!.name && `| Tên nick: ${product!.name}`}
                </div>

                {/* Review comment */}
                <p className="text-gray-800 mt-2">{review.comment}</p>

                {/* Review images */}
                {review.images && review.images.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-2">
                      {review.images
                        .slice(
                          0,
                          expandedImages[review.id] ? review.images.length : 5
                        )
                        .map((img, idx) => (
                          <Image
                            key={idx}
                            src={img}
                            alt={`Review image ${idx + 1}`}
                            className="rounded-md"
                            width={100}
                            height={100}
                            style={{ objectFit: "cover" }}
                          />
                        ))}
                    </div>
                    {review.images.length > 5 && (
                      <Button
                        type="link"
                        className="p-0 mt-2"
                        onClick={() => toggleImages(review.id)}
                      >
                        {expandedImages[review.id]
                          ? "Ẩn bớt"
                          : `Xem thêm ${review.images.length - 5} ảnh`}
                      </Button>
                    )}
                  </div>
                )}

                {/* Nested Comments */}
                {review.replies && review.replies.length > 0 && (
                  <div className="mt-4 bg-gray-50 rounded-md p-3">
                    <List
                      dataSource={
                        expandedComments[review.id]
                          ? review.replies
                          : review.replies.slice(0, 3)
                      }
                      renderItem={(reply) => (
                        <div className="mb-3 last:mb-0">
                          <div className="flex items-start">
                            <Avatar
                              src={reply.avatar}
                              icon={
                                !reply.avatar ? <UserOutlined /> : undefined
                              }
                              size={32}
                              className="mr-2"
                            />
                            <div>
                              <div className="font-medium">{reply.user}</div>
                              <div className="text-xs text-gray-500">
                                {reply.date}
                              </div>
                              <Rate
                                allowHalf
                                value={reply.rating}
                                disabled
                                className="text-xs"
                              />
                              <p className="text-gray-700 mt-1">
                                {reply.comment}
                              </p>

                              {reply.images && reply.images.length > 0 && (
                                <div className="flex mt-2 gap-2">
                                  {reply.images.map((img, idx) => (
                                    <Image
                                      key={idx}
                                      src={img}
                                      alt={`Reply image ${idx + 1}`}
                                      className="rounded-md"
                                      width={80}
                                      height={80}
                                      style={{ objectFit: "cover" }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    />
                    {review.replies.length > 3 && (
                      <Button
                        type="link"
                        className="p-0"
                        onClick={() => toggleComments(review.id)}
                      >
                        {expandedComments[review.id]
                          ? "Ẩn bớt"
                          : `Xem thêm ${review.replies.length - 3} phản hồi`}
                      </Button>
                    )}
                  </div>
                )}

                {/* Seller Reply */}
                {review.sellerReply && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Avatar
                        icon={<ShopOutlined />}
                        size={24}
                        className="bg-blue-500"
                      />
                      <p className="font-semibold text-gray-700">
                        Phản Hồi Của Người Bán
                      </p>
                      <span className="text-xs text-gray-500">
                        {review.sellerReply.date}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2 pl-8">
                      {review.sellerReply.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DetailProduct;
