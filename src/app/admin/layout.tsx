import React, { ReactNode } from "react";
import { Sidebar } from "@/components/(admin)/Sidebar";
import { Header } from "@/components/(admin)/Header";
import Script from "next/script";
import { Footer } from "@/components/(admin)/Footer";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import { Public_Sans } from "next/font/google";

import "/public/admin/assets/css/linearicon.css";
import "/public/admin/assets/css/vendors/font-awesome.css";
import "/public/admin/assets/css/vendors/themify.css";
import "/public/admin/assets/css/ratio.css";
import "/public/admin/assets/css/remixicon.css";
import "/public/admin/assets/css/vendors/scrollbar.css";
import "/public/admin/assets/css/vendors/animate.css";
import "/public/admin/assets/css/vendors/bootstrap.css";
import "/public/admin/assets/css/vector-map.css";
import "/public/admin/assets/css/vendors/slick.css";
import "/public/admin/assets/css/style.css";

const metadata = {
    title: "Shop Cu Tý Gaming - Dashboard"
};

const publicSans = Public_Sans({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
    display: "swap",
});

export default function layout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <Head>
            <title>{metadata.title}</title>
        </Head>
        <body className={publicSans.className}>
        <div className="page-wrapper compact-wrapper" id="pageWrapper">
            {/*Page Header Start*/}
            <div className="page-header">
                <Header />
            </div>
            {/*Page Body Start*/}
            <div className="page-body-wrapper">
                <div className="sidebar-wrapper">
                    <Sidebar />
                </div>

                {/*index body start*/}
                <div className="page-body">
                    <div className="container-fluid">
                        {/*Extend Here*/}
                        {children}
                        <ToastContainer />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>

        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1}
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog  modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <h5 className="modal-title" id="staticBackdropLabel">Logging Out</h5>
                        <p>Are you sure you want to log out?</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div className="button-box">
                            <button type="button" className="btn btn--no" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn  btn--yes btn-primary">Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/*Modal End*/}

        <Script src="/admin/assets/js/jquery-3.6.0.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/some-library.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/bootstrap/bootstrap.bundle.min.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/scrollbar/simplebar.js" strategy="beforeInteractive" />
        <Script src="/admin/assets/js/scrollbar/custom.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/config.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/tooltip-init.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/sidebar-menu.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/customizer.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/ratio.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/sidebareffect.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/script.js" strategy="lazyOnload" />
        </body>
        </html>
    )
}
