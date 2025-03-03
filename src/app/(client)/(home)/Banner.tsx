"use client";

import { Carousel } from "antd";
import banner1 from "../../../../public/client/images/banner-1.jpg";
import banner2 from "../../../../public/client/images/banner-2.png";
import banner3 from "../../../../public/client/images/banner-3.jpg";
import Image from "next/image";

const Banner = () => {
  const banners = [banner1, banner2, banner3];

  return (
    <Carousel
      // autoplay
      touchMove
      draggable
      className="h-[320px] bg-red-50 container select-none cursor-grab active:cursor-grabbing pt-10 mb-6 "
    >
      {banners.map((banner, index) => (
        <div key={index} className="">
          {/* Add a unique key here */}
          <img
            src={banner.src}
            alt=""
            className="w-full h-[320px] object-cover"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default Banner;
