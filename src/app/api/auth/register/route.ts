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

    const usernameRegex = /^[a-zA-Z0-9]+$/;

    if (!usernameRegex.test(username)) {
      return NextResponse.json(
          { error: "Tên đăng nhập phải viết liền, không dấu và không chứa ký tự đặc biệt" },
          { status: 400 }
      );
    }

    const userRepository = await initRepository(User);

    const existingUser = await userRepository.findOne({
      where: { username },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Tên đăng nhập đã tồn tại" },
        { status: 400 }
      );
    }

    const userCode = `USER${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    let initialBalance = 0;

    if (referral_code) {
      initialBalance = Number(process.env.INITIAL_BALANCE) || 0;

      const referrer = await userRepository.findOne({
        where: { referral_code },
      });
      
      if (referrer) {
        await userRepository.update(
          { id: referrer.id },
          { balance: referrer.balance + Number(process.env.REFERRAL_BONUS) || 20000 }
        );
      }
    }

    const newUser = userRepository.create({
      user_code: userCode,
      username,
      password: hashedPassword,
      phone: "",
      balance: initialBalance,
      referral_code: referral_code || null,
      number_of_free_draw: 1,
      role: "user",
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