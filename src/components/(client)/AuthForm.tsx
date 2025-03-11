"use client";

import { useState } from "react";
import { Button, Form, Input } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import Image from "next/image";

const AuthForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    console.log("Success:", values);
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-100 flex flex-col md:flex-row rounded-2xl shadow-lg max-w-3xl p-5 items-center w-full">
        {/* Form Container */}
        <div className="md:w-1/2 px-8 md:px-16 w-full">
          <h2 className="font-bold text-2xl text-[#002D74] text-center md:text-left">
            Login
          </h2>
          <p className="text-xs mt-2 text-[#002D74] text-center md:text-left">
            If you are already a member, easily log in
          </p>

          <Form
            layout="vertical"
            onFinish={onFinish}
            className="flex flex-col gap-4 mt-6"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input
                size="large"
                placeholder="Email"
                prefix={<MailOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" }
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Password"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-[#002D74] hover:scale-105 duration-300 w-full text-white"
              size="large"
            >
              Login
            </Button>
          </Form>

          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>

          <Button
            icon={<GoogleOutlined />}
            className="border w-full rounded-xl mt-5 flex justify-center items-center text-[#002D74] hover:scale-105 duration-300"
            size="large"
          >
            Login with Google
          </Button>

          <div className="mt-5 text-xs border-b border-[#002D74] py-4 text-center text-[#002D74]">
            <a href="#">Forgot your password?</a>
          </div>

          <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
            <p>Don't have an account?</p>
            <Button
              type="default"
              className="border px-5 rounded-xl hover:scale-110 duration-300"
            >
              Register
            </Button>
          </div>
        </div>

        {/* Image */}
        {/* <div className="md:block hidden w-1/2">
          <Image
            className="rounded-2xl"
            src="dgfjd"
            alt="Auth Image"
            width={400}
            height={400}
          />
        </div> */}
      </div>
    </section>
  );
};

export default AuthForm;
