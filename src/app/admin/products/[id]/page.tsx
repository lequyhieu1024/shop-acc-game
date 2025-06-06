"use client"
import {useCallback, useEffect, useState} from "react";
import {IProduct} from "@/app/interfaces/IProduct";
import api from "@/app/services/axiosService";
import {useParams} from "next/navigation";
import ProductForm from "@/app/admin/products/form";
import Loading from "@/components/Loading";

export default function EditProduct() {

    const [product, setProduct] = useState<IProduct | null>(null)
    const params = useParams();
    const [loading, setLoading] = useState<boolean>(true)

    const fetchProduct = useCallback(async () => {
        try {
            const response = await api.get(`products/${params.id}`);
            const { product, images } = response.data;
            setProduct({ ...product, images } as IProduct);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    if (loading) return <Loading/>;
    if (!product) return <p>Product not found</p>;

    return (
        <ProductForm isEditing={true} initialData={product}/>
    )
}