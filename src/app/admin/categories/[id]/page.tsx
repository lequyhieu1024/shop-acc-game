"use client"
import CategoryForm from "@/app/admin/categories/form";
import {useEffect, useState} from "react";
import api from "@/app/services/axiosService";
import {useParams} from "next/navigation";
import Loading from "@/components/Loading";
import {ICategory} from "@/app/interfaces/ICategory";

export default function EditCategory() {
    const [category, setCategory] = useState<ICategory | null>(null);
    const params = useParams()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!params?.id) return;
        const fetchCategory = async (): Promise<void> => {
            try {
                const response = await api.get(`categories/${params.id}`)
                console.log(response)
                if (response.status === 200) {
                    setCategory(response.data.category)
                }
            } catch (e) {
                console.log((e as Error).message)
            } finally {
                setLoading(false)
            }
        }
        fetchCategory();
    }, [params.id])

    if (loading) return <Loading />;
    if (!category) return <p>Category not found</p>;

    return <CategoryForm isEditing={true} initialData={category} />;
}