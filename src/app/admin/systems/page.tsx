"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/(admin)/Error";
import { toast } from "react-toastify";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(1, "Tên website phải có ít nhất 1 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  youtube: z.string().url("Link Youtube không hợp lệ").optional(),
  facebook: z.string().url("Link Facebook không hợp lệ").optional(),
  tiktok: z.string().url("Link Tiktok không hợp lệ").optional()
});

type FormData = z.infer<typeof formSchema>;

export default function System() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [fileReading, setFileReading] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("system");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileReading(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const changeToEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value as string);
      });

      if (selectedFile) {
        formData.append("logo", selectedFile);
      }

      const response = await api.patch("systems", formData);
      if (response.status === 200) {
        setError(false);
      } else {
        setError(true);
      }
      showMessage(response.status);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      setError(true);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/systems");
      console.log(response);
      
      if (response.status === 200) {
        const systemData = response.data.system;
        setValue("name", systemData.name);
        setValue("phone", systemData.phone);
        setValue("email", systemData.email);
        setValue("youtube", systemData.youtube);
        setValue("facebook", systemData.facebook);
        setValue("tiktok", systemData.tiktok);
        setFileReading(systemData.logo);
        setError(false);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
      console.log((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showMessage = (status: number) => {
    const message =
      status === 200
        ? "Cập nhật thông tin thành công"
        : "Cập nhật thông tin thất bại";
    if (status === 200) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return loading ? (
    <Loading />
  ) : error ? (
    <ErrorPage />
  ) : (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <ul className="nav nav-pills mb-5" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "system" ? "active" : ""}`}
                onClick={() => setActiveTab("system")}
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
              >
                Cập nhật hệ thống
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "password" ? "active" : ""
                }`}
                onClick={() => setActiveTab("password")}
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
              >
                Cập nhật mật khẩu
              </button>
            </li>
          </ul>
          {activeTab === "system" ? (
            <div className="card-body">
              <form
                className="theme-form theme-form-2 mega-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="row">
                  <div className="col-md-6">
                    <label className="col-form-label">Logo website</label>
                    <input
                      className="form-control"
                      onChange={handleFileChange}
                      disabled={!isEditing}
                      type="file"
                    />
                    {fileReading && (
                      <div className="mt-4 mb-5">
                        <Image
                          height={100}
                          width={100}
                          src={
                            fileReading ??
                            "/admin/assets/images/placeholder.png"
                          }
                          alt="Logo"
                          style={{ maxWidth: "300px", maxHeight: "250px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Tên website</label>
                  <input
                    className="form-control"
                    type="text"
                    disabled={!isEditing}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-danger">{errors.name.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    className="form-control"
                    type="text"
                    disabled={!isEditing}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-danger">{errors.phone.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    disabled={!isEditing}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-danger">{errors.email.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label">Link Youtube</label>
                  <input
                    className="form-control"
                    type="text"
                    disabled={!isEditing}
                    {...register("youtube")}
                  />
                  {errors.youtube && (
                    <p className="text-danger">{errors.youtube.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label">Link Fan page</label>
                  <input
                    className="form-control"
                    type="text"
                    disabled={!isEditing}
                    {...register("facebook")}
                  />
                  {errors.facebook && (
                    <p className="text-danger">{errors.facebook.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label">Link Tiktok</label>
                  <input
                    className="form-control"
                    type="text"
                    disabled={!isEditing}
                    {...register("tiktok")}
                  />
                  {errors.tiktok && (
                    <p className="text-danger">{errors.tiktok.message}</p>
                  )}
                </div>

                {isEditing ? (
                  <button type="submit" className="mt-3 btn btn-primary">
                    Lưu thay đổi
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={changeToEdit}
                    className="mt-3 btn btn-warning"
                  >
                    Chỉnh sửa thông tin
                  </button>
                )}
              </form>
            </div>
          ) : (
            <div className="card-body">
              <form className="theme-form theme-form-2 mega-form">
                <div className="row">
                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-sm-2 mb-0">
                      Mật khẩu cũ
                    </label>
                    <div className="col-sm-10">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Enter Your Old Password"
                      />
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-sm-2 mb-0">
                      Mật khẩu mới
                    </label>
                    <div className="col-sm-10">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Enter Your New Password"
                      />
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-sm-2 mb-0">
                      Xác nhận mật khẩu
                    </label>
                    <div className="col-sm-10">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Enter Your Confirm Password"
                      />
                    </div>
                  </div>
                </div>
                <button className={`mt-3 btn btn-primary`}>Cập nhật</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
