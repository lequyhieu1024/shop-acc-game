"use client";
import React, { useState, useEffect } from "react";
import BoxCommon from "@/components/(client)/(common)/BoxCommon";
import api from "@/app/services/axiosService";
import { IProduct } from "@/app/interfaces/IProduct";

const LatestProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await api.get("/clients/home/latest-product");

        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Error fetching latest products:", err);
        setError("Không thể tải danh sách sản phẩm mới nhất");
      }
    };

    fetchLatestProducts();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <BoxCommon
      title="Nick Free Fire mới nhất"
      items={products}
      badgeText="NEW"
    />
  );
};

export default LatestProducts;
