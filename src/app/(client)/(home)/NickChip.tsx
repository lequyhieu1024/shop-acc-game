"use client";
import React, {useEffect, useState} from "react";
import api from "@/app/services/axiosService";
import {IProduct} from "@/app/interfaces/IProduct";
import BoxCommon from "@/components/(client)/(common)/BoxCommon";

const NickChip = () => {
  const [nickChip, setNickChip] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchExclusiveOffers = async () => {
      try {
        const response = await api.get('/clients/home/product-cheapest');
        setNickChip(response.data.products || []);
      } catch (error) {
        console.error('Error fetching exclusive offers:', error);
      }
    };

    fetchExclusiveOffers();
  }, []);
  return (
      <BoxCommon
          title="🔥 Giá siêu rẻ nhưng chất lượng siêu tốt !!!"
          items={nickChip}
      />
  );
};

export default NickChip;
