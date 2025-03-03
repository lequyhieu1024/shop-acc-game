import React, {ReactNode} from "react";
import {Sidebar} from "@/components/(admin)/Sidebar";
import {Header} from "@/components/(admin)/Header";
import Script from "next/script";
import {Footer} from "@/components/(admin)/Footer";
import {ToastContainer} from "react-toastify";

const metadata = {
    title: "Shop Cu Tý Gaming - Dashboard"
};

export default function layout({children}: { children: ReactNode }) {
    return (
        //page-wrapper Start
        <html lang="en">
        <head>
            <link
                href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&amp;display=swap"
                rel="stylesheet"/>
            <link rel="stylesheet" href="/admin/assets/css/linearicon.css"/>
            <link rel="stylesheet" type="text/css" href="/admin/assets/css/vendors/font-awesome.css"/>
            <link rel="stylesheet" type="text/css" href="/admin/assets/css/vendors/themify.css"/>
            <link rel="stylesheet" type="text/css" href="/admin/assets/css/ratio.css"/>
            <link rel="stylesheet" type="text/css" href="/admin/assets/css/remixicon.css"/>
            <link rel="stylesheet" type="text/css" href="/admin/assets/css/vendors/scrollbar.css"/>
            <link rel="stylesheet" type="text/css" href="/admin/assets/css/vendors/animate.css"/>
            <link rel="stylesheet" type="text/css" href="/admin/assets/css/vendors/bootstrap.css"/>
            <link rel="stylesheet" type="text/css" href="/admin/assets/css/vector-map.css"/>
            <link rel="stylesheet" href="/admin/assets/css/vendors/slick.css"/>
            <link rel="stylesheet" type="text/css" href="/admin/assets/css/style.css"/>
            <title>{metadata.title}</title>
        </head>
        <body>
        <div className="page-wrapper compact-wrapper" id="pageWrapper">
            {/*Page Header Start*/}
            <div className="page-header">
                <Header/>
            </div>
            {/*Page Body Start*/}
            <div className="page-body-wrapper">

                <div className="sidebar-wrapper">
                    <Sidebar/>
                </div>

                {/*index body start*/}

                <div className="page-body">
                    <div className="container-fluid">
                        {/*Extend Here*/}
                        {children}
                        <ToastContainer/>
                    </div>
                    <Footer/>
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

        <Script src="/admin/assets/js/jquery-3.6.0.min.js" strategy="beforeInteractive"/>
        <Script src="https://cdn.jsdelivr.net/npm/some-library.js" strategy="lazyOnload"/>
        <Script src="/admin/assets/js/bootstrap/bootstrap.bundle.min.js" strategy="lazyOnload"/>
        {/*<Script src="/admin/assets/js/icons/feather-icon/feather.min.js" strategy="lazyOnload" />*/}
        {/*<Script src="/admin/assets/js/icons/feather-icon/feather-icon.js" strategy="lazyOnload" />*/}
        <Script src="/admin/assets/js/scrollbar/simplebar.js" strategy="lazyOnload"/>
        <Script src="/admin/assets/js/scrollbar/custom.js" strategy="lazyOnload"/>
        <Script src="/admin/assets/js/config.js" strategy="lazyOnload"/>
        <Script src="/admin/assets/js/tooltip-init.js" strategy="lazyOnload"/>
        <Script src="/admin/assets/js/sidebar-menu.js" strategy="lazyOnload"/>
        {/*<Script src="/admin/assets/js/notify/bootstrap-notify.min.js" strategy="lazyOnload" />*/}
        {/*<Script src="/admin/assets/js/notify/index.js" strategy="lazyOnload" />*/}
        {/*<Script src="/admin/assets/js/chart/apex-chart/apex-chart1.js" strategy="lazyOnload" />*/}
        {/*<Script src="/admin/assets/js/chart/apex-chart/moment.min.js" strategy="lazyOnload" />*/}
        {/*<Script src="/admin/assets/js/chart/apex-chart/apex-chart.js" strategy="lazyOnload" />*/}
        {/*<Script src="/admin/assets/js/chart/apex-chart/stock-prices.js" strategy="lazyOnload" />*/}
        {/*<Script src="/admin/assets/js/chart/apex-chart/chart-custom1.js" strategy="lazyOnload" />*/}
        {/*<Script src="/admin/assets/js/slick.min.js" strategy="lazyOnload"/>*/}
        {/*<Script src="/admin/assets/js/custom-slick.js" strategy="lazyOnload"/>*/}
        <Script src="/admin/assets/js/customizer.js" strategy="lazyOnload"/>
        <Script src="/admin/assets/js/ratio.js" strategy="lazyOnload"/>
        <Script src="/admin/assets/js/sidebareffect.js" strategy="lazyOnload"/>
        <Script src="/admin/assets/js/script.js" strategy="lazyOnload"/>
        </body>
        </html>
    )
}