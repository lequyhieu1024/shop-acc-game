"use client";

import { Carousel } from "antd";
import {useEffect, useState} from "react";
import {IBanner} from "@/app/interfaces/IBanner";
import api from "@/app/services/axiosService";
import Image from "next/image";

const Banner = () => {
  const [banners, setBanners] = useState<IBanner[]>([])
  const fetchBanners = async () => {
    try {
      const response = await api.get('clients/banners')
      setBanners(response.data.banners)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <Carousel
      touchMove
      draggable
      className="h-[320px] bg-red-50 container select-none cursor-grab active:cursor-grabbing pt-10 mb-6 "
    >
      {banners.map((banner, index) => (
        <div key={index} className="">
          <Image width={500} height={500}
            src={banner.image_url}
            alt=""
            className="w-full h-[320px] object-cover"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default Banner;
