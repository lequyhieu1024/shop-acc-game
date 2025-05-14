"use client"
import React, { useState } from "react";
import { Button } from "antd";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import api from "@/app/services/axiosService";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/clients/contacts", formData);
            toast.success("Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                message: "",
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    };

    return (
        <>
            <Head>
                <title>Liên hệ ShopCutiGaming - Hỗ trợ mua acc Free Fire 24/7</title>
                <meta name="description" content="Liên hệ Shop Cuti Gaming..." />
                <meta name="keywords" content="liên hệ Shop Cuti Gaming..." />
                <link rel="canonical" href="https://shopcutigaming.com/contact" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                                Liên Hệ Với Chúng Tôi
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/20 shadow-xl">
                                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    Thông Tin Liên Hệ
                                </h2>
                                <div className="space-y-4 text-gray-300">
                                    <p className="flex items-center gap-2">
                                        <span className="text-purple-400">Email:</span>
                                        <a href="mailto:contact@shopcutigaming.com" className="hover:text-purple-400 transition-colors">
                                            contact@shopcutigaming.com
                                        </a>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-purple-400">Hotline:</span>
                                        <a href="tel:+84987654321" className="hover:text-purple-400 transition-colors">
                                            0987 654 321
                                        </a>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-purple-400">Facebook:</span>
                                        <a href="https://facebook.com/shopcutigaming" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                                            Shop Cu Tí Gaming
                                        </a>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-purple-400">Zalo:</span>
                                        <a href="https://zalo.me/0987654321" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                                            0987 654 321
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/20 shadow-xl">
                                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    Gửi Tin Nhắn Cho Chúng Tôi
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="fullName" className="block text-gray-300 font-medium mb-1 after:content-['*'] after:text-red-500">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg bg-gray-700/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                                            placeholder="Nhập họ và tên"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-gray-300 font-medium mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg bg-gray-700/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                                            placeholder="Nhập email của bạn"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-gray-300 font-medium mb-1">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg bg-gray-700/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-gray-300 font-medium mb-1 after:content-['*'] after:text-red-500">
                                            Nội dung tin nhắn
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full p-2 rounded-lg bg-gray-700/50 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                            placeholder="Nhập nội dung tin nhắn"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none hover:from-purple-700 hover:to-blue-700 transition-all duration-300 h-10 rounded-lg font-medium"
                                    >
                                        Gửi Tin Nhắn
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-10">
                <h3 className="text-xl font-semibold mb-4">Mua acc Free Fire ngay hôm nay!</h3>
                <Link
                    href="/danh-muc"
                    className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                    Xem kho acc Free Fire
                </Link>
            </div>
        </>
    );
}