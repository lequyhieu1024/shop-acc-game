"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ICategory } from "@/app/interfaces/ICategory";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import { DateTimeISO8601ToUFFAndUTCP7 } from "@/app/services/commonService";
import { toast } from "react-toastify";
import DeleteConfirm from "@/components/DeleteConfirm";
import { FormSearch } from "@/components/(admin)/(form)/FormSeach";
import Image from "next/image";

export default function CategoryPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const getCategories = async (
    name: string | null = null,
    size: number | null = null
  ) => {
    setLoading(true); // Uncomment this to show loading state
    try {
      let url = `categories?`;
      if (size) url += `size=${encodeURIComponent(size)}&`;
      if (name) url += `name=${encodeURIComponent(name)}&`;

      const response = await api.get(url);
      if (response.status === 200) {
        setCategories(response.data.categories || []);
        setError(false);
      }
    } catch {
      console.log("Error fetching categories");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      const res = await api.delete(`categories/${id}`);
      if (res) {
        sessionStorage.setItem("message", "Xóa danh mục thành công");
        showMessage();
        await getCategories();
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
    getCategories();
    showMessage();
  }, []);

  return loading ? (
    <Loading />
  ) : !error ? (
    <div className="row">
      <div className="col-sm-12">
        <div className="card card-table">
          <div className="card-body">
            <div className="title-header option-title">
              <h5>All Categories</h5>
              <form className="d-inline-flex">
                <Link
                  href="/admin/categories/create"
                  className="align-items-center btn btn-theme d-flex"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-plus-square"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  Add New
                </Link>
              </form>
            </div>

            <div className="table-responsive category-table">
              <div
                className="dataTables_wrapper no-footer"
                id="table_id_wrapper"
              >
                <FormSearch onSearch={getCategories} />
                <table className="table all-package theme-table" id="table_id">
                  <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Image/Icon</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-5">
                          <h5>No data</h5>
                        </td>
                      </tr>
                    ) : (
                      categories.map((category: ICategory) => (
                        <tr key={category.id}>
                          <td>{category.name}</td>
                          <td>
                            <Image
                              width={150}
                              height={100}
                              src={
                                category.image ||
                                "/admin/assets/images/placeholder.png"
                              }
                              alt={category.name}
                              layout="intrinsic"
                            />
                          </td>
                          <td>
                            {DateTimeISO8601ToUFFAndUTCP7(category.created_at)}
                          </td>
                          <td>
                            <ul>
                              <li>
                                <Link href={`/admin/categories/${category.id}`}>
                                  <i className="ri-pencil-line"></i>
                                </Link>
                              </li>
                              <li>
                                <DeleteConfirm
                                  onConfirm={() => handleDelete(category.id)}
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
