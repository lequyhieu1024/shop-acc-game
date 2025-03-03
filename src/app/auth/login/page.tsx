import Image from "next/image";

export default function login() {
  return (
    <div className="log-in-box">
      <div className="log-in-title">
        <h3>Welcome To Fastkart</h3>
        <h4>Log In Your Account</h4>
      </div>

      <div className="input-box">
        <form className="row g-4">
          <div className="col-12">
            <div className="form-floating theme-form-floating log-in-form">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email Address"
              />
              <label htmlFor="email">Email Address</label>
            </div>
          </div>

          <div className="col-12">
            <div className="form-floating theme-form-floating log-in-form">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
              />
              <label htmlFor="password">Password</label>
            </div>
          </div>

          <div className="col-12">
            <div className="forgot-box">
              <div className="form-check ps-0 m-0 remember-box">
                <input
                  className="checkbox_animated check-box"
                  type="checkbox"
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Remember me
                </label>
              </div>
              <a href="forgot.html" className="forgot-password">
                Forgot Password?
              </a>
            </div>
          </div>

          <div className="col-12">
            <button
              className="btn btn-animation w-100 justify-content-center"
              type="submit"
            >
              Log In
            </button>
          </div>
        </form>
      </div>

      <div className="other-log-in">
        <h6>or</h6>
      </div>

      <div className="log-in-button">
        <ul>
          <li>
            <a
              href="https://www.google.com/"
              className="btn google-button w-100"
            >
              <Image
                height={100}
                width={100}
                src="../assets/images/inner-page/google.png"
                className="blur-up lazyloaded"
                alt=""
              />{" "}
              Log In with Google
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/"
              className="btn google-button w-100"
            >
              <Image
                height={100}
                width={100}
                src="../assets/images/inner-page/facebook.png"
                className="blur-up lazyloaded"
                alt=""
              />{" "}
              Log In with Facebook
            </a>
          </li>
        </ul>
      </div>

      <div className="other-log-in">
        <h6></h6>
      </div>

      <div className="sign-up-box">
        <h4>Do not have an account?</h4>
        <a href="sign-up.html">Sign Up</a>
      </div>
    </div>
  );
}
