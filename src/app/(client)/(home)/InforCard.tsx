"use client";

import { Card } from "antd";
import { FaCartPlus } from "react-icons/fa"; // Import the icon
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";

const cardData = [
  {
    title: (
      <div className="flex items-center">
        <FaCartPlus className="mr-2 text-[20px] text-rose-600" />
        <span className="text-md font-bold  text-blue-500">
          Sản phẩm đa dạng
        </span>
      </div>
    ),
    description:
      "Hệ thống cung cấp các sản phẩm, dịch vụ đa dạng nhất nhằm đáp ứng nhu cầu của khách hàng."
  },
  {
    title: (
      <div className="flex items-center">
        <FaUsers className="mr-2 text-[20px] text-rose-600" />
        <span className="text-md font-bold text-blue-500">
          Hàng nghìn khách hàng tin dùng
        </span>
      </div>
    ),
    description:
      "Hơn 28,000 giao dịch thành công mỗi ngày. Chúng tôi luôn đặt khách hàng lên hàng đầu."
  },
  {
    title: (
      <div className="flex items-center">
        <BiSupport className="mr-2 text-[20px] text-rose-600" />
        <span className="text-md font-bold  text-blue-500">
          Trung tâm hỗ trợ tư vấn 24/24
        </span>
      </div>
    ),
    description:
      "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn trải nghiệm tốt nhất."
  },
  {
    title: (
      <div className="flex items-center">
        <TbRosetteDiscountCheckFilled className="mr-2 text-[20px] text-rose-600" />
        <span className="text-md font-bold  text-blue-500">
          Giá cả siêu ưu đãi
        </span>
      </div>
    ),
    description:
      "Cung cấp những sản phẩm với giá cả tốt nhất trên thị trường nhằm mang lại lợi ích cho khách hàng."
  }
];

const InfoCards = () => {
  return (
    <div className="container mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardData.map((card, index) => (
        <Card
          key={index}
          className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          title={card.title} // Use the title directly
        >
          <p className="text-gray-700 whitespace-normal">{card.description}</p>
        </Card>
      ))}
    </div>
  );
};

export default InfoCards;
