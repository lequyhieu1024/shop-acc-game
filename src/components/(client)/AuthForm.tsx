"use client";
import { useState } from "react";
import { Button, Input, Tabs } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { FaRegCircleUser } from "react-icons/fa6";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as yup from "yup";
import api from "@/app/services/axiosService";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng không để trống!"),
  fullName: yup.string().when("$isRegister", {
    is: true,
    then: (schema) => schema.required("Vui lòng nhập họ tên!")
  }),
  password: yup
    .string()
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ in hoa")
    .matches(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .matches(/\d/, "Mật khẩu phải có ít nhất 1 số")
    .matches(/[@$!%*?&]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt")
    .required("Vui lòng nhập mật khẩu!"),
  confirmPassword: yup.string().when("$isRegister", {
    is: true,
    then: (schema) =>
      schema
        .oneOf([yup.ref("password")], "Mật khẩu nhập lại không khớp")
        .required("Vui lòng nhập lại mật khẩu!")
  })
});

const AuthForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (values: {
    email: string;
    fullName?: string;
    password: string;
  }) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      let response;

      if (activeTab === "login") {
        // Gửi request đăng nhập
        response = await api.post("/api/auth/login", {
          email: values.email,
          password: values.password
        });
      } else {
        // Gửi request đăng ký
        response = await api.post("/api/auth/register", {
          email: values.email,
          fullName: values.fullName,
          password: values.password,
          is_active: true
        });
      }

      console.log("Success:", response.data);

      if (activeTab === "login") {
        localStorage.setItem("access_token", response.data.tokens.access_token);
        localStorage.setItem(
          "refresh_token",
          response.data.tokens.refresh_token
        );
      }

      setSuccess(true);
    } catch (error: any) {
      setError(error.response?.data?.message || "Lỗi xảy ra");
    } finally {
      setLoading(false);
    }
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

        <Formik
          initialValues={{
            email: "",
            fullName: "",
            password: "",
            confirmPassword: ""
          }}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          context={{ isRegister: activeTab === "register" }}
          onSubmit={(values, { setSubmitting }) => {
            setLoading(true);
            setTimeout(() => {
              handleSubmit(values);
            }, 2000);
          }}
        >
          {({ handleSubmit }) => (
            <FormikForm
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-6"
            >
              {/* Email Field */}
              <label className="font-medium">Email/Sđt</label>
              <Field
                as={Input}
                name="email"
                size="large"
                placeholder="Email"
                prefix={<MailOutlined />}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs mt-1"
              />

              {/* Full Name Field (only in Register) */}
              {activeTab === "register" && (
                <>
                  <label className="font-medium">Nhập họ tên</label>
                  <Field
                    as={Input}
                    name="fullName"
                    size="large"
                    placeholder="Nhập họ tên"
                    prefix={<FaRegCircleUser />}
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </>
              )}

              {/* Password Field */}
              <label className="font-medium">Mật khẩu</label>
              <Field
                as={Input.Password}
                name="password"
                size="large"
                placeholder="Mật khẩu"
                prefix={<LockOutlined />}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-xs mt-1"
              />

              {/* Confirm Password Field (only in Register) */}
              {activeTab === "register" && (
                <>
                  <label className="font-medium">Nhập lại mật khẩu</label>
                  <Field
                    as={Input.Password}
                    name="confirmPassword"
                    size="large"
                    placeholder="Nhập lại mật khẩu"
                    prefix={<LockOutlined />}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </>
              )}

              {/* Submit Button */}
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-[#002D74] hover:scale-105 duration-300 w-full text-white"
                size="large"
              >
                {activeTab === "login" ? "Đăng nhập" : "Đăng ký"}
              </Button>
            </FormikForm>
          )}
        </Formik>

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
  );
};

export default AuthForm;
