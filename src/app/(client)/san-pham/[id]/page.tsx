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
  }, [params.id])

  // const productData = {
  //   id: 12,
  //   name: "Bộ Chăn Ga Gối Cotton Poly Hoa Văn",
  //   description:
  //     "Bộ chăn ga gối đệm chất liệu cotton poly cao cấp, họa tiết hoa văn trang nhã, phù hợp với mọi không gian phòng ngủ.",
  //   images: [
  //     "https://example.com/product-image-1.jpg",
  //     "https://example.com/product-image-2.jpg",
  //     "https://example.com/product-image-3.jpg"
  //   ],
  //   rating: 4.7,
  //   price: 550000,
  //   sold: 1285,
  //   reviews: [
  //     {
  //       id: "review1",
  //       user: "vannquy421",
  //       avatar: AVATAR.src,
  //       rating: 5,
  //       date: "2023-09-12 07:25",
  //       comment:
  //         "Sản phẩm rất đẹp và chất lượng, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận.",
  //       images: [
  //         "https://example.com/review-images/rev1-img1.jpg",
  //         "https://example.com/review-images/rev1-img2.jpg",
  //         "https://example.com/review-images/rev1-img3.jpg",
  //         "https://example.com/review-images/rev1-img4.jpg",
  //         "https://example.com/review-images/rev1-img5.jpg"
  //       ],
  //       sellerReply: {
  //         content:
  //           "Cảm ơn quý khách đã tin tưởng và ủng hộ shop. Shop rất vui khi sản phẩm đã làm hài lòng quý khách. Rất mong được phục vụ quý khách trong những lần mua sắm tiếp theo!",
  //         date: "2023-09-12 10:45"
  //       }
  //     },
  //     {
  //       id: "review2",
  //       user: "ngoclinh89",
  //       avatar: AVATAR.src,
  //       rating: 4,
  //       date: "2023-09-10 15:32",
  //       comment:
  //         "Sản phẩm đẹp, giao hàng nhanh. Chỉ có điểm trừ nhỏ là màu sắc hơi khác so với hình ảnh trên web, nhưng vẫn rất ưng ý.",
  //       images: [
  //         "https://example.com/review-images/rev2-img1.jpg",
  //         "https://example.com/review-images/rev2-img2.jpg"
  //       ],
  //       replies: [
  //         {
  //           id: "reply1",
  //           user: "thanhhang76",
  //           avatar: AVATAR.src,
  //           rating: 0,
  //           date: "2023-09-10 18:45",
  //           comment: "Chị ơi, màu sắc có bị phai khi giặt không ạ?",
  //           images: []
  //         },
  //         {
  //           id: "reply2",
  //           user: "ngoclinh89",
  //           avatar: AVATAR.src,
  //           rating: 0,
  //           date: "2023-09-11 08:12",
  //           comment: "Mình đã giặt 2 lần rồi, màu vẫn đẹp, không bị phai nhé.",
  //           images: ["https://example.com/review-images/reply-img1.jpg"]
  //         }
  //       ],
  //       sellerReply: {
  //         content:
  //           "Cảm ơn quý khách đã mua hàng và đánh giá. Shop xin ghi nhận góp ý về màu sắc và sẽ cập nhật hình ảnh chính xác hơn. Mong được phục vụ quý khách lần sau!",
  //         date: "2023-09-10 16:20"
  //       }
  //     }
  //     // Các đánh giá khác...
  //   ]
  // };
  if (error) return <Error statusCode={404} title={'Sản phẩm không tồn tại hoặc có lỗi từ server'} withDarkMode={true}/>
  return <DetailProduct product={productData} />;
};

export default DetailAcc;
