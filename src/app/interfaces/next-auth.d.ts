import { User as DefaultUser } from "next-auth";

declare module "next-auth" {
    interface User extends DefaultUser {
        id: string;
        username: string;
        balance: number;
        referral_code: string;
        role: string;
    }

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