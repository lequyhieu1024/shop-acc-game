"use client"
import { IContact } from "@/app/interfaces/IContact";
import api from "@/app/services/axiosService";
import { DateTimeISO8601ToUFFAndUTCP7 } from "@/app/services/commonService";
import { FormSearch } from "@/components/(admin)/(form)/FormSeach";
import DeleteConfirm from "@/components/DeleteConfirm";
import Loading from "@/components/Loading";
import {  Switch } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const Support = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [contact, setContact] = useState<IContact[]>([]);
    const getContacts = async (
        name: string | null = null,
        size: number | null = null
    ) => {
        setLoading(true); // Uncomment this to show loading state
        try {
            let url = `contacts?`;
            if (size) url += `size=${encodeURIComponent(size)}&`;
            if (name) url += `name=${encodeURIComponent(name)}&`;
            console.log(url);

            const response = await api.get(url);
            if (response.status === 200) {
                setContact(response.data.contacts || []);
                setError(false);
            }
        } catch {
            console.log("Error fetching contacts ");
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id: number): Promise<void> => {
        try {
            const res = await api.delete(`contacts/${id}`);
            if (res) {
                sessionStorage.setItem("message", "Xóa danh mục thành công");
                showMessage();
                await getContacts();
            }
        } catch (e) {
            console.log((e as Error).message);
        }
    };
    const showMessage = () => {
        const msg = sessionStorage.getItem("message");
        if (msg) {
            toast.success(msg);
            sessionStorage.removeItem("message");
        }
    };

    useEffect(() => {
        getContacts();
        showMessage();
    }, []);

    const handleToggleFeedback = (contact: IContact) => {
        Swal.fire({
            title: `Bạn có chắc muốn thay đổi phản hồi cho "${contact.fullName}"?`,
            text: `Trạng thái sẽ chuyển từ ${contact.is_feedback ? "Đã phản hồi" : "Chưa phản hồi"} sang ${!contact.is_feedback ? "Đã phản hồi" : "Chưa phản hồi"}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Huỷ",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.patch(`/contacts/${contact.id}`);
                    toast.success("Cập nhật phản hồi thành công.");
                    getContacts(); // gọi lại để refresh data
                     // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    toast.error("Có lỗi xảy ra khi cập nhật.");
                }
            }
        });
    };



return loading ? (
    <Loading />
) : !error ? (
    <div className="row">
        <div className="col-sm-12">
            <div className="card card-table">
                <div className="card-body">
                    <div className="title-header option-title">
                        <h5>Tất cả danh mục</h5>
                        <form className="d-inline-flex">

                        </form>
                    </div>

                    <div className="table-responsive category-table">
                        <div
                            className="dataTables_wrapper no-footer"
                            id="table_id_wrapper"
                        >
                            <FormSearch onSearch={getContacts} />
                            <table className="table all-package theme-table" id="table_id">
                                <thead>
                                    <tr>
                                        <th>Tên khách hàng</th>
                                        <th>Số điện thoại</th>
                                        <th>Email</th>
                                        <th>Trạng thái phản hồi</th>
                                        <th>Yêu cầu</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contact.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-5">
                                                <h5>No data</h5>
                                            </td>
                                        </tr>
                                    ) : (
                                        contact.map((ct: IContact) => (
                                            <tr key={ct.id}>
                                                <td>{ct.fullName}</td>
                                                <td>{ct.phone}</td>
                                                <td>{ct.email}</td>
                                                <td>
                                                    <Switch
                                                        checked={ct.is_feedback}
                                                        onChange={() => handleToggleFeedback(ct)}
                                                    />
                                                </td>
                                                <td>
                                                    {ct.message}
                                                </td>
                                                <td>
                                                    {DateTimeISO8601ToUFFAndUTCP7(ct.created_at)}
                                                </td>
                                                <td>
                                                    <ul>
                                                        <li>
                                                            <DeleteConfirm
                                                                onConfirm={() => handleDelete(ct.id)}
                                                            />
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
) : (
    <h3>Something went wrong</h3>
);
}
export default Support