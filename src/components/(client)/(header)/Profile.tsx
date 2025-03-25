"use client";

import { useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Button, Form as AntForm, Col, Input, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import FormSingleFile from "@/app/share/form/FormSingleFile";

// Interface định nghĩa kiểu dữ liệu của user
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  gender: string;
  dob: string;
}

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    gender: "male",
    dob: "",
  });

  // Validation Schema với Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
    address: Yup.string().required("Address is required"),
    gender: Yup.string().oneOf(["male", "female", "other"], "Invalid gender"),
    dob: Yup.date().required("Date of Birth is required"),
  });

  const handleSubmit = (values: UserProfile) => {
    setUser(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg p-6 shadow-md rounded-lg bg-white">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Formik
            initialValues={user}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, setFieldValue, errors }) => (
              <AntForm layout="vertical" onFinish={handleSubmit} className="flex flex-col items-center">
                {/* Avatar Upload */}
                <Col xs={24} sm={24} md={12} xl={12}>
                  <FormSingleFile
                    error={errors.avatar}
                    value={values.avatar}
                    onChange={(e: any) => setFieldValue("avatar", e)}
                  />
                </Col>

                {/* Thông tin cá nhân */}
                <div className="w-full mt-5 space-y-4">
                  {["name", "email", "phone", "address"].map((field) => (
                    <AntForm.Item key={field} label={field.charAt(0).toUpperCase() + field.slice(1)}>
                      <div className="relative">
                        <Tooltip title={`Edit ${field}`} placement="top">
                          <EditOutlined className="absolute right-3 top-3 text-gray-500 cursor-pointer" />
                        </Tooltip>
                        <Field
                          as={Input}
                          name={field}
                          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        />
                        <ErrorMessage name={field} component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </AntForm.Item>
                  ))}
                </div>

                {/* Giới tính */}
                <AntForm.Item label="Giới tính">
                  <div className="flex gap-4">
                    {["male", "female", "other"].map((option) => (
                      <label key={option}>
                        <Field type="radio" name="gender" value={option} />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </label>
                    ))}
                  </div>
                  <ErrorMessage name="gender" component="div" className="text-red-500 text-xs mt-1" />
                </AntForm.Item>

                {/* Ngày sinh */}
                <AntForm.Item label="Ngày sinh">
                  <Field type="date" name="dob" className="w-full p-2 border rounded" />
                  <ErrorMessage name="dob" component="div" className="text-red-500 text-xs mt-1" />
                </AntForm.Item>

                {/* Button Save */}
                <Button type="primary" htmlType="submit" loading={isSubmitting} className="w-full mt-5">
                  Save Changes
                </Button>
              </AntForm>
            )}
          </Formik>
        )}
      </Card>
    </div>
  );
};

export default Profile;
