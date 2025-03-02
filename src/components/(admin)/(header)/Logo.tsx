import Image from "next/image";

export const Logo = () => {
  return (
    <div className="header-logo-wrapper p-0">
      <div className="logo-wrapper">
        <a href="index.html">
          <Image
            className="img-fluid main-logo"
            src="/admin/assets/images/logo/1.png"
            alt="logo"
          />
          <Image
            className="img-fluid white-logo"
            src="/admin/assets/images/logo/1-white.png"
            alt="logo"
          />
        </a>
      </div>
      <div className="toggle-sidebar">
        <i
          className="status_toggle middle sidebar-toggle"
          data-feather="align-center"
        ></i>
        <a href="index.html">
          <Image
            src="/admin/assets/images/logo/1.png"
            className="img-fluid"
            alt=""
          />
        </a>
      </div>
    </div>
  );
};
