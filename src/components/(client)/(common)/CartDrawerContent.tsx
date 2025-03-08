import React from "react";
import { Button, Empty, List, Typography, InputNumber, Space } from "antd";
import Link from "next/link";
import { DeleteOutlined } from "@ant-design/icons";
import { useCart, CartItem } from "@/app/contexts/CartContext";

const { Text } = Typography;

const CartDrawerContent: React.FC = () => {
  const { items, totalItems, updateItem, removeItem } = useCart();

  // Calculate total price
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Empty
          description="Giỏ hàng của bạn đang trống"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Link href="/products">
          <Button type="primary" className="mt-4">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item: CartItem) => (
          <List.Item
            actions={[
              <Button
                key="delete"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeItem(item.id)}
              />
            ]}
          >
            <List.Item.Meta
              avatar={
                item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    Ảnh
                  </div>
                )
              }
              title={item.name}
              description={
                <div>
                  <Text className="block">
                    {item.price.toLocaleString("vi-VN")}đ
                  </Text>
                  <Space className="mt-2">
                    <Text>Số lượng:</Text>
                    <InputNumber
                      min={1}
                      max={99}
                      value={item.quantity}
                      onChange={(value) => updateItem(item.id, value || 1)}
                      size="small"
                    />
                  </Space>
                </div>
              }
            />
          </List.Item>
        )}
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
      </div>
    </div>
  );
};

export default CartDrawerContent;
