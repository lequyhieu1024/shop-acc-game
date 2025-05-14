"use client";
import BoxCommon from "@/components/(client)/(common)/BoxCommon";
import React, { useState, useEffect } from "react";
import api from "@/app/services/axiosService";
import { ICategory } from "@/app/interfaces/ICategory";
import { IProduct } from "@/app/interfaces/IProduct";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

const CategoryPage = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 24,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
    });

    const fetchProducts = async (categoryId: string = "all", page: number = 1) => {
        try {
            setIsLoading(true);
            const response = await api.get(`/clients/products-by-category?categoryId=${categoryId}&page=${page}&limit=24`);
            
            setCategories(response.data.categories || []);
            setProducts(response.data.products || []);
            setPagination(response.data.pagination || {
                page: 1,
                limit: 24,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        fetchProducts(categoryId, 1); // Reset to page 1 when changing category
    };

    const handlePageChange = (newPage: number) => {
        fetchProducts(selectedCategory, newPage);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <div className="text-white text-xl font-bold animate-pulse">Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-20">
            <div className="container mx-auto px-4">
                {/* Categories Section */}
                <div className="mb-8">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/20 shadow-xl">
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Danh mục sản phẩm
                        </h2>
                        {categories.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                <button
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                        selectedCategory === "all"
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-[1.02]"
                                            : "bg-purple-500/10 text-gray-300 hover:bg-purple-500/20 hover:text-white"
                                    }`}
                                    onClick={() => handleCategoryChange("all")}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${
                                            selectedCategory === "all" ? "bg-white" : "bg-purple-500"
                                        }`}></span>
                                        <span className="font-medium">Tất cả sản phẩm</span>
                                    </div>
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                            selectedCategory === category.id.toString()
                                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-[1.02]"
                                                : "bg-purple-500/10 text-gray-300 hover:bg-purple-500/20 hover:text-white"
                                        }`}
                                        onClick={() => handleCategoryChange(category.id.toString())}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${
                                                selectedCategory === category.id.toString() ? "bg-white" : "bg-purple-500"
                                            }`}></span>
                                            <span className="font-medium">{category.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-400 text-center py-4">Không có danh mục nào.</div>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="w-full">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/20 shadow-xl">
                        {products.length > 0 ? (
                            <>
                                <BoxCommon
                                    title={selectedCategory === "all" 
                                        ? "Tất cả sản phẩm" 
                                        : categories.find((cat) => cat.id.toString() === selectedCategory)?.name || ""}
                                    items={products}
                                />
                                
                                {/* Pagination */}
                                <div className="mt-8 flex items-center justify-center gap-4">
                                    <Button
                                        icon={<LeftOutlined />}
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={!pagination.hasPrevPage}
                                        className="bg-purple-500/20 text-purple-400 border-none hover:bg-purple-500/30 disabled:opacity-50"
                                    >
                                        Trang trước
                                    </Button>
                                    <span className="text-gray-400">
                                        Trang {pagination.page} / {pagination.totalPages}
                                    </span>
                                    <Button
                                        icon={<RightOutlined />}
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className="bg-purple-500/20 text-purple-400 border-none hover:bg-purple-500/30 disabled:opacity-50"
                                    >
                                        Trang sau
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">Không có sản phẩm trong danh mục này.</div>
                                <div className="text-purple-400 text-sm">Vui lòng chọn danh mục khác</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;