"use client"
import VoucherForm from "@/app/admin/vouchers/form";
import {useEffect, useState} from "react";
import api from "@/app/services/axiosService";
import {IVoucher} from "@/app/interfaces/IVoucher";
import {useParams} from "next/navigation";
import Loading from "@/components/Loading";

export default function EditVoucher() {
    const [voucher, setVoucher] = useState<IVoucher | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const params = useParams();

    useEffect(() => {
        const fetchVoucher = async (): Promise<void> => {
            try {
                const response = await api.get(`vouchers/${params.id}`)
                setVoucher(response.data.voucher)
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }
        fetchVoucher();
    }, [params.id])

    if (loading) return <Loading/>;
    if (!voucher) return <p>Category not found</p>;
    return <VoucherForm isEditing={true} initialData={voucher}/>
}