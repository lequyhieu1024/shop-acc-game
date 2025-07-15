import React from "react";
import { Button, Empty, Table, Typography, InputNumber } from "antd";
import Link from "next/link";
import { DeleteOutlined } from "@ant-design/icons";
import { useCart } from "@/app/contexts/CartContext";
import Image from "next/image";
import {convertToInt} from "@/app/helpers/common";

const { Text } = Typography;

// Define types
export interface CartItem {
  id: string;
  name: string;
  sale_price: number;
  regular_price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}
interface CartDrawerContentProps {
  setCartDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const CartDrawerContent: React.FC<CartDrawerContentProps> = ({ setCartDrawerVisible })=> {
  const { items, totalItems, updateItem, removeItem } =
    useCart() as CartContextType;

  // Calculate total price
  const totalPrice = items.reduce((sum, item) => {
    const priceString = String(item.sale_price); // Ensure price is treated as a string
    const numericPrice = parseFloat(priceString.replace(/,/g, "")); // Remove commas and convert to number
    return sum + numericPrice * item.quantity;
  }, 0);

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
        <Empty
          description={
            <span className="text-white text-lg font-medium">Giỏ hàng của bạn đang trống</span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          imageStyle={{ filter: "invert(1)" }}
        />
        <Link href="/danh-muc">
          <Button 
            type="primary" 
            className="mt-6 h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:from-purple-700 hover:to-blue-700 text-base font-bold"
          >
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: CartItem) => (
        <div className="flex items-center">
          <Text className="text-white font-medium">{record.name}</Text>
        </div>
      )
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: CartItem) => (
        <div className="flex items-center">
          {record.image ? (
            <Image
              width={60}
              height={60}
              src={record.image}
              alt={record.name}
              className="rounded-lg object-cover border border-purple-500/20"
            />
          ) : (
            <div className="w-[60px] h-[60px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-purple-500/20 flex items-center justify-center text-gray-400">
              Ảnh
            </div>
          )}
        </div>
      )
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: CartItem) => (
        <Text className="text-purple-400 font-medium">{convertToInt(record.sale_price)}đ</Text>
      )
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: CartItem) => (
        <InputNumber
          min={1}
          max={99}
          value={record.quantity}
          onChange={(value: number | null) => updateItem(record.id, value || 1)}
          size="small"
          className="cart-input-number"
          controls={false}
          style={{
            background: "linear-gradient(to bottom right, #1a1a2e, #16213e)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            borderRadius: "8px",
            color: "white",
            width: "80px"
          }}
        />
      )
    },
    {
      title: "Thao tác",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.id)}
          className="hover:bg-red-500/10 rounded-lg"
        />
      )
    }
  ];
  const handleCheckoutClick = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/thanh-toan";
    }
    setCartDrawerVisible(false);
  };
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <style jsx global>{`
        .ant-table {
          background: transparent !important;
        }
        .ant-table-thead > tr > th {
          background: linear-gradient(to bottom right, #1a1a2e, #16213e) !important;
          color: white !important;
          border-bottom: 1px solid rgba(139, 92, 246, 0.2) !important;
        }
        .ant-table-tbody > tr > td {
          background: transparent !important;
          border-bottom: 1px solid rgba(139, 92, 246, 0.1) !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: rgba(139, 92, 246, 0.1) !important;
        }
        .cart-input-number input {
          color: white !important;
          text-align: center;
        }
        .cart-input-number:hover, .cart-input-number:focus {
          border-color: rgba(139, 92, 246, 0.5) !important;
        }
      `}</style>

      <Table
        columns={columns}
        dataSource={items.map((item) => ({ ...item, key: item.id }))}
        pagination={false}
        size="small"
        className="cart-table"
      />

      <div className="mt-auto pt-6 border-t border-purple-500/20 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-t-xl">
        <div className="flex justify-between mb-3">
          <Text className="text-gray-400">Tổng số sản phẩm:</Text>
          <Text className="text-white font-bold">{totalItems}</Text>
        </div>
        <div className="flex justify-between mb-6">
          <Text className="text-gray-400">Tổng tiền:</Text>
          <Text className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {convertToInt(totalPrice)}đ
          </Text>
        </div>
        <div className="flex justify-end">
          <Button 
            type="primary" 
            size="large" 
            onClick={handleCheckoutClick}
            className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:from-purple-700 hover:to-blue-700 text-base font-bold"
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawerContent;
