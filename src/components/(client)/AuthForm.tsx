"use client";
import { useState } from "react";
import { Button, Input, Form, Tabs } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";

type AuthInputProps = {
  name: string;
  placeholder: string;
  type?: "text" | "password";
  rules?: object[];
  label?: string;
};

const AuthInput: React.FC<AuthInputProps> = ({ name, placeholder, type = "text", rules, label }) => (
  <Form.Item name={name} rules={rules} label={label} >
    {type === "password" ? (
      <Input.Password size="large" placeholder={placeholder} prefix={<LockOutlined />} />
    ) : (
      <Input size="large" placeholder={placeholder} prefix={<MailOutlined />} />
    )}
  </Form.Item>
);

const AuthForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      console.log("Submitted: ", values);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="relative w-96 bg-white ring-8 ring-gray-100 border border-gray-200 rounded-xl overflow-hidden p-6">
        <h2 className="font-bold text-2xl text-[#002D74] text-center">
          {activeTab === "login" ? "Đăng nhập" : "Đăng ký"}
        </h2>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          className="border-b"
          items={[
            { key: "login", label: "Đăng nhập" },
            { key: "register", label: "Đăng ký" }
          ]}
        />

        <div id="form-wrapper" className="transition-all duration-500 ease-in-out" >
          <Form id={`${activeTab}-form`} layout="vertical" onFinish={onFinish} className="flex flex-col gap-4 mt-6">
            <AuthInput name="email" placeholder="Email" rules={[{ required: true, message: "Vui lòng không để trống!" }]} label="Email/Sđt"/>
            <AuthInput name="password" placeholder="Password" type="password" rules={[{ required: true, message: "Vui lòng không để trống!" }]} label="Mật khẩu"/>
            {activeTab === "register" && (
              <AuthInput name="confirm-password" placeholder="Nhập lại mật khẩu" label="Nhập lại mật khẩu" type="password" rules={[{ required: true, message: "Vui lòng không để trống!" }]} />
            )}
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-[#002D74] hover:scale-105 duration-300 w-full text-white"
              size="large"
            >
              {activeTab === "login" ? "Đăng nhập" : "Đăng ký"}
            </Button>
          </Form>
          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">Hoặc</p>
            <hr className="border-gray-400" />
          </div>
          <Button
            icon={<GoogleOutlined />}
            className="border w-full rounded-xl mt-5 flex justify-center items-center text-[#002D74] hover:scale-105 duration-300"
            size="large"
          >
            Đăng nhập với Google
          </Button>
          <div className="mt-5 text-xs border-b border-[#002D74] py-4 text-center text-[#002D74]">
            <a href="#">Quên mật khẩu?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;