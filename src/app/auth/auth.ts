import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { initRepository } from "@/app/models/connect";
import { User as UserEntity } from "@/app/models/entities/User";
import bcrypt from "bcrypt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            balance: number;
            referral_code: string;
            role: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
        balance: number;
        referral_code: string;
        role: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Tên đăng nhập", type: "text" },
                password: { label: "Mật khẩu", type: "password" },
                referral_code: { label: "Mã giới thiệu", type: "text" },
                action: { label: "Hành động", type: "text" }, // Thêm trường action
            },
            async authorize(credentials) {
                const { username, password, referral_code, action } = credentials || {};

                if (!username || !password) {
                    throw new Error("Tên đăng nhập và mật khẩu là bắt buộc");
                }

                const usernameRegex = /^[a-zA-Z0-9]+$/;

                if (!usernameRegex.test(username)) {
                    throw new Error("Tên đăng nhập phải viết liền, không dấu và không chứa ký tự đặc biệt");
                }

                // Validate username
                if (username.length < 3) {
                    throw new Error("Tên đăng nhập phải có ít nhất 3 ký tự");
                }

                // Validate password
                if (password.length < 6) {
                    throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
                }

                const userRepository = await initRepository(UserEntity);

                // Handle login
                if (action === "login") {
                    const user = await userRepository.findOne({ where: { username } });
                    if (!user) {
                        throw new Error("Tài khoản không tồn tại");
                    }

                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Mật khẩu không chính xác");
                    }

                    return {
                        id: user.id.toString(),
                        username: user.username,
                        balance: user.balance,
                        referral_code: user.referral_code,
                        image: "/client/assets/images/placeholder_user_image.jpg",
                        role: user.role,
                    };
                }

                // Handle register
                if (action === "register") {
                    const existingUser = await userRepository.findOne({ where: { username } });
                    if (existingUser) {
                        throw new Error("Tên đăng nhập đã tồn tại");
                    }

                    const userCode = `USER${Math.random()
                        .toString(36)
                        .substring(2, 8)
                        .toUpperCase()}`;
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const initialBalance = Number(process.env.INITIAL_BALANCE) || 0;

                    // Handle referral code if provided
                    if (referral_code) {
                        const referrer = await userRepository.findOneBy({ user_code: referral_code });
                        if (referrer) {
                            await userRepository.update(
                                { id: referrer.id },
                                { balance: referrer.balance + 20000 }
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

                    return {
                        id: newUser.id.toString(),
                        username: newUser.username,
                        balance: newUser.balance,
                        referral_code: newUser.referral_code,
                        image: "/client/assets/images/placeholder_user_image.jpg",
                        role: newUser.role,
                    };
                }

                throw new Error("Hành động không hợp lệ");
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.balance = user.balance;
                token.referral_code = user.referral_code;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.balance = token.balance as number;
                session.user.referral_code = token.referral_code as string;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: { signIn: "/dang-nhap" },
    secret: process.env.NEXTAUTH_SECRET || "your-nextauth-secret",
};