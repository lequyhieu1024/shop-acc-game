"use client";
import React, {useEffect, useState} from "react";
import DetailProduct from "@/components/(client)/product/DetailProduct";
import { useParams } from "next/navigation";
import {IProduct} from "@/app/interfaces/IProduct";
import api from "@/app/services/axiosService";
import Error from "next/error";
const DetailAcc = () => {
  const params = useParams();

  const [productData, setProductData] = useState<IProduct | null>(null)
  const [error, setError] = useState<boolean>(false)

  const fetchProduct = async () => {
    try {
      const response = await api.get(`clients/detail-product/${Number(params.id)}`)
      if (response.status === 200) {
        setProductData(response.data.data)
        setError(false)
      } else {
        console.log(response)
        setError(true)
      }
    } catch {
      setError(true)
      console.log("client error")
    }
  }

  useEffect(() => {
    fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])
  if (error) return <Error statusCode={404} title={'Sản phẩm không tồn tại hoặc có lỗi từ server'} withDarkMode={true}/>
  return <DetailProduct product={productData} />;
};

export default DetailAcc;
