"use client"
import ProductForm from "@/app/admin/products/form";
import {useEffect, useState} from "react";
import {ICategory} from "@/app/interfaces/ICategory";
import api from "@/app/services/axiosService";
import ErrorPage from "@/components/(admin)/Error";
import Loading from "@/components/Loading";

export default function CreateProduct () {

    const [categories, setCategories] = useState<ICategory[] | []>([])
    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    const getCategories = async () => {
        try {
            const response = await api.get('categories/get-list');
            if (response.status === 200) {
                setCategories(response.data.categories || [])
            }
        } catch (e) {
            console.error("error: "+ e)
            setError(true)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getCategories();
    }, []);
    return (
        loading ? <Loading/> : error ? <ErrorPage/> :  <ProductForm categories={categories}/>
    )
}