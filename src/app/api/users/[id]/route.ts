import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {User} from "@/app/models/entities/User";

export async function PATCH(req: NextRequest) {
    try {
        const { pathname } = new URL(req.url);
        const id = pathname.split("/").pop();

        if (!id) {
            return NextResponse.json(
                { message: "ID người dùng không hợp lệ." },
                { status: 400 }
            );
        }

        const userRepository = await initRepository(User);
        const user = await userRepository.findOne({ where: { id: parseInt(id) } });

        if (!user) {
            return NextResponse.json(
                { message: "Người dùng không tồn tại." },
                { status: 404 }
            );
        }

        const body = await req.json();
        const { balance } = body;

        console.log(balance)

        await userRepository.update(
            { id: Number(id) },
            { balance: Number(balance) }
        );

        return NextResponse.json(
            { message: "Cập nhật số dư người dùng thành công." },
            { status: 200 }
        );
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { pathname } = new URL(req.url);
        const id = pathname.split("/").pop();

        if (!id) {
            return NextResponse.json(
                { message: "ID người dùng không hợp lệ." },
                { status: 400 }
            );
        }

        const userRepository = await initRepository(User);
        const user = await userRepository.findOne({ where: { id: parseInt(id) } });

        if (!user) {
            return NextResponse.json(
                { message: "Người dùng không tồn tại." },
                { status: 404 }
            );
        }

        await userRepository.softDelete({ id: parseInt(id) });

        return NextResponse.json(
            { message: "Xóa người dùng thành công." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { message: "Có lỗi xảy ra khi xóa người dùng." },
            { status: 500 }
        );
    }
}