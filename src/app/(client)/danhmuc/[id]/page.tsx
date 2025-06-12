"use client";
import React, {useEffect, useState} from "react";
import api from "@/app/services/axiosService";
import {IProduct} from "@/app/interfaces/IProduct";
import BoxCommon from "@/components/(client)/(common)/BoxCommon";
import {useParams} from "next/navigation";
import {ICategory} from "@/app/interfaces/ICategory";

const ProductByCategory = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [category, setCategory] = useState<ICategory | null>(null)
    const params = useParams();

    useEffect(() => {
        if (!params?.id) return;
        const fetchProducts = async () => {
            try {
                const response = await api.get(`/clients/category/${params.id}`);
                setProducts(response.data.products || []);
                setCategory(response.data.category || null);
            } catch (error) {
                console.error('Error fetching exclusive offers:', error);
            }
        };

        fetchProducts();
    }, []);
    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 mt-10`}>
            <BoxCommon
                title={`🔥 ${category?.name} !!`}
                items={products}
            />
        </div>
    );
};

export default ProductByCategory;
