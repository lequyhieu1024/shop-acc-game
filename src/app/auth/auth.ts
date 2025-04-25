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
            },
            async authorize(credentials) {
                const { username, password, referral_code } = credentials || {};
                if (!username || !password) {
                    throw new Error("Tên đăng nhập và mật khẩu là bắt buộc");
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
                const user = await userRepository.findOne({ where: { username } });

                if (user) {
                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Thông tin đăng nhập không chính xác");
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

                // Kiểm tra username đã tồn tại chưa
                const existingUser = await userRepository.findOne({
                    where: { username },
                });
                if (existingUser) {
                    throw new Error("Tên đăng nhập đã tồn tại");
                }

                const userCode = `USER${Math.random()
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase()}`;
                const hashedPassword = await bcrypt.hash(password, 10);
                let initialBalance = 0;
                let referrerId = null;

                if (referral_code) {
                    initialBalance = Number(process.env.INITIAL_BALANCE) || 0;
                    const referrer = await userRepository.findOne({
                        where: { referral_code },
                    });
                    if (referrer) {
                        initialBalance += Number(process.env.INITIAL_BALANCE);
                        await userRepository.update(
                            { id: referrer.id },
                            { balance: referrer.balance + 20000 }
                        );
                        referrerId = referrer.id;
                    }
                }

                const newUser = userRepository.create({
                    user_code: userCode,
                    username,
                    password: hashedPassword,
                    phone: "",
                    balance: initialBalance,
                    referral_code: referral_code,
                    referrer_id: referrerId,
                    number_of_free_draw: 1,
                    role: "user",
                    is_for_sale: 0, // Mặc định không cho phép bán
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