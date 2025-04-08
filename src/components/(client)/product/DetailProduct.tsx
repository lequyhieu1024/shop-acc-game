"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Rate, Modal, Button } from "antd";
import { ShoppingCartOutlined, CheckCircleFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/app/contexts/CartContext";
import { IProduct } from "@/app/interfaces/IProduct";
import { IProductImage } from "@/app/interfaces/IProductImage";

interface DetailProductProps {
    product: IProduct | null;
}

const DetailProduct: React.FC<DetailProductProps> = ({ product }) => {
    const [clickedButtons, setClickedButtons] = useState<Record<number, boolean>>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { addItem } = useCart();
    const thumbnailRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const styleElement: HTMLStyleElement = document.createElement("style");
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
      @keyframes moveRight {
        0% { left: 10px; opacity: 1; }
        70% { left: calc(100% - 30px); opacity: 1; }
        100% { left: calc(100% - 30px); opacity: 0; }
      }
      .thumbnail-container::-webkit-scrollbar {
        height: 8px;
      }
      .thumbnail-container::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
      }
      .thumbnail-container::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `;
        document.head.appendChild(styleElement);

        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const handleAddToCart = useCallback(
        (e: React.MouseEvent<HTMLElement>, item: IProduct) => {
            e.stopPropagation();
            if (isAdding) return;
            setIsAdding(true);
            setClickedButtons((prev) => ({ ...prev, [item.id]: true }));
            const cartItem = {
                id: item.id.toString(),
                name: item.name || "",
                price: item?.sale_price?.toString() || "0",
                quantity: 1,
                image: item.thumbnail || "",
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

    const handleImageClick = (imageUrl: string) => {
        setPreviewImage(imageUrl);
    };

    const scrollThumbnails = (direction: "left" | "right") => {
        if (thumbnailRef.current) {
            const scrollAmount = 100; // Adjust this value based on thumbnail width
            const currentScroll = thumbnailRef.current.scrollLeft;
            const newScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;
            thumbnailRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
        }
    };

    if (!product) return <div className="text-center text-gray-500">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-20 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden shadow-md">
                        <img
                            /* eslint-disable @next/next/no-img-element */
                            src={String(product.thumbnail) || "/client/assets/images/placeholder.png"}
                            alt={product.name}
                            className="w-full h-96 object-cover"
                        />
                    </div>
                    <div className="relative">
                        <Button
                            icon={<LeftOutlined />}
                            onClick={() => scrollThumbnails("left")}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full"
                        />
                        <div
                            ref={thumbnailRef}
                            className="thumbnail-container flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory"
                        >
                            {Array.isArray(product.images) && product.images.length > 0 ? (
                                (product.images as IProductImage[]).map((img, index) => (
                                    <div key={index} className="snap-start flex-shrink-0">
                                        <img
                                            /* eslint-disable @next/next/no-img-element */
                                            src={img.image_url || "/client/assets/images/placeholder.png"}
                                            alt={`Thumbnail ${index}`}
                                            className="w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-75 transition"
                                            onClick={() => handleImageClick(img.image_url)}
                                        />
                                    </div>
                                ))
                            ) : null}
                        </div>
                        <Button
                            icon={<RightOutlined />}
                            onClick={() => scrollThumbnails("right")}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full"
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                    <div className="flex items-center space-x-2">
                        <Rate allowHalf defaultValue={5} disabled className="text-yellow-400" />
                        <span className="text-gray-500 text-sm">5 đánh giá</span>
                    </div>
                    <div className="text-2xl font-semibold text-gray-800">
                        <del className="text-gray-400 text-lg">{product.regular_price} đ</del>
                        <span className="text-red-500 ml-2">{product.sale_price} đ</span>
                    </div>
                    <div className="text-gray-600 space-y-1">
                        <p>
                            Số lượng còn: <span className="font-medium">{product.quantity}</span>
                        </p>
                        <p>
                            Loại đăng ký: <span className="font-medium">{product.register_by}</span>
                        </p>
                        {product.is_infinity_card && (
                            <p>
                                Thẻ vô cực:{" "}
                                <span className="font-medium">{product.is_infinity_card ? "Có" : "Không"}</span>
                            </p>
                        )}
                        {product.server && (
                            <p>
                                Server: <span className="font-medium">{product.server}</span>
                            </p>
                        )}
                        {product.skin_type && (
                            <p>
                                Loại skin: <span className="font-medium">{product.skin_type}</span>
                            </p>
                        )}
                        {product.rank && (
                            <p>
                                Rank: <span className="font-medium">{product.rank}</span>
                            </p>
                        )}
                        {product.number_diamond_available !== 0 && (
                            <p>
                                SL kim cương đang có:{" "}
                                <span className="font-medium">{product.number_diamond_available}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button
                            type="primary"
                            size="large"
                            className={`w-full flex items-center justify-center cart-button ${clickedButtons[product.id] ? "clicked" : ""
                                }`}
                            disabled={isAdding}
                            onClick={(e) => handleAddToCart(e, product as IProduct)}
                        >
                            <div
                                className="cart-icon"
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <FaShoppingCart style={{ fontSize: "16px", color: "white" }} />
                            </div>
                            <span className="add-to-cart relative z-10 flex items-center">
                                <ShoppingCartOutlined className="mr-2" /> Thêm vào giỏ hàng
                            </span>
                            <span className="added">Đã thêm</span>
                        </Button>
                        <Button
                            size="large"
                            className="w-full bg-pink-500 text-white hover:bg-pink-600 hover:text-white"
                        >
                            Mua ngay
                        </Button>
                    </div>
                </div>
            </div>

            {/* Description */}
            {product.description && (
                <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Mô tả sản phẩm</h2>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
            )}

            {/* Success Modal */}
            <Modal
                open={isModalVisible}
                footer={null}
                closable={false}
                centered
                className="success-modal"
                styles={{
                    mask: { backgroundColor: "rgba(0, 0, 0, 0.45)" },
                    body: { padding: "24px", textAlign: "center" },
                }}
            >
                <div className="flex flex-col items-center">
                    <CheckCircleFilled style={{ fontSize: 48, color: "#52c41a" }} />
                    <p className="mt-4 text-lg text-gray-800">Thêm sản phẩm thành công!</p>
                </div>
            </Modal>

            {/* Image Preview Modal */}
            <Modal
                open={!!previewImage}
                footer={null}
                onCancel={() => setPreviewImage(null)}
                centered
                width={800}
                styles={{ body: { padding: 0 } }}
            >
                <img
                    /* eslint-disable @next/next/no-img-element */
                    src={previewImage || ""}
                    alt="Preview"
                    className="w-full h-auto max-h-[80vh] object-contain"
                />
            </Modal>
        </div>
    );
};

export default DetailProduct;