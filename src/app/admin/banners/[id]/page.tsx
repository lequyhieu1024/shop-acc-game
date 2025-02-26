"use client"
import BannerForm from "@/app/admin/banners/form";
import {useEffect, useState} from "react";
import api from "@/app/services/axiosService";
import {useParams} from "next/navigation";
import Loading from "@/components/Loading";
import {IBanner} from "@/app/interfaces/IBanner";

export default function EditBanner() {
    const [banner, setBanner] = useState<IBanner | null>(null);
    const params = useParams()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!params?.id) return;
        const fetchBanner = async (): Promise<void> => {
            try {
                const response = await api.get(`banners/${params.id}`)
                if (response.status === 200) {
                    setBanner(response.data.banner)
                }
            } catch (e) {
                console.log((e as Error).message)
            } finally {
                setLoading(false)
            }
        }
        fetchBanner();
    }, [params.id])

    if (loading) return <Loading />;
    if (!banner) return <p>Banner not found</p>;

    return <BannerForm isEditing={true} initialData={banner} />;
}