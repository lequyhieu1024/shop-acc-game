"use client"
import dynamic from "next/dynamic";
const OrderForm = dynamic(() => import("../form"), { ssr: false });
export default function CreateOrder () {
    return (
       <OrderForm/>
    )
}