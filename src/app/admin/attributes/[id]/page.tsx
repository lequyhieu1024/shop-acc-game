"use client"
import AttributeForm from "@/app/admin/attributes/form";
import {useParams} from "next/navigation";
import api from "@/app/services/axiosService";
import {useEffect, useState} from "react";
import {IAttribute} from "@/app/interfaces/IAttribute";

export default function EditAttribute() {

    const params = useParams();
    const [attribute, setAttribute] = useState<IAttribute | null>(null)

    useEffect(() => {
        const fetchAttribute = async () => {
            try {
                const res = await api.get(`attributes/${params.id}`)
                setAttribute(res.data.attribute)
            } catch (e) {
                console.log((e as Error).message)
            }
        }
        fetchAttribute();
    }, [params.id]);

    return (
        <AttributeForm isEditing={true} initialData={attribute}/>
    )
}