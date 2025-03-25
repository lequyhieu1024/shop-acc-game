"use client";

import Header from "@/components/(client)/(header)/page";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../index.css";
import AppFooter from "@/components/(admin)/(footer)/page";
import { CartProvider } from "../contexts/CartContext";
import FloatingSocialIcons from "@/components/SocialButton";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/dang-nhap";

  return (
    <html lang="en">
      <head>
        <title>ShopCuTy</title>
      </head>
      <body>
        <CartProvider>
          {!isLoginPage && <Header />}
          <div className="page-body">
            <div className="container-fluid">
              <div style={{ paddingTop: "10px" }}>{children}</div>
              {!isLoginPage && <FloatingSocialIcons />}
              <ToastContainer />
            </div>
            {!isLoginPage && <AppFooter />}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
