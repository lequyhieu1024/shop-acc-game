import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/models/entities/User";
import { initRepository } from "@/app/models/connect";

export async function GET(req: NextRequest) {
    try {
        const userRepository = await initRepository(User);
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");
        const phone = searchParams.get("phone");
        const user_code = searchParams.get("user_code");
        const user_id = searchParams.get("user_id");
        const page = parseInt(searchParams.get("page") || "1");
        const size = parseInt(searchParams.get("size") || "10");

        const query = userRepository
            .createQueryBuilder("user")
            .where("user.deleted_at IS NULL").orderBy("user.id", "DESC");

        if (user_id) {
            query.andWhere("user.id LIKE :id", { id: `%${user_id}%` });
        }

        if (user_code) {
            query.andWhere("user.user_code LIKE :user_code", { user_code: `%${user_code}%` });
        }

        if (username) {
            query.andWhere("user.username LIKE :username", { username: `%${username}%` });
        }

        if (phone) {
            query.andWhere("user.phone LIKE :phone", { phone: `%${phone}%` });
        }

        query.skip((page - 1) * size).take(size);

        const [users, total] = await query.getManyAndCount();

        return NextResponse.json(
            {
                users,
                pagination: {
                    total,
                    page,
                    size,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "Có lỗi xảy ra khi lấy danh sách người dùng: " + error },
            { status: 500 }
        );
    }
}
