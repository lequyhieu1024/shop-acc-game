import { NextRequest, NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { Auth } from "@/app/models/entities/client/Auth";
import bcrypt from "bcrypt";

// Số lần salt để mã hóa mật khẩu
const SALT_ROUNDS = 10;

export const POST = async (req: NextRequest) => {
  try {
    // Khởi tạo repository
    const authRepository = await initRepository(Auth);

    // Lấy dữ liệu từ request body
    const { email, password, full_name, is_active } = await req.json();

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { message: "Email, mật khẩu và họ tên là bắt buộc" }, // Updated message
        { status: 400 }
      );
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await authRepository.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã tồn tại" }, // Updated message
        { status: 400 }
      );
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Tạo đối tượng người dùng mới
    const newUser = authRepository.create({
      email,
      password: hashedPassword,
      full_name,
      is_active: is_active || true,
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await authRepository.save(newUser);

    // Trả về response thành công
    return NextResponse.json(
      {
        message: "Đăng ký người dùng thành công", // Updated message
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          is_active: newUser.is_active,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ nội bộ" }, // Updated message
      { status: 500 }
    );
  }
};