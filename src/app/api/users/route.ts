import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/models/entities/User";
import { initRepository } from "@/app/models/connect";

export async function GET(req: NextRequest) {
    try {
        const userRepository = await initRepository(User);
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");
        const phone = searchParams.get("phone");
        const role = searchParams.get("role");
        const created_at = searchParams.get("created_at");
        const page = parseInt(searchParams.get("page") || "1");
        const size = parseInt(searchParams.get("size") || "10");

        const query = userRepository
            .createQueryBuilder("user")
            .where("user.deleted_at IS NULL");

        if (username) {
            query.andWhere("user.username LIKE :username", { username: `%${username}%` });
        }

        if (phone) {
            query.andWhere("user.phone LIKE :phone", { phone: `%${phone}%` });
        }

        if (role) {
            query.andWhere("user.role = :role", { role });
        }

        if (created_at) {
            query.andWhere("DATE(user.created_at) = :created_at", { created_at });
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
