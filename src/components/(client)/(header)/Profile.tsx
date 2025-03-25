"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Avatar, Tooltip, Input, Button, Form as AntForm, Upload, Col } from "antd";
import { EditOutlined, CameraOutlined, UploadOutlined } from "@ant-design/icons";
import FormUploadFile from "@/app/share/form/FormUploadFile";
import FormSingleFile from "@/app/share/form/FormSingleFile";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "Duy Tran",
    email: "duytran@example.com",
    phone: "0987654321",
    address: "Ho Chi Minh, Vietnam",
    avatar: "/avatar.jpg",
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
    address: Yup.string().required("Address is required"),
  });

  const handleSubmit = (values: any) => {
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
            {({ values,isSubmitting, setFieldValue }) => (
              <AntForm layout="vertical" onFinish={handleSubmit} className="flex flex-col items-center">
                {/* Avatar với tooltip edit */}
                <Col xs={24} sm={24} md={8} xl={8}>
                  <FormSingleFile
                   
                    isMultiple={false}
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

                {/* Button Save */}
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="w-full mt-5"
                >
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
