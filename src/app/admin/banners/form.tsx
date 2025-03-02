"use client";
import React, { useState, useEffect } from "react";
import api from "@/app/services/axiosService";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import Link from "next/link";
import { IBanner } from "@/app/interfaces/IBanner";
import Image from "next/image";

interface BannerEditProps {
  isEditing?: boolean;
  initialData?: IBanner | null;
}

export default function BannerForm({
  initialData = null,
  isEditing = false
}: BannerEditProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ is_active: "1" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [fileReading, setFileReading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialData) {
      setFormData({ is_active: initialData.is_active ? "1" : "0" });
      if (initialData.image_url) {
        setFileReading(initialData.image_url);
      }
    }
    setLoading(false);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!isEditing && !selectedFile) {
      setMessage("Vui lòng nhập ảnh.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("is_active", formData.is_active);
    if (selectedFile) data.append("image_url", selectedFile);

    try {
      let response;
      if (isEditing && initialData) {
        response = await api.patch(`banners/${initialData.id}`, data);
      } else {
        response = await api.post("banners", data);
      }

      if (response.status === 200) {
        sessionStorage.setItem(
          "message",
          `Banner đã được ${isEditing ? "cập nhật" : "tạo"} thành công!`
        );
        router.push("/admin/banners");
      } else {
        setMessage("Có lỗi xảy ra, thử lại.");
      }
    } catch {
      setMessage("Lỗi khi gửi dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="row">
      <div className="col-12">
        <div className="row">
          <div className="col-sm-8 m-auto">
            <div className="card">
              <div className="card-body">
                <div className="card-header-2">
                  <h5>
                    {isEditing ? "Chỉnh sửa danh mục" : "Thông tin danh mục"}
                  </h5>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="theme-form theme-form-2 mega-form"
                >
                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-sm-3 mb-0">
                      Trạng thái
                    </label>
                    <div className="col-sm-9">
                      <select
                        className="form-control"
                        onChange={handleChange}
                        name="is_active"
                      >
                        <option selected={formData.is_active === "1"} value="1">
                          Hoạt động
                        </option>
                        <option selected={formData.is_active === "0"} value="0">
                          Không hoạt động
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="col-sm-3 col-form-label form-label-title">
                      Ảnh danh mục
                    </label>
                    <div className="col-sm-9">
                      <input
                        className="form-control form-choose"
                        name="image"
                        type="file"
                        onChange={handleFileChange}
                      />
                      <div>
                        {message && (
                          <p className="mt-3 text-danger">{message}</p>
                        )}
                      </div>
                      {fileReading && (
                        <div className="mt-2">
                          <Image
                            src={fileReading}
                            alt="Banner"
                            style={{ maxWidth: "200px", maxHeight: "150px" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 d-flex gap-2 col-sm-12 col-md-6 justify-content-center">
                    <button type="submit" className="btn btn-solid flex-grow-1">
                      {isEditing ? "Cập nhật" : "Lưu"}
                    </button>
                    <Link
                      href="/admin/banners"
                      className="btn btn-warning flex-grow-1"
                    >
                      Trở lại
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
