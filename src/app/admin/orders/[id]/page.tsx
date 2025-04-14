"use client"
import {useCallback, useEffect, useState} from "react";
import api from "@/app/services/axiosService";
import {useParams} from "next/navigation";
import Loading from "@/components/Loading";
import { IOrder } from "@/app/interfaces/IOrder";
import dynamic from "next/dynamic";

const OrderForm = dynamic(() => import("../form"), { ssr: false });
export default function EditOrder() {

    const [order, setOrder] = useState<IOrder | null>(null)
    const params = useParams();
    const [loading, setLoading] = useState<boolean>(true)

    const fetchOrder = useCallback(async () => {
        try {
            const response = await api.get(`orders/${params.id}`);
            const { order, images } = response.data;
            setOrder({ ...order, images } as IOrder);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    if (loading) return <Loading/>;
    if (!order) return <p>Order not found</p>;

    return (
        <OrderForm isEditing={true} initialData={order}/>
    )
}