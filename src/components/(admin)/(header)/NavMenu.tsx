import Image from "next/image";

export const NavMenu = () => {
  return (
    <ul className="nav-menus">
      <li>
        <span className="header-search">
          <i className="ri-search-line"></i>
        </span>
      </li>
      <li className="onhover-dropdown">
        <div className="notification-box">
          <i className="ri-notification-line"></i>
          <span className="badge rounded-pill badge-theme">4</span>
        </div>
        <ul className="notification-dropdown onhover-show-div">
          <li>
            <i className="ri-notification-line"></i>
            <h6 className="f-18 mb-0">Notitications</h6>
          </li>
          <li>
            <p>
              <i className="fa fa-circle me-2 font-primary"></i>Delivery
              processing <span className="pull-right">10 min.</span>
            </p>
          </li>
          <li>
            <p>
              <i className="fa fa-circle me-2 font-success"></i>Order Complete
              <span className="pull-right">1 hr</span>
            </p>
          </li>
          <li>
            <p>
              <i className="fa fa-circle me-2 font-info"></i>Tickets Generated
              <span className="pull-right">3 hr</span>
            </p>
          </li>
          <li>
            <p>
              <i className="fa fa-circle me-2 font-danger"></i>Delivery Complete
              <span className="pull-right">6 hr</span>
            </p>
          </li>
          <li>
            <a className="btn btn-primary" href="#">
              Check all notification
            </a>
          </li>
        </ul>
      </li>

      <li>
        <div className="mode">
          <i className="ri-moon-line"></i>
        </div>
      </li>
      <li className="profile-nav onhover-dropdown pe-0 me-0">
        <div className="media profile-media">
          <Image
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
            <a href="all-users.html">
              <i data-feather="users"></i>
              <span>Users</span>
            </a>
          </li>
          <li>
            <a href="order-list.html">
              <i data-feather="archive"></i>
              <span>Orders</span>
            </a>
          </li>
          <li>
            <a href="support-ticket.html">
              <i data-feather="phone"></i>
              <span>Spports Tickets</span>
            </a>
          </li>
          <li>
            <a href="profile-setting.html">
              <i data-feather="settings"></i>
              <span>Settings</span>
            </a>
          </li>
          <li>
            <a data-bs-toggle="modal" data-bs-target="#staticBackdrop" href="#">
              <i data-feather="log-out"></i>
              <span>Log out</span>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  );
};
