import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <>
      <div className="logo-wrapper logo-wrapper-center justify-content-between">
        <Link
          href="/admin/dashboard"
          data-bs-original-title=""
          title="Dashboard"
          className="text-4xl text-white font-bold"
          style={{ fontSize: 24 }}
        >
          Quản trị viên
        </Link>
        <div className="back-btn">
          <i className="fa fa-angle-left"></i>
        </div>
        <div className="toggle-sidebar">
          <i className="ri-apps-line status_toggle middle sidebar-toggle"></i>
        </div>
      </div>
      <div className="logo-icon-wrapper">
        <Link href="/admin/dashboard">
          <Image
            height={100}
            width={100}
            className="img-fluid main-logo main-white"
            src="/admin/assets/images/logo/logo.png"
            alt="logo"
          />
          <Image
            height={100}
            width={100}
            className="img-fluid main-logo main-dark"
            src="/admin/assets/images/logo/logo-white.png"
            alt="logo"
          />
        </Link>
      </div>
    </>
  );
};
