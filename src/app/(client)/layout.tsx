"use client";

import Header from "@/components/(client)/(header)/page";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../index.css";
import AppFooter from "@/components/(admin)/(footer)/page";
import { CartProvider } from "../contexts/CartContext";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>ShopCuTy</title>
      </head>
      <body>
        <CartProvider>
          <Header />
          <div className="page-body">
            <div className="container-fluid">
              {/* Extend Here */}
              {children}
              <ToastContainer />
            </div>
            <AppFooter />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
