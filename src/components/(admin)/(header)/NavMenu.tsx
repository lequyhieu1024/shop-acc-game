import Image from "next/image";
import Link from "next/link";

export const NavMenu = () => {
  return (
    <ul className="nav-menus">
      <li>
        <span className="header-search">
          <i className="ri-search-line"></i>
        </span>
      </li>
      <li></li>
      <li>
        <div className="mode">
          <i className="ri-moon-line"></i>
        </div>
      </li>
      <li className="profile-nav onhover-dropdown pe-0 me-0">
        <div className="media profile-media">
          <Image
            height={100}
            width={100}
            className="user-profile rounded-circle"
            src="/admin/assets/images/users/4.jpg"
            alt=""
          />
          <div className="user-name-hide media-body">
            <span>Emay Walter</span>
            <p className="mb-0 font-roboto">
              Admin<i className="middle ri-arrow-down-s-line"></i>
            </p>
          </div>
        </div>
        <ul className="profile-dropdown onhover-show-div">
          <li>
            <Link href="/admin/users">
              <i data-feather="users"></i>
              <span>Khách hàng</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/orders">
              <i data-feather="archive"></i>
              <span>Đơn hàng</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/supports">
              <i data-feather="phone"></i>
              <span>Liên hệ</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/systems">
              <i data-feather="settings"></i>
              <span>Hệ thống</span>
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  );
};
