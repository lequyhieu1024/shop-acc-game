"use client";
import BoxCommon from "@/components/(client)/(common)/BoxCommon";
import React, { useState, useEffect } from "react";
import api from "@/app/services/axiosService";
import { ICategory } from "@/app/interfaces/ICategory";
import { IProduct } from "@/app/interfaces/IProduct";

const CategoryPage = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/clients/products-by-category");

        setCategories(response.data.categories || []);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const filteredProducts = products.filter(
      (product) => product.category_id == selectedCategory
  );

  useEffect(() => {
  }, [categories, products, selectedCategory, filteredProducts]);

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
      <div className="container mx-auto py-20">
        <div className="flex">
          <div className="w-1/4 pr-4">
            <h2 className="text-xl font-bold mb-4">Danh mục</h2>
            {categories.length > 0 ? (
                <ul className="space-y-2">
                  {categories.map((category) => (
                      <li
                          key={category.id}
                          className={`p-2 cursor-pointer rounded ${
                              selectedCategory === category.id
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </li>
                  ))}
                </ul>
            ) : (
                <div>Không có danh mục nào.</div>
            )}
          </div>

          <div className="w-3/4 pl-4">
            {selectedCategory ? (
                filteredProducts.length > 0 ? (
                    <BoxCommon
                        title={ `${categories.find((cat) => cat.id === selectedCategory)?.name}` }
                        items={filteredProducts}
                    />
                ) : (
                    <div>Không có sản phẩm trong danh mục này.</div>
                )
            ) : (
                <div>Vui lòng chọn một danh mục.</div>
            )}
          </div>
        </div>
      </div>
  );
};

export default CategoryPage;