"use client";

import { Layout } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaPhoneAlt } from "react-icons/fa";

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer className="bg-teal-800 text-white">
      <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Thông Tin Chung */}
        <div>
          <h4 className="font-bold mb-4">Thông Tin Chung</h4>
          <ul>
            <li className="mb-2">
              <Link href="/about">Về Chúng Tôi</Link>
            </li>
            <li className="mb-2">
              <Link href="/policy">Chính Sách Bảo Mật</Link>
            </li>
            <li className="mb-2">
              <Link href="/terms">Điều Khoản Sử Dụng</Link>
            </li>
            <li className="mb-2">
              <Link href="/contact">Chính Sách Bán Hàng</Link>
            </li>
            <li className="mb-2">
              <Link href="/support">Chính Sách Đổi Trả</Link>
            </li>
          </ul>
        </div>

        {/* Sản Phẩm */}
        <div>
          <h4 className="font-bold mb-4">Sản Phẩm</h4>
          <ul>
            <li className="mb-2">
              <Link href="/products/free-fire">Mua Nick Free Fire</Link>
            </li>
            <li className="mb-2">
              <Link href="/products/minigame">Minigame Kim Cương</Link>
            </li>
            <li className="mb-2">
              <Link href="/products/nick-vip">Mua Nick Free VIP</Link>
            </li>
            <li className="mb-2">
              <Link href="/products/lien-quan">Mua Nick Liên Quân</Link>
            </li>
            <li className="mb-2">
              <Link href="/products/roblox">Apex Roblox</Link>
            </li>
          </ul>
        </div>

        {/* Hỗ Trợ Khách Hàng */}
        <div>
          <h4 className="font-bold mb-4">Hỗ Trợ Khách Hàng</h4>
          <div className="flex items-center mb-2">
            <FaPhoneAlt className="mr-2" />
            <span>Chăm sóc khách hàng: 0355.342.442</span>
          </div>
          <div className="flex items-center mb-2">
            <FaFacebookF className="mr-2" />
            <Link href="https://facebook.com" target="_blank">
              Facebook Fanpage
            </Link>
          </div>
          <Image src="/path-to-your-image.jpg" alt="Hỗ Trợ" className="mt-4" />
        </div>

        {/* Map */}
        <div className="map-container">
          <h4 className="font-bold mb-4">Xem Bản Đồ</h4>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.596219358692!2d105.84700331506302!3d21.02450098600764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0de0d0b6cd%3A0x5045675218ceed30!2sHoan+Kiem+Lake%2C+Hanoi!5e0!3m2!1sen!2suk!4v1640000000000!5m2!1sen!2suk"
            width="100%"
            height="250"
            loading="lazy"
            className="border-none"
          ></iframe>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
