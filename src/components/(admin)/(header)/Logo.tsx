import Image from "next/image";
import Link from "next/link";
import {FaBars} from "react-icons/fa";

export const Logo = () => {
  return (
    <div className="header-logo-wrapper p-0">
      <div className="logo-wrapper">
        <Link href="/admin/dashboard">
          <Image
            height={100}
                    width={100}
            className="img-fluid main-logo"
            src="/admin/assets/images/logo/1.png"
            alt="logo"
          />
          <Image
            height={100}
                    width={100}
            className="img-fluid white-logo"
            src="/admin/assets/images/logo/1-white.png"
            alt="logo"
          />
        </Link>
      </div>
      <div className="toggle-sidebar">
        <i
          className="status_toggle middle sidebar-toggle"
          data-feather="align-center"
        ></i>
          <FaBars size="2em" />
      </div>
    </div>
  );
};
