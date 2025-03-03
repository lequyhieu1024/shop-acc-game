import { Card } from "antd";
import { RightOutlined } from "@ant-design/icons";
import image from "../../../../public/client/images/image.jpg";
import Image from "next/image";

const services = [
  {
    id: 1,
    title: "Bán Gems - Unit Toilet Tower Defense",
    image: image,
    transactions: 251
  },
  {
    id: 2,
    title: "Bán Item Anime Defenders",
    image: image,
    transactions: 1413
  },
  {
    id: 3,
    title: "Mua Gamepass Blox Fruits",
    image: image,
    transactions: 3359
  },
  {
    id: 4,
    title: "Bán Trái Ác Quỷ Rương",
    image: image,
    transactions: 23513
  },
  {
    id: 5,
    title: "Dịch Vụ Blade Ball",
    image: image,
    transactions: 6363
  }
];

const RobloxServices = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold flex items-center">🎮 Dịch vụ Roblox</h2>
      <a href="#" className="text-blue-500 flex items-center text-sm">
        Xem tất cả <RightOutlined className="ml-1" />
      </a>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {services.map((service) => (
        <Card
          key={service.id}
          hoverable
          className="border border-pink-300 rounded-lg overflow-hidden"
          cover={
            <div className="h-[150px] bg-gray-100 relative">
              <Image
                height={100}
                width={100}
                src={service.image.src}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          }
        >
          <h3 className="text-sm font-medium mb-1">{service.title}</h3>
          <p className="text-xs text-gray-500">
            Giao dịch: {service.transactions.toLocaleString()}
          </p>
        </Card>
      ))}
    </div>
  </div>
);

export default RobloxServices;
