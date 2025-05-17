import React from "react";
import { Button, Empty, Table, Typography, InputNumber, message } from "antd";
import Link from "next/link";
import { DeleteOutlined } from "@ant-design/icons";
import { useCart } from "@/app/contexts/CartContext";
import Image from "next/image";
import { useBalance } from "@/app/hooks/useBalance";
import { toast } from "react-toastify";

const { Text } = Typography;

// Define types
export interface CartItem {
  id: string;
  name: string;
  price: number;
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
const CartDrawerContent: React.FC<CartDrawerContentProps> = ({ setCartDrawerVisible }) => {
  const { items, totalItems, updateItem, removeItem } =
    useCart() as CartContextType;
  const { balance, loading, refreshBalance } = useBalance();

  // Calculate total price
  const totalPrice = items.reduce((sum, item) => {
    const priceString = String(item.price); // Ensure price is treated as a string
    const numericPrice = parseFloat(priceString.replace(/,/g, "")); // Remove commas and convert to number
    return sum + numericPrice * item.quantity;
  }, 0);

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Empty
          description="Giỏ hàng của bạn đang trống"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Link href="/danh-muc">
          <Button type="primary" className="mt-4">
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
          <Text>{record.name}</Text>
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
              width={50}
              height={50}
              src={record.image}
              alt={record.name}
              style={{
                objectFit: "cover",
                marginRight: 12
              }}
            />
          ) : (
            <div
              style={{
                width: 50,
                height: 50,
                background: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12
              }}
            >
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
        <Text>{record.price.toLocaleString("vi-VN")}đ</Text>
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
        />
      )
    }
  ];
  const handleCheckoutClick = () => {
    if (balance && balance < totalPrice) {
      toast.warn('Số dư của bạn không đủ')
      return
    }
    if (typeof window !== "undefined") {
      window.location.href = "/thanh-toan";
    }
    setCartDrawerVisible(false);
  };
  return (
    <div className="flex flex-col h-full">
      <Table
        columns={columns}
        dataSource={items.map((item) => ({ ...item, key: item.id }))}
        pagination={false}
        size="small"
      />

      <div className="mt-auto pt-4 border-t">
        <div className="flex justify-between mb-2">
          <Text>Tổng số sản phẩm:</Text>
          <Text strong>{totalItems}</Text>
        </div>
        <div className="flex justify-between mb-4">
          <Text>Tổng tiền:</Text>
          <Text strong className="text-lg text-red-500">
            {totalPrice.toLocaleString("vi-VN")}đ
          </Text>
        </div>
        <div className="flex justify-end">
          <Button type="primary" size="large" onClick={handleCheckoutClick}>
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawerContent;
