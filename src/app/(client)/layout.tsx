"use client";

import Header from "@/components/(client)/(header)/page";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "../globals.css";
import "../../index.css";
import AppFooter from "@/components/(admin)/(footer)/page";
export default function layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Client</title>
      </head>
      <body>
        <Header />
        <div className="page-body">
          <div className="container-fluid">
            {/*Extend Here*/}
            {children}
            <ToastContainer />
          </div>
          <AppFooter />
        </div>
      </body>
    </html>
  );
}
