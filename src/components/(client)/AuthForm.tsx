"use client";
import { useState } from "react";
import { Button, Input, Tabs } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { FaRegCircleUser } from "react-icons/fa6";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface AuthProps {
  tab: string;
}

const validationSchema = yup.object().shape({
  username: yup.string().required("Vui lòng nhập tên đăng nhập!"),
  password: yup
      .string()
      .min(6, "Mật khẩu ít nhất 6 ký tự")
      .required("Vui lòng nhập mật khẩu!"),
  referral_code: yup.string().when("$isRegister", {
    is: true,
    then: (schema) => schema.optional(),
  }),
});

const AuthForm: React.FC<AuthProps> = ({ tab }) => {
  const [activeTab, setActiveTab] = useState(tab);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (values: {
    username: string;
    password: string;
    referral_code?: string;
    action: string;
  }) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
        referral_code: activeTab === "register" ? values.referral_code || undefined : undefined,
        action: activeTab, // Gửi action (login/register)
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        router.push("/");
        if (activeTab === "register") {
          toast.success("Đăng ký thành công, đã đăng nhập");
        } else {
          toast.success("Đăng nhập thành công");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Lỗi xảy ra");
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
                { key: "register", label: "Đăng ký" },
              ]}
          />

          <Formik
              initialValues={{
                username: "",
                password: "",
                referral_code: "",
                action: activeTab, // Thêm action vào initialValues
              }}
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}
              context={{ isRegister: activeTab === "register" }}
              onSubmit={(values) => {
                handleSubmit({ ...values, action: activeTab });
              }}
          >
            {({ handleSubmit }) => (
                <FormikForm
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 mt-6"
                >
                  {/* Hidden Action Field */}
                  <Field type="hidden" name="action" value={activeTab} />

                  {/* Username Field */}
                  <label className="font-medium">Tên đăng nhập</label>
                  <Field
                      as={Input}
                      name="username"
                      size="large"
                      placeholder="Tên đăng nhập"
                      prefix={<FaRegCircleUser />}
                  />
                  <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                  />

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

                  {/* Referral Code Field (only in Register) */}
                  {activeTab === "register" && (
                      <>
                        <label className="font-medium">Mã giới thiệu (tùy chọn)</label>
                        <Field
                            as={Input}
                            name="referral_code"
                            size="large"
                            placeholder="Mã giới thiệu"
                            prefix={<MailOutlined />}
                        />
                        <ErrorMessage
                            name="referral_code"
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

                  {/* Error/Success Message */}
                  {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
                  {success && (
                      <div className="text-green-500 text-xs mt-1">
                        {activeTab === "login" ? "Đăng nhập thành công!" : "Đăng ký thành công!"}
                      </div>
                  )}
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