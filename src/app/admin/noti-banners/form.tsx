"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/services/axiosService";
import Image from "next/image";
import Loading from "@/components/Loading";
import Link from "next/link";
import { INotificationBanner } from "@/app/interfaces/INotificationBanner";

interface BannerEditProps {
  isEditing?: boolean;
  initialData?: INotificationBanner | null;
}

export default function NotificationBannerForm({
  isEditing = false,
  initialData = null
}: BannerEditProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_active: "1",
    start_time: "",
    end_time: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const convertToDateTimeLocal = (isoString: string) => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // "yyyy-MM-ddTHH:mm"
  };
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        is_active: initialData.is_active ? "1" : "0",
        start_time: initialData.start_time ? convertToDateTimeLocal(initialData.start_time) : "",
        end_time: initialData.end_time ? convertToDateTimeLocal(initialData.end_time) : ""
      });
      if (initialData.image_url) {
        setPreviewImage(initialData.image_url);
      }
    }
    setLoading(false);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (selectedFile) data.append("image_url", selectedFile);

    try {
      let response;
      if (isEditing && initialData) {
        response = await api.patch(`/noti-banners/${initialData.id}`, data);
      } else {
        response = await api.post("/noti-banners", data);
      }

      if (response.status === 200) {
        sessionStorage.setItem("message", `Banner ${isEditing ? "đã cập nhật" : "tạo"} thành công!`);
        router.push("/admin/noti-banners");
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
                <h5 className="mb-4">
                  {isEditing ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
                </h5>
                <form onSubmit={handleSubmit} className="theme-form">
                  <div className="mb-3">
                    <label className="form-label">Tiêu đề</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nội dung</label>
                    <textarea
                      className="form-control"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Trạng thái</label>
                    <select
                      className="form-control"
                      name="is_active"
                      value={formData.is_active}
                      onChange={handleChange}
                    >
                      <option value="1">Hoạt động</option>
                      <option value="0">Không hoạt động</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Thời gian bắt đầu</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Thời gian kết thúc</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ảnh banner</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {previewImage && (
                      <div className="mt-2">
                        <Image
                          src={previewImage}
                          alt="Banner"
                          width={200}
                          height={150}
                          style={{ maxHeight: 150, maxWidth: "100%", objectFit: "cover" }}
                        />
                      </div>
                    )}
                  </div>

                  {message && <p className="text-danger">{message}</p>}

                  <div className="d-flex gap-3">
                    <button type="submit" className="btn btn-solid">
                      {isEditing ? "Cập nhật" : "Tạo"}
                    </button>
                    <Link href="/admin/noti-banners" className="btn btn-warning">
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
