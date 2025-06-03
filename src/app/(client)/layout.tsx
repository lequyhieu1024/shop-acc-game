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
import {DefaultSeo} from "next-seo";
import BackToTop from "@/components/BackToTop";

export default function Layout({children}: { children: ReactNode }) {
    return (
        <html lang="vi">
        <head>
            <title>Shop Cu Tí Gaming | Chuyên bán, phân phối acc game free fire uy tín số 1 VN</title>
            <meta name="description" content="shopcutigaming"/>
            <link rel="icon" href="/client/assets/images/logo/favicon-32x32.png"/>
        </head>
        <body>
        <Head>
        <DefaultSeo
                title="Giới thiệu Shop Cuti Gaming - Bán acc Free Fire uy tín"
                description="Shop Cuti Gaming - Địa chỉ bán acc Free Fire uy tín tại shopcutigaming.com. Cung cấp tài khoản Free Fire giá rẻ, an toàn, hỗ trợ 24/7 bởi Lê Quý Hiếu."
                canonical="https://shopcutigaming.com/gioi-thieu"
                additionalMetaTags={[
                    {
                        name: "keywords",
                        content: "bán acc Free Fire, shopcutigaming, shop cu tý, shopcuty, cu tý gaming,shop gaming acc, bán acc gaem, nick freefire giá rẻ, shop bán acc game, acc freefire xịn, acc Free Fire giá rẻ, Lê Quý Hiếu",
                    },
                ]}
                additionalLinkTags={[
                    {
                        rel: "icon",
                        href: "/client/assets/images/logo/favicon-32x32.png",
                        type: "image/x-icon",
                    },
                    {
                        rel: "preload",
                        href: "/client/assets/images/logo/favicon-32x32.png",
                        as: "image",
                    },
                ]}

                openGraph={{
                    url: "https://shopcutigaming.com/gioi-thieu",
                    title: "Giới thiệu Shop Cuti Gaming - Bán acc Free Fire uy tín",
                    description:
                        "Shop Cuti Gaming - Địa chỉ bán acc Free Fire uy tín tại shopcutigaming.com. Cung cấp tài khoản Free Fire giá rẻ, an toàn, hỗ trợ 24/7 bởi Lê Quý Hiếu.",
                    images: [
                        {
                            url: "https://shopcutigaming.com/public/client/assets/images/LOGO.png",
                            width: 1200,
                            height: 630,
                            alt: "Shop Cuti Gaming",
                        },
                    ],
                    site_name: "Shop Cuti Gaming",
                    locale: "vi_VN",
                    type: "website",
                }}
                twitter={{
                    handle: "@shopcutigaming",
                    site: "@shopcutigaming",
                    cardType: "summary_large_image",
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "url": "https://shopcutigaming.com/",
                        "logo": "https://shopcutigaming.com/client/assets/images/LOGO.png",
                        "name": "Shop Cu Tí Gaming"
                    })
                }}
            />
        </Head>
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
                        <BackToTop />
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
                    description:
                        "Shop bán acc Free Fire uy tín, giá rẻ và an toàn tại Việt Nam.",
                    contactPoint: {
                        "@type": "ContactPoint",
                        telephone: "+84-123-456-789",
                        contactType: "customer service",
                        availableLanguage: "Vietnamese",
                    },
                    address: {
                        "@type": "PostalAddress",
                        addressCountry: "VN",
                        addressLocality: "Hà Nội",
                    },
                    sameAs: [
                        "https://www.facebook.com/shopcutigaming",
                        "https://youtube.com/shopcutigaming",
                    ],
                }),
            }}
        />
        </body>
        </html>
    );
}
