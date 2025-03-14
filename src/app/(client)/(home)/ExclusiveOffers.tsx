"use client";
import BoxCommon from "@/components/(client)/(common)/BoxCommon";
import React, { useState, useEffect } from "react";
import { IProduct } from "@/app/interfaces/IProduct";
import api from "@/app/services/axiosService";

const ExclusiveOffers = () => {
  const [exclusiveOffers, setExclusiveOffers] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchExclusiveOffers = async () => {
      try {
        const response = await api.get('/clients/home/product-sale');
        setExclusiveOffers(response.data.products || []);
      } catch (error) {
        console.error('Error fetching exclusive offers:', error);
      }
    };

    fetchExclusiveOffers();
  }, []);

  return (
      <BoxCommon
          title="🔥 Ưu đãi độc quyền"
          items={exclusiveOffers}
      />
  );
};

export default ExclusiveOffers;