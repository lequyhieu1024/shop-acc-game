"use client";

import Header from "@/components/(client)/(header)/page";
import React, {ReactNode} from "react";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../index.css";
import AppFooter from "@/components/(admin)/(footer)/page";
import {CartProvider} from "../contexts/CartContext";
import FloatingSocialIcons from "@/components/SocialButton";
import Head from "next/head";
import {SessionProvider} from "next-auth/react";


export default function Layout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <Head>
            <title>Giới thiệu Shop Cuti Gaming - Bán acc Free Fire uy tín</title>
            <meta
                name="description"
                content="Shop Cuti Gaming - Địa chỉ bán acc Free Fire uy tín tại shopcutigaming.com. Cung cấp tài khoản Free Fire giá rẻ, an toàn, hỗ trợ 24/7 bởi Lê Quý Hiếu."
            />
            <meta name="keywords" content="bán acc Free Fire, shopcutigaming, acc Free Fire giá rẻ, Lê Quý Hiếu"/>
            <link rel="canonical" href="https://shopcutigaming.com/about"/>
            <link rel="shortcut icon" href="/public/client/assets/images/logo/favicon-32x32.png" type="image/x-icon"/>
        </Head>
        <body>
        <SessionProvider>
            <CartProvider>
                <Header/>
                <div className="page-body">
                    <div className="container-fluid">
                        {/* Extend Here */}
                        <div style={{paddingTop: "10px"}}>
                            {children}
                        </div>
                        <FloatingSocialIcons/>
                        <ToastContainer/>
                    </div>
                    <AppFooter/>
                </div>
            </CartProvider>
        </SessionProvider>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    name: "Shop Cuti Gaming",
                    url: "https://shopcutigaming.com",
                    founder: "Lê Quý Hiếu",
                    description: "Shop bán acc Free Fire uy tín, giá rẻ và an toàn tại Việt Nam.",
                }),
            }}
        />
        </body>
        </html>
    );
}
