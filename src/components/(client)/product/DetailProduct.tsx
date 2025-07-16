"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Rate, Modal, Button } from "antd";
import { ShoppingCartOutlined, CheckCircleFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/app/contexts/CartContext";
import { IProduct } from "@/app/interfaces/IProduct";
import { IProductImage } from "@/app/interfaces/IProductImage";
import { useRouter } from "next/navigation";
import { convertToInt } from "@/app/helpers/common";

interface DetailProductProps {
    product: IProduct | null;
}

const DetailProduct: React.FC<DetailProductProps> = ({ product }) => {
    const [clickedButtons, setClickedButtons] = useState<Record<number, boolean>>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(-1);
    const { addItem } = useCart();
    const router = useRouter();
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
      .preview-nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        padding: 10px;
        border-radius: 50%;
        cursor: pointer;
        transition: background 0.3s ease;
      }
      .preview-nav-button:hover {
        background: rgba(0, 0, 0, 0.7);
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
                sale_price: item?.sale_price?.toString() || "0",
                regular_price: item?.regular_price?.toString() || "0",
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

    const handleBuyNow = useCallback(
        (e: React.MouseEvent, item: IProduct) => {
            e.stopPropagation();
            if (isAdding) return;
            setIsAdding(true);
            const cartItem = {
                id: item.id.toString(),
                name: item.name || "",
                price: item?.sale_price!.toString() || "0",
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

    const handleImageClick = (imageUrl: string, index: number) => {
        setPreviewImage(imageUrl);
        setCurrentImageIndex(index);
    };

    const scrollThumbnails = (direction: "left" | "right") => {
        if (thumbnailRef.current) {
            const scrollAmount = 100;
            const currentScroll = thumbnailRef.current.scrollLeft;
            const newScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;
            thumbnailRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
        }
    };

    const handleNextImage = () => {
        if (product && Array.isArray(product.images) && currentImageIndex < product.images.length - 1) {
            const nextIndex = currentImageIndex + 1;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setPreviewImage(product.images[nextIndex].image_url);
            setCurrentImageIndex(nextIndex);
        }
    };

    const handlePrevImage = () => {
        if (product && Array.isArray(product.images) && currentImageIndex > 0) {
            const prevIndex = currentImageIndex - 1;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setPreviewImage(product.images[prevIndex].image_url);
            setCurrentImageIndex(prevIndex);
        }
    };

    if (!product) return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <div className="text-white text-xl font-bold animate-pulse">Đang tải thông tin sản phẩm...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-20">
            <div className="container mx-auto px-4 max-w-7xl">
                <div
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-purple-500/20 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Image Section */}
                        <div className="space-y-6">
                            <div
                                className="rounded-xl overflow-hidden shadow-lg border border-purple-500/20 bg-gradient-to-br from-gray-900 to-gray-800">
                                <img
                                    src={String(product.thumbnail) || "/client/assets/images/placeholder.png"}
                                    alt={product.name}
                                    className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="relative">
                                <Button
                                    icon={<LeftOutlined />}
                                    onClick={() => scrollThumbnails("left")}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none shadow-lg hover:from-purple-700 hover:to-blue-700"
                                />
                                <div
                                    ref={thumbnailRef}
                                    className="thumbnail-container flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory px-12"
                                >
                                    {Array.isArray(product.images) && product.images.length > 0 ? (
                                        (product.images as IProductImage[]).map((img, index) => (
                                            <div key={index} className="snap-start flex-shrink-0">
                                                <img
                                                    src={img.image_url || "/client/assets/images/placeholder.png"}
                                                    alt={`Thumbnail ${index}`}
                                                    className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition border-2 border-purple-500/20 hover:border-purple-500/50"
                                                    onClick={() => handleImageClick(img.image_url, index)}
                                                />
                                            </div>
                                        ))
                                    ) : null}
                                </div>
                                <Button
                                    icon={<RightOutlined />}
                                    onClick={() => scrollThumbnails("right")}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none shadow-lg hover:from-purple-700 hover:to-blue-700"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                                    {product.name}
                                </h1>
                                <div className="flex items-center space-x-3">
                                    <Rate allowHalf defaultValue={5} disabled className="text-yellow-400" />
                                    <span className="text-gray-400 text-sm">102 đánh giá</span>
                                </div>
                            </div>

                            <div className="p-6 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <div className="flex items-baseline gap-4">
                                    <div className={`border border-gray-300 rounded-md p-2 px-5`}>
                                        <div className="text-md text-white">Giá ATM </div>
                                        <div className="text-lg font-bold text-purple-400">{convertToInt(product.sale_price)}</div>
                                    </div>
                                    <div className={`border border-gray-300 rounded-md p-2 px-5`}>
                                        <div className="text-md text-white">Giá CARD </div>
                                        <div className="text-lg font-bold text-purple-400">{convertToInt(product.regular_price)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-8">
                            <div
                                className="space-y-4 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-purple-500/20">
                                <h3 className="text-xl font-bold text-white mb-4">Thông tin tài khoản</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-gray-400">Số lượng còn:</p>
                                        <p className="text-white font-medium">{product.quantity}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-gray-400">Loại đăng ký:</p>
                                        <p className="text-white font-medium">{product.register_by}</p>
                                    </div>
                                    {product.is_infinity_card && (
                                        <div className="space-y-2">
                                            <p className="text-gray-400">Thẻ vô cực:</p>
                                            <p className="text-white font-medium">{product.is_infinity_card ? "Có" : "Không"}</p>
                                        </div>
                                    )}
                                    {product.server && (
                                        <div className="space-y-2">
                                            <p className="text-gray-400">Server:</p>
                                            <p className="text-white font-medium">{product.server}</p>
                                        </div>
                                    )}
                                    {product.skin_type && (
                                        <div className="space-y-2">
                                            <p className="text-gray-400">Loại skin:</p>
                                            <p className="text-white font-medium">{product.skin_type}</p>
                                        </div>
                                    )}
                                    {product.rank && (
                                        <div className="space-y-2">
                                            <p className="text-gray-400">Rank:</p>
                                            <p className="text-white font-medium">{product.rank}</p>
                                        </div>
                                    )}
                                    {product.number_diamond_available !== 0 && (
                                        <div className="space-y-2">
                                            <p className="text-gray-400">SL kim cương đang có:</p>
                                            <p className="text-white font-medium">{product.number_diamond_available}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {
                                product.description && (
                                    <div className="space-y-8">
                                        <div
                                            className="space-y-4 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-purple-500/20">
                                            <h3 className="text-xl font-bold text-white mb-4">Mô tả tài khoản</h3>
                                            <div className="space-y-2">
                                                <p className="text-white text-justify font-medium whitespace-pre-line">{product.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            <div className="flex flex-col gap-4">
                                <Button
                                    type="primary"
                                    size="large"
                                    className={`w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:from-purple-700 hover:to-blue-700 cart-button ${
                                        clickedButtons[product.id] ? "clicked" : ""
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
                                    <span
                                        className="add-to-cart relative z-10 flex items-center justify-center gap-2 text-base font-bold">
                                      <ShoppingCartOutlined /> Thêm vào giỏ hàng
                                    </span>
                                    <span className="added font-bold">Đã thêm</span>
                                </Button>
                                <Button
                                    size="large"
                                    className={`w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 border-none hover:from-pink-600 hover:to-purple-600 text-white font-bold`}
                                    disabled={isAdding}
                                    onClick={(e) => handleBuyNow(e, product)}
                                >
                                    Mua ngay
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                styles={{ body: { padding: 0, position: "relative" } }}
            >
                {Array.isArray(product.images) && product.images.length > 1 && (
                    <>
                        <Button
                            icon={<LeftOutlined />}
                            onClick={handlePrevImage}
                            className="preview-nav-button"
                            style={{ left: "10px" }}
                            disabled={currentImageIndex <= 0}
                        />
                        <Button
                            icon={<RightOutlined />}
                            onClick={handleNextImage}
                            className="preview-nav-button"
                            style={{ right: "10px" }}
                            disabled={currentImageIndex >= product.images.length - 1}
                        />
                    </>
                )}
                <img
                    src={previewImage || ""}
                    alt="Preview"
                    className="w-full h-auto max-h-[80vh] object-contain"
                />
            </Modal>
        </div>
    );
};

export default DetailProduct;