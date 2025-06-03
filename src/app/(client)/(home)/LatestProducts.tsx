"use client";
import React, { useState, useEffect } from "react";
import { Card, Badge } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/services/axiosService";
import { ICategory } from "@/app/interfaces/ICategory";

interface BoxCommonProps {
  title: string;
  items: ICategory[];
  link?: string;
  badgeText?: string;
}

const BoxCommon: React.FC<BoxCommonProps> = ({
                                               title,
                                               items,
                                               link = "/danh-muc",
                                               badgeText = "",
                                             }) => {
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      .category-card {
        overflow: hidden;
        border: 0;
        border-radius: 12px;
        transition: all 0.3s ease;
        background: linear-gradient(to bottom right, #1a1a2e, #16213e);
      }
      .category-card:hover {
        transform: scale(1.03);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      }
      .category-image {
        height: 180px;
        object-fit: cover;
        transition: transform 0.5s ease-in-out;
      }
      .category-card:hover .category-image {
        transform: scale(1.1);
      }
      .category-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: white;
        line-height: 1.4;
        margin-bottom: 0.5rem;
        text-align: center;
      }
    `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            {title}
          </h2>
          <Link
              href={link}
              className="text-purple-600 hover:text-purple-800 flex items-center font-medium transition-all hover:scale-105"
          >
            Xem tất cả <RightOutlined className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
              <Link href={`/danhmuc/${item.id}`} key={item.id}>
                <Card
                    hoverable
                    className="category-card"
                    cover={
                      <div className="relative bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center overflow-hidden">
                        {badgeText && (
                            <div className="absolute right-2 z-10">
                              <Badge.Ribbon
                                  className="animate-pulse"
                                  text={<span className="font-bold">{badgeText}</span>}
                                  color="purple"
                              />
                            </div>
                        )}
                        <div className="group w-full h-full overflow-hidden" style={{ height: "180px" }}>
                          <Image
                              width={500}
                              height={180}
                              alt={item.name || "Category image"}
                              src={String(item.image) || "/client/assets/images/placeholder.png"}
                              className="category-image"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    }
                >
                  <div className="p-4">
                    <h3 className="category-title">{item.name}</h3>
                  </div>
                </Card>
              </Link>
          ))}
        </div>
      </div>
  );
};

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/clients/home/latest-product");
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Không thể tải danh sách danh mục");
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <BoxCommon
          title="🔥 Danh mục game !!"
          items={categories}
          badgeText="HOT"
      />
  );
};

export default CategoryList;