"use client";
import React, { useEffect, useState } from "react";
import { ICategory } from "@/app/interfaces/ICategory";
import { generateVoucherCode } from "@/app/services/commonService";
import { IProduct } from "@/app/interfaces/IProduct";
import { IProductImage } from "@/app/interfaces/IProductImage";
import api from "@/app/services/axiosService";
import { toast } from "react-toastify";
import Image from "next/image";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/(admin)/Error";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductFormProps {
  isEditing?: boolean;
  initialData?: IProduct | null;
}

export default function ProductForm({
  isEditing = false,
  initialData = null
}: ProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<IProduct>({
    id: initialData?.id || 0,
    code: initialData?.code || "",
    name: initialData?.name || "",
    thumbnail: initialData?.thumbnail || null,
    description: initialData?.description || "",
    regular_price: initialData?.regular_price || 0,
    sale_price: initialData?.sale_price || 0,
    skin_type: initialData?.skin_type || "",
    is_infinity_card: initialData?.is_infinity_card ?? false,
    account_id: initialData?.account_id || "",
    account_name: initialData?.account_name || "",
    register_by: initialData?.register_by || "",
    rank: initialData?.rank || "",
    server: initialData?.server || "",
    number_diamond_available: initialData?.number_diamond_available || 0,
    status: initialData?.status || "active",
    is_for_sale: initialData?.is_for_sale ?? true,
    category_id: initialData?.category_id || 0,
    quantity: initialData?.quantity || 0,
    images: initialData?.images || [],
    created_at: initialData?.created_at || "",
    updated_at: initialData?.updated_at || "",
    deleted_at: initialData?.deleted_at || null
  });

  const [fileReading, setFileReading] = useState<string | null>(
    initialData?.thumbnail && typeof initialData.thumbnail === "string"
      ? initialData.thumbnail
      : null
  );

  const [imagesReading, setImagesReading] = useState<IProductImage[]>(
    initialData?.images && Array.isArray(initialData.images)
      ? initialData.images.map((img) => ({
          id: (img as IProductImage).id || 0,
          image_url: (img as IProductImage).image_url || "",
          product_id: (img as IProductImage).product_id || 0
        }))
      : []
  );

  const [deletedImages, setDeletedImages] = useState<number[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<ICategory[] | []>([]);

  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim())
      newErrors.name = "Tên sản phẩm không được để trống";
    if (!formData.code.trim())
      newErrors.code = "Mã tài khoản không được để trống";
    if (!formData.thumbnail && !isEditing)
      newErrors.thumbnail = "Vui lòng chọn ảnh thumbnail";
    if (!formData.skin_type.trim())
      newErrors.skin_type = "Loại súng không được để trống";
    if (formData.regular_price <= 0)
      newErrors.regular_price = "Vui lòng nhập giá bán cart";
    if (formData.sale_price <= 0)
      newErrors.sale_price = "Vui lòng nhập giá bán atm";
    if (formData.number_diamond_available! < 0)
      newErrors.number_diamond_available = "Số kim cương không được nhỏ hơn 0";
    if (formData.quantity <= 0) newErrors.quantity = "Số lượng phải lớn hơn 0";
    if (!formData.register_by.trim())
      newErrors.register_by = "Bắt buộc phải nhập thông tin đăng ký";
    if (formData.category_id === 0)
      newErrors.category_id = "Vui lòng chọn danh mục";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value) || 0
          : value
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      thumbnail: file
    }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFileReading(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({
      ...prev,
      images: files
    }));

    const readFile = (file: File): Promise<IProductImage> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: 0,
            image_url: reader.result as string,
            product_id: formData.id || 0
          });
        };
        reader.readAsDataURL(file);
      });
    };

    const newImages = await Promise.all(files.map((file) => readFile(file)));
    setImagesReading((prev) => [...prev, ...newImages]);
  };

  const autoGenerateCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormData({ ...formData, code: generateVoucherCode() });
  };

  const getCategories = async () => {
    try {
      const response = await api.get("categories/get-list");
      if (response.status === 200) {
        setCategories(response.data.categories || []);
      }
    } catch (e) {
      console.error("error: " + e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // if (!validateForm()) {
    //   toast.error("Vui lòng kiểm tra lại các trường thông tin");
    //   setLoading(false);
    //   return;
    // }

    const data = new FormData();
    data.append("code", formData.code);
    data.append("name", formData.name);
    if (formData.thumbnail && typeof formData.thumbnail !== "string") {
      data.append("thumbnail", formData.thumbnail);
    }
    data.append("description", formData.description || "");
    data.append("regular_price", formData.regular_price.toString());
    data.append("sale_price", formData.sale_price.toString());
    data.append("skin_type", formData.skin_type);
    data.append("is_infinity_card", formData.is_infinity_card.toString());
    data.append("register_by", formData.register_by);
    data.append("rank", formData.rank || "");
    data.append("server", formData.server || "");
    data.append(
      "number_diamond_available",
      formData.number_diamond_available?.toString() || "0"
    );
    data.append("status", formData.status);
    data.append("is_for_sale", formData.is_for_sale.toString());
    data.append("category_id", formData.category_id.toString());
    data.append("quantity", formData.quantity.toString());
    data.append("account_id", formData.account_id || "");
    data.append("account_name", formData.account_name || "");
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại các trường thông tin");
      setLoading(false);
      return;
    }


    if (formData.images && Array.isArray(formData.images)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formData.images.forEach((file: any) => {
        if (file instanceof File) {
          data.append("images", file);
        }
      });
    }

    // Gửi danh sách ID ảnh bị xóa (nếu đang chỉnh sửa)
    if (isEditing && deletedImages.length > 0) {
      data.append("deletedImageIds", JSON.stringify(deletedImages));
    }

    try {
      let response;
      if (isEditing) {
        response = await api.patch(`products/${formData.id}`, data);
      } else {
        response = await api.post(`products`, data);
      }

      if (response.status === 200) {
        toast.success(
          isEditing ? "Cập nhật thành công" : "Thêm mới thành công"
        );
        setError(false);
        if (!isEditing) {
          setFormData({
            id: 0,
            code: "",
            name: "",
            thumbnail: null,
            description: "",
            regular_price: 0,
            sale_price: 0,
            skin_type: "",
            is_infinity_card: false,
            account_id: "",
            account_name: "",
            register_by: "",
            rank: "",
            server: "",
            number_diamond_available: 0,
            status: "active",
            is_for_sale: true,
            category_id: 0,
            quantity: 0,
            images: [],
            created_at: "",
            updated_at: "",
            deleted_at: null
          });
          setFileReading(null);
          setImagesReading([]);
        } else {
          setImagesReading((prev) =>
            prev.filter((img) => !deletedImages.includes(img.id))
          );
          setDeletedImages([]);
          router.push("/admin/products");
        }
      } else {
        setError(true);
        toast.error("Có lỗi server");
      }
    } catch (error) {
      setError(true);
      console.error("Lỗi khi gửi dữ liệu:", error);
      toast.error("Có lỗi xảy ra khi gửi dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : error ? (
    <ErrorPage />
  ) : (
    <div className="row">
      <div className="col-12">
        <div className="row">
          <div className="m-auto">
            <form
              className="theme-form theme-form-2 mega-form"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              {/* Thông tin sản phẩm */}
              <div className="card">
                <div className="card-body">
                  <div className="card-header-2">
                    <h5>Thông tin sản phẩm</h5>
                  </div>
                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Tên sản phẩm
                    </label>
                    <div className="col-md-9">
                      <input
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập tên sản phẩm"
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="col-md-3 col-form-label form-label-title">
                      Mã sản phẩm
                    </label>
                    <div className={isEditing ? "col-md-9" : "col-md-7"}>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        value={formData.code}
                        onChange={handleChange}
                        name="code"
                      />
                      {isEditing && (
                        <small className="text-danger">
                          <i>Không được cập nhật trường này</i>
                        </small>
                      )}
                    </div>
                    <div className={isEditing ? "d-none" : "col-md-2"}>
                      <button
                        className="btn btn-primary"
                        onClick={autoGenerateCode}
                      >
                        Tự động tạo
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Loại skin súng
                    </label>
                    <div className="col-md-9">
                      <input
                        className={`form-control ${
                          errors.skin_type ? "is-invalid" : ""
                        }`}
                        type="text"
                        name="skin_type"
                        value={formData.skin_type}
                        onChange={handleChange}
                        placeholder="Ví dụ: Vip, Vip Pro, Bình thường, ..."
                      />
                      {errors.skin_type && (
                        <div className="invalid-feedback">
                          {errors.skin_type}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Số lượng tài khoản
                    </label>
                    <div className="col-md-9">
                      <input
                        className={`form-control ${
                          errors.quantity ? "is-invalid" : ""
                        }`}
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                      />
                      {errors.quantity && (
                        <div className="invalid-feedback">
                          {errors.quantity}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Trạng thái
                    </label>
                    <div className="col-md-9">
                      <select
                        className="form-control"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Có bán
                    </label>
                    <div className="col-md-9">
                      <label className="switch">
                        <input
                          type="checkbox"
                          name="is_for_sale"
                          checked={formData.is_for_sale}
                          onChange={handleChange}
                        />
                        <span className="switch-state"></span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Danh mục
                    </label>
                    <div className="col-md-9">
                      <select
                        className={`form-control ${
                          errors.category_id ? "is-invalid" : ""
                        }`}
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                      >
                        {categories.length === 0 ? (
                          <option value="" disabled>
                            Chưa có danh mục
                          </option>
                        ) : (
                          <>
                            <option value={0} disabled>
                              Chọn danh mục
                            </option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      {errors.category_id && (
                        <div className="invalid-feedback">
                          {errors.category_id}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mô tả sản phẩm */}
              <div className="card">
                <div className="card-body">
                  <div className="card-header-2">
                    <h5>Mô tả sản phẩm</h5>
                  </div>
                  <div className="row">
                    <label className="form-label-title col-md-3 mb-0">
                      Mô tả
                    </label>
                    <div className="col-md-9">
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Nhập mô tả sản phẩm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hình ảnh sản phẩm */}
              <div className="card">
                <div className="card-body">
                  <div className="card-header-2">
                    <h5>Hình ảnh sản phẩm</h5>
                  </div>
                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Ảnh thumbnail
                    </label>
                    <div className="col-md-9">
                      <input
                        className={`form-control ${
                          errors.thumbnail ? "is-invalid" : ""
                        }`}
                        type="file"
                        name="thumbnail"
                        onChange={handleThumbnailChange}
                        accept="image/*"
                      />
                      {fileReading && (
                        <div className="mt-2">
                          <Image
                            height={120}
                            width={180}
                            src={fileReading}
                            alt="Thumbnail"
                          />
                        </div>
                      )}
                      {errors.thumbnail && (
                        <div className="invalid-feedback">
                          {errors.thumbnail}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Ảnh bổ sung
                    </label>
                    <div className="col-md-9">
                      <input
                        className="form-control"
                        type="file"
                        name="images"
                        onChange={handleImagesChange}
                        accept="image/*"
                        multiple
                      />
                      {imagesReading.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {imagesReading.map((image, index) => (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                opacity: deletedImages.includes(image.id)
                                  ? 0.5
                                  : 1
                              }}
                            >
                              <Image
                                height={100}
                                width={100}
                                src={image.image_url}
                                alt="Ảnh bổ sung"
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "8px"
                                }}
                              />
                              {isEditing &&
                                image.id !== 0 &&
                                !deletedImages.includes(image.id) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeletedImages((prev) => [
                                        ...prev,
                                        image.id
                                      ]);
                                    }}
                                    style={{
                                      position: "absolute",
                                      top: "5px",
                                      right: "5px",
                                      background: "red",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "50%",
                                      width: "20px",
                                      height: "20px",
                                      cursor: "pointer"
                                    }}
                                  >
                                    X
                                  </button>
                                )}
                              {deletedImages.includes(image.id) && (
                                <span
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    color: "red",
                                    fontWeight: "bold"
                                  }}
                                >
                                  Đã xóa
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Giá sản phẩm */}
              <div className="card">
                <div className="card-body">
                  <div className="card-header-2">
                    <h5>Giá sản phẩm</h5>
                  </div>
                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Giá card
                    </label>
                    <div className="col-md-9">
                      <input
                        className={`form-control ${
                          errors.regular_price ? "is-invalid" : ""
                        }`}
                        type="number"
                        name="regular_price"
                        value={formData.regular_price}
                        onChange={handleChange}
                        min={0}
                      />
                      {errors.regular_price && (
                        <div className="invalid-feedback">
                          {errors.regular_price}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Giá ATM
                    </label>
                    <div className="col-md-9">
                      <input
                        className={`form-control ${
                          errors.sale_price ? "is-invalid" : ""
                        }`}
                        type="number"
                        name="sale_price"
                        value={formData.sale_price}
                        onChange={handleChange}
                        min={0}
                      />
                      {errors.sale_price && (
                        <div className="invalid-feedback">
                          {errors.sale_price}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin bổ sung */}
              <div className="card">
                <div className="card-body">
                  <div className="card-header-2">
                    <h5>Thông tin bổ sung</h5>
                  </div>
                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Số kim cương
                    </label>
                    <div className="col-md-9">
                      <input
                        className={`form-control ${
                          errors.number_diamond_available ? "is-invalid" : ""
                        }`}
                        type="number"
                        name="number_diamond_available"
                        value={formData.number_diamond_available || 0}
                        onChange={handleChange}
                        min={0}
                      />
                      {errors.number_diamond_available && (
                        <div className="invalid-feedback">
                          {errors.number_diamond_available}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Rank
                    </label>
                    <div className="col-md-9">
                      <input
                        className="form-control"
                        type="text"
                        name="rank"
                        value={formData.rank || ""}
                        onChange={handleChange}
                        placeholder="Nhập rank"
                      />
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Server
                    </label>
                    <div className="col-md-9">
                      <input
                        className="form-control"
                        type="text"
                        name="server"
                        value={formData.server || ""}
                        onChange={handleChange}
                        placeholder="Nhập server"
                      />
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Đăng ký bằng:
                    </label>
                    <div className="col-md-9">
                      <input
                        className={`form-control ${
                          errors.register_by ? "is-invalid" : ""
                        }`}
                        type="text"
                        name="register_by"
                        value={formData.register_by}
                        onChange={handleChange}
                        placeholder="Garena, Facebook, Google, ..."
                      />
                      {errors.register_by && (
                        <div className="invalid-feedback">
                          {errors.register_by}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-md-3 mb-0">
                      Thẻ vô cực
                    </label>
                    <div className="col-md-9">
                      <label className="switch">
                        <input
                          type="checkbox"
                          name="is_infinity_card"
                          checked={formData.is_infinity_card}
                          onChange={handleChange}
                        />
                        <span className="switch-state"></span>
                      </label>
                    </div>
                  </div>

                  {/* Nút submit và trở lại */}
                  <div className="mb-4 d-flex gap-2 col-sm-12 col-md-6 justify-content-center">
                    <button type="submit" className="btn btn-solid flex-grow-1">
                      {isEditing ? "Cập nhật" : "Lưu"}
                    </button>
                    <Link
                      href="/admin/products"
                      className="btn btn-warning flex-grow-1"
                    >
                      Trở lại
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
