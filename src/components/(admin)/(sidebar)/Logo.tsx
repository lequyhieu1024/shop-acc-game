import Image from "next/image";

export const Logo = () => {
  return (
    <>
      <div className="logo-wrapper logo-wrapper-center">
        <a
          href="/admin/dashboard"
          data-bs-original-title=""
          title="Dashboard"
          className="text-4xl text-white font-bold"
          style={{ fontSize: 24 }}
        >
          Quản trị viên
        </a>
        <div className="back-btn">
          <i className="fa fa-angle-left"></i>
        </div>
        <div className="toggle-sidebar">
          <i className="ri-apps-line status_toggle middle sidebar-toggle"></i>
        </div>
      </div>
      <div className="logo-icon-wrapper">
        <a href="index.html">
          <Image
            className="img-fluid main-logo main-white"
            src="/admin/assets/images/logo/logo.png"
            alt="logo"
          />
          <Image
            className="img-fluid main-logo main-dark"
            src="/admin/assets/images/logo/logo-white.png"
            alt="logo"
          />
        </a>
      </div>
    </>
  );
};
