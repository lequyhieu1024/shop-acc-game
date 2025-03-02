import React, { ReactNode } from "react";
import { Sidebar } from "@/components/(admin)/Sidebar";
import { Header } from "@/components/(admin)/Header";
import Script from "next/script";
import { Footer } from "@/components/(admin)/Footer";
import { ToastContainer } from "react-toastify";

const metadata = {
  title: "Shop Cu Tý Gaming - Dashboard"
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    //page-wrapper Start
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
      </head>
      <body>
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

        {/*Modal Start*/}
        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Logging Out
                </h5>
                <p>Are you sure you want to log out?</p>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
                <div className="button-box">
                  <button
                    type="button"
                    className="btn btn--no"
                    data-bs-dismiss="modal"
                  >
                    No
                  </button>
                  <button type="button" className="btn btn--yes btn-primary">
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Modal End*/}

        <Script
          src="/admin/assets/js/jquery-3.6.0.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/some-library.js"
          strategy="lazyOnload"
        />
        <Script
          src="/admin/assets/js/bootstrap/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
        <Script
          src="/admin/assets/js/scrollbar/simplebar.js"
          strategy="lazyOnload"
        />
        <Script
          src="/admin/assets/js/scrollbar/custom.js"
          strategy="lazyOnload"
        />
        <Script src="/admin/assets/js/config.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/tooltip-init.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/sidebar-menu.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/customizer.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/ratio.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/sidebareffect.js" strategy="lazyOnload" />
        <Script src="/admin/assets/js/script.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
