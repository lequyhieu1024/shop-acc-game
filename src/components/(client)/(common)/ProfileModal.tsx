"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useSession } from "next-auth/react";
import { User } from "@/app/models/entities/User";
import {toast} from "react-toastify";

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>({});

  useEffect(() => {
    if (visible && session?.user) {
      // Fetch user data when modal opens
      fetchUserData();
    }
  }, [visible, session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/clients/profile');
      if (!response.ok) throw new Error('Failed to fetch profile data');
      const data = await response.json();
      setUserData(data);
      form.setFieldsValue(data);
    } catch {
      message.error('Không thể tải thông tin người dùng');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/clients/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast.success('Cập nhật thông tin thành công');
      await update();
      onClose();
    } catch {
      toast.error('Cập nhật thông tin thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thông tin cá nhân"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="profile-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={userData}
        className="mt-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Mã người dùng"
            name="user_code"
            rules={[{ required: true, message: 'Vui lòng nhập mã người dùng' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Mã giới thiệu"
            name="referral_code"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Số dư tài khoản"
            name="balance"
            className="col-span-2"
          >
            <Input disabled prefix="₫" />
          </Form.Item>

          <Form.Item
            label="Số lần rút miễn phí"
            name="number_of_free_draw"
            className="col-span-2"
          >
            <Input disabled />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProfileModal; 