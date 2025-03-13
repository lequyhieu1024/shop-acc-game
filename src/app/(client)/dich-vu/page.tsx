import BoxCommon from "@/components/(client)/(common)/BoxCommon";
import React from "react";
import { exclusiveOffers } from "../(home)/ExclusiveOffers";
import DetailProduct from "@/components/(client)/product/DetailProduct";

const Category = () => {
  return (
    <>
      <BoxCommon title="🔥 Ưu đãi độc quyền" items={exclusiveOffers} />;
    </>
  );
};

export default Category;
