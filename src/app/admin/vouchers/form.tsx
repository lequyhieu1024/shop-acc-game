"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { generateVoucherCode } from "@/app/services/commonService";
import { IVoucher } from "@/app/interfaces/IVoucher";
import api from "@/app/services/axiosService";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import DateTimePicker from "@/components/DateTimePicker";
import { toast } from "react-toastify";

interface VoucherEditProps {
  isEditing?: boolean;
  initialData?: IVoucher | null;
}

export default function VoucherForm({
  initialData = null,
  isEditing = false
}: VoucherEditProps) {
  const router = useRouter();

  const [data, setData] = useState<IVoucher>({} as IVoucher);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isEditing && initialData) {
      setData(initialData);
    }
    setLoading(false);
  }, [initialData, isEditing]);

  const autoGenareteCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setData({ ...data, ["code"]: generateVoucherCode() });
    // console.log(data)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, type: e.target.checked ? "private" : "public" });
  };

  const handleDateChange = (name: string, value: string) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateVoucherData = (data: any) => {
    if (!data.name || data.name.trim().length === 0) {
      return "Tên voucher không được để trống.";
    }

    if (!data.code || data.code.trim().length === 0) {
      return "Mã voucher không được để trống.";
    }

    if (data.value <= 0 || isNaN(data.value)) {
      return "Giá trị voucher phải là một số dương.";
    }

    if (!data.issue_date) {
      return "Ngày phát hành không được bỏ trống.";
    }

    if (
      !data.expired_date ||
      new Date(data.expired_date) <= new Date(data.issue_date)
    ) {
      return "Ngày hết hạn phải lớn hơn ngày phát hành.";
    }

    if (data.quantity <= 0 || !Number.isInteger(parseInt(data.quantity))) {
      return "Số lượng voucher phải là một số nguyên dương.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const validationError = validateVoucherData(data);
    if (validationError) {
      toast.error(validationError);
      setLoading(false);
      return;
    }
    try {
      let response;
      if (isEditing && initialData) {
        response = await api.patch(`vouchers/${initialData.id}`, data);
      } else {
        response = await api.post("vouchers", data);
      }
      if (response.status === 200) {
        sessionStorage.setItem(
          "message",
          `${isEditing ? "Cập nhật" : "Tạo mới"} voucher thành công`
        );
        router.push("/admin/vouchers");
      }
    } catch (e) {
      console.log((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="row">
      <div className="card">
        <div className="card-body">
          <div className="title-header option-title">
            <h5>Thông tin voucher</h5>
          </div>

          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade active show"
              id="pills-home"
              role="tabpanel"
            >
              <form
                className="theme-form theme-form-2 mega-form"
                onSubmit={handleSubmit}
              >
                <div className="row">
                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-lg-2 col-md-3 mb-0">
                      Tên chương trình:
                    </label>
                    <div className="col-md-9 col-lg-10">
                      <input
                        className="form-control"
                        type="text"
                        value={data.name}
                        onChange={handleInputChange}
                        name="name"
                        placeholder="Ví dụ: chào mừng thành viên mới, ngày hội thể thao, ..."
                      />
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="col-lg-2 col-md-3 col-form-label form-label-title">
                      Mã giảm
                    </label>
                    <div
                      className={
                        isEditing ? "col-md-9 col-lg-10" : "col-md-7 col-lg-8"
                      }
                    >
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        value={data.code}
                        onChange={handleInputChange}
                        name="code"
                      />
                      {isEditing && (
                        <small className={`text-danger`}>
                          <i>Không được cập nhật trường này</i>
                        </small>
                      )}
                    </div>
                    <div className={isEditing ? "d-none" : "col-md-2 col-lg-2"}>
                      <button
                        className="btn btn-primary"
                        onClick={autoGenareteCode}
                      >
                        Tự động tạo
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="col-lg-2 col-md-3 col-form-label form-label-title">
                      Giá trị giảm
                    </label>
                    <div className="col-md-9 col-lg-10">
                      <input
                        className="form-control"
                        type="number"
                        value={data.value}
                        onChange={handleInputChange}
                        name="value"
                        placeholder="vnđ"
                      />
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="col-lg-2 col-md-3 col-form-label form-label-title">
                      Ngày bắt đầu
                    </label>
                    <div className="col-md-9 col-lg-10">
                      <DateTimePicker
                        initialDatetime={data.issue_date}
                        inputName="issue_date"
                        onChange={handleDateChange}
                      />
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="col-lg-2 col-md-3 col-form-label form-label-title">
                      Ngày kết thúc
                    </label>
                    <div className="col-md-9 col-lg-10">
                      <DateTimePicker
                        initialDatetime={data.expired_date}
                        inputName="expired_date"
                        onChange={handleDateChange}
                      />
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="form-label-title col-lg-2 col-md-3 mb-0">
                      Phát hành nội bộ ?
                    </label>
                    <div className="col-md-9">
                      <div className="form-check user-checkbox ps-0">
                        <input
                          className="checkbox_animated check-it"
                          type="checkbox"
                          checked={data.type === "private"}
                          onChange={handleCheckboxChange}
                          name="type"
                          id="flexCheckDefault"
                        />
                        <small className="text-danger">
                          <i>
                            *Chọn đồng nghĩa với việc chỉ admin có quyền cho
                            người dùng nào sử dụng mã giảm giá
                          </i>
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 row align-items-center">
                    <label className="col-lg-2 col-md-3 col-form-label form-label-title">
                      Số lượng
                    </label>
                    <div className="col-md-9 col-lg-10">
                      <input
                        className="form-control"
                        value={data.quantity}
                        onChange={handleInputChange}
                        name="quantity"
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="row align-items-center mb-4">
                    <label className="form-label-title col-lg-2 col-md-3 mb-0">
                      Trạng thái
                    </label>
                    <div className="col-md-9 col-lg-10">
                      <select
                        onChange={handleSelectChange}
                        name="status"
                        value={data.status || "active"}
                        className="form-select"
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4 d-flex gap-2 col-sm-12 col-md-6 justify-content-center">
                    <button type="submit" className="btn btn-solid flex-grow-1">
                      {isEditing ? "Cập nhật" : "Lưu"}
                    </button>
                    <Link
                      href="/admin/vouchers"
                      className="btn btn-warning flex-grow-1"
                    >
                      Trở lại
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
