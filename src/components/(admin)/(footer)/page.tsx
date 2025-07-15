"use client";

import { Layout } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaPhoneAlt } from "react-icons/fa";
import React, {useEffect, useState} from "react";
import api from "@/app/services/axiosService";
import {ISystem} from "@/app/interfaces/ISystem";

const { Footer } = Layout;

const AppFooter: React.FC = () => {

  const [data, setData] = useState<ISystem | null>(null);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const response = await api.get('/clients/systems');
        const system = response.data.system;
        setData(system)
      } catch (error) {
        console.error('Error fetching system data:', error);
      }
    };

    fetchSystemData();
  }, []);
  return (
    <Footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white border-t border-purple-500/20">
      <div className="container mx-auto py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Thông Tin Chung */}
        <div>
          <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Thông Tin Chung</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/gioi-thieu" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Về Chúng Tôi
              </Link>
            </li>
            <li>
              <Link href="/nap-the" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Nạp thẻ
              </Link>
            </li>
            <li>
              <Link href="/bai-viet" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Bài viết
              </Link>
            </li>
          </ul>
        </div>

        {/* Sản Phẩm */}
        <div>
          <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Sản Phẩm</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/danh-muc" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Mua Nick Free Fire
              </Link>
            </li>
            <li>
              <Link href="/danh-muc" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Mua Nick Free VIP
              </Link>
            </li>
            <li>
              <Link href="/danh-muc" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Danh mục sản phẩm
              </Link>
            </li>
          </ul>
        </div>

        {/* Hỗ Trợ Khách Hàng */}
        <div>
          <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Hỗ Trợ Khách Hàng</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-purple-500/20 rounded-lg">
              <FaPhoneAlt className="text-purple-400" />
              <span className="text-gray-300">Chăm sóc khách hàng: <span className="text-purple-400 font-bold">{ data && data.phone || "033 8475 943"}</span></span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-500/20 rounded-lg">
              <FaFacebookF className="text-purple-400" />
              <Link href={ data && data.facebook || "https://www.facebook.com/le.hieu.168731/"} target="_blank" className="text-gray-300 hover:text-purple-400 transition-colors">
                Fan page
              </Link>
            </div>
            <div className="mt-4 p-3 bg-purple-500/20 rounded-lg">
              <Image
                src={ '/client/assets/images/LOGO.png' }
                alt="Hỗ Trợ"
                className="rounded-lg"
                height={100}
                width={320}
              />
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="map-container">
          <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Xem Bản Đồ</h4>
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.596219358692!2d105.84700331506302!3d21.02450098600764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0de0d0b6cd%3A0x5045675218ceed30!2sHoan+Kiem+Lake%2C+Hanoi!5e0!3m2!1sen!2suk!4v1640000000000!5m2!1sen!2suk"
              width="100%"
              height="250"
              loading="lazy"
              className="rounded-lg border border-purple-500/20"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="border-t border-purple-500/20 mt-8">
        <div className="container mx-auto py-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Shop Cuti Gaming. All rights reserved.</p>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
