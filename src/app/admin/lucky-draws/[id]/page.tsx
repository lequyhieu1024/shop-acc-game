"use client";
import { useEffect, useState } from "react";
import { ILuckyDraw } from "@/app/interfaces/ILuckyDraw";
import api from "@/app/services/axiosService";
import { useParams } from "next/navigation";
import LuckyDrawForm from "@/app/admin/lucky-draws/form";
import Loading from "@/components/Loading";

export default function EditLuckyDraw() {
    const [luckyDraw, setLuckyDraw] = useState<ILuckyDraw | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const params = useParams();

    const fetchDraw = async () => {
        setLoading(true);
        try {
            const response = await api.get(`lucky-draws/${params.id}`);
            if (response.status === 200) {
                // Chỉ lấy phần luckyDraw từ response
                setLuckyDraw(response.data.luckyDraw);
            }
        } catch (e) {
            console.log((e as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDraw();
    }, [params.id]);

    if (loading) {
        return <Loading />;
    }

    return <LuckyDrawForm isEditing={true} initialData={luckyDraw} />;
}