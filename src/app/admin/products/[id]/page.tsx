"use client"
import {useEffect, useState} from "react";
import {IProduct} from "@/app/interfaces/IProduct";
import api from "@/app/services/axiosService";
import {useParams} from "next/navigation";
import ProductForm from "@/app/admin/products/form";
import Loading from "@/components/Loading";

export default function EditProduct() {

    const [product, setProduct] = useState<IProduct | null>(null)
    const params = useParams();
    const [loading, setLoading] = useState<boolean>(true)
    console.log(params.id)

    const fetchProduct = async () => {
        try {
            const response = await api.get(`product/${params.id}`)
            setProduct(response.data.product);
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchProduct();
    }, [product]);

    if (loading) return <Loading/>;
    if (!product) return <p>Product not found</p>;

    return (
        <ProductForm isEditing={true} initialData={product}/>
    )
}