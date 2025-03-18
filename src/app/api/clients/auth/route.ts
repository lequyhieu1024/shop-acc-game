import { NextRequest, NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { Auth } from "@/app/models/entities/client/Auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Cấu hình thời gian sống của token
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 phút
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 ngày

// Biến môi trường nên được đặt trong file .env
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";

export const POST = async (req: NextRequest) => {
  try {
    // Khởi tạo repository
    const authRepository = await initRepository(Auth);

    // Lấy dữ liệu từ request body
    const { username, password } = await req.json();

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Tìm user trong database
    const user = await authRepository.findOne({ where: { username } });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Tạo payload cho token
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role || "user"
    };

    // Tạo access token
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY
    });

    // Tạo refresh token
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY
    });

    // Lưu refresh token vào database (tùy chọn)
    await authRepository.update({ id: user.id }, { refreshToken });

    // Trả về response
    return NextResponse.json(
      {
        message: "Login successful",
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          access_token_expires_in: ACCESS_TOKEN_EXPIRY,
          refresh_token_expires_in: REFRESH_TOKEN_EXPIRY
        },
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

// Hàm phụ để refresh token (tùy chọn)
export const refreshTokenHandler = async (req: NextRequest) => {
  try {
    const { refresh_token } = await req.json();

    if (!refresh_token) {
      return NextResponse.json(
        { message: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refresh_token,
      REFRESH_TOKEN_SECRET
    ) as jwt.JwtPayload;

    const authRepository = await initRepository(Auth);
    const user = await authRepository.findOne({
      where: {
        id: decoded.id,
        refreshToken: refresh_token
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Tạo access token mới
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role || "user"
    };

    const newAccessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY
    });

    return NextResponse.json({
      access_token: newAccessToken,
      expires_in: ACCESS_TOKEN_EXPIRY
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid refresh token" },
      { status: 401 }
    );
  }
};
