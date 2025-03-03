import BoxCommon from "@/components/(client)/(common)/BoxCommon";
import React from "react";
import image from "../../../../public/client/assets/images/image.jpg";

const ExclusiveOffers = () => {
  const exclusiveOffers = [
    {
      id: 1,
      name: "Máy Gắp Kim Cương",
      image: image.src,
      played: 16401,
      price: "19.000",
      oldPrice: "23.750",
      discount: "20%"
    },
    {
      id: 2,
      name: "Rung Cây Robux Hứng Nhiều Không Hết",
      image: image.src,
      played: 27711,
      price: "39.000",
      oldPrice: "48.750",
      discount: "20%"
    },
    {
      id: 3,
      name: "VQ AK Rồng Xanh",
      image: image.src,
      played: 3249,
      price: "39.000",
      oldPrice: "18.750",
      discount: "20%"
    },
    {
      id: 4,
      name: "Máy Xèng Robux",
      image: image.src,
      played: 16056,
      price: "15.000",
      oldPrice: "18.750",
      discount: "20%"
    },
    {
      id: 5,
      name: "Vòng Quay Robux",
      image: image.src,
      played: 11247,
      price: "19.000",
      oldPrice: "38.000",
      discount: "50%"
    }
  ];
  return <BoxCommon title="🔥 Ưu đãi độc quyền" items={exclusiveOffers} />;
};

export default ExclusiveOffers;
