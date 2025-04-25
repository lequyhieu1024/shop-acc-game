import { NextRequest, NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { User } from "@/app/models/entities/User";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const { username, password, referral_code } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Tên đăng nhập và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    const userRepository = await initRepository(User);
    
    // Kiểm tra username đã tồn tại chưa
    const existingUser = await userRepository.findOne({
      where: { username },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Tên đăng nhập đã tồn tại" },
        { status: 400 }
      );
    }

    // Tạo mã người dùng
    const userCode = `USER${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Xử lý số dư ban đầu
    let initialBalance = 0;
    let referrerId = null;

    if (referral_code) {
      initialBalance = Number(process.env.INITIAL_BALANCE) || 0;
      
      // Tìm người giới thiệu
      const referrer = await userRepository.findOne({
        where: { referral_code },
      });
      
      if (referrer) {
        // Cộng tiền cho người giới thiệu
        await userRepository.update(
          { id: referrer.id },
          { balance: referrer.balance + Number(process.env.REFERRAL_BONUS) || 20000 }
        );
        referrerId = referrer.id;
      }
    }

    // Tạo người dùng mới
    const newUser = userRepository.create({
      user_code: userCode,
      username,
      password: hashedPassword,
      phone: "",
      balance: initialBalance,
      referral_code: referral_code || null,
      referrer_id: referrerId,
      number_of_free_draw: 1,
      role: "user",
      is_for_sale: 0, // Mặc định không cho phép bán
    });

    await userRepository.save(newUser);

    return NextResponse.json({
      success: true,
      message: "Đăng ký thành công",
      user: {
        id: newUser.id,
        username: newUser.username,
        referral_code: newUser.referral_code,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đăng ký" },
      { status: 500 }
    );
  }
} 