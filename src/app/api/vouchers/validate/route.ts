import { NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { Voucher } from "@/app/models/entities/Voucher";
import {Order} from "@/app/models/entities/Order";
import {authOptions} from "@/app/auth/auth";
import {getServerSession} from "next-auth";
import {IsNull} from "typeorm";

export async function POST(request: Request) {
    try {
        const { code, amount } = await request.json();
        const session = await getServerSession(authOptions);
        if (!code || typeof amount !== "number" || amount < 0) {
            return NextResponse.json(
                { result: false, message: "Mã voucher hoặc tổng tiền đơn hàng không hợp lệ" },
                { status: 400 }
            );
        }

        const voucherRepository = await initRepository(Voucher);
        const orderRepository = await initRepository(Order);

        const voucher = await voucherRepository.findOne({
            where: { code, deleted_at: null },
        });

        if (!voucher) {
            return NextResponse.json(
                { result: false, message: "Mã voucher không tồn tại" },
                { status: 400 }
            );
        }

        if (voucher.status !== 'active') {
            return NextResponse.json(
                { result: false, message: "Voucher không hoạt động" },
                { status: 400 }
            );
        }

        const now = new Date();
        if (now < voucher.issue_date || now > voucher.expired_date) {
            return NextResponse.json(
                { result: false, message: "Voucher đã hết hạn hoặc chưa bắt đầu" },
                { status: 400 }
            );
        }

        if (voucher.quantity <= 0) {
            return NextResponse.json(
                { result: false, message: "Voucher đã hết số lượng" },
                { status: 400 }
            );
        }

        const isExistingVoucher = await orderRepository.findOneBy({
            voucher_id: voucher.id,
            user_id: session!.user.id,
            deleted_at: IsNull(),
        });

        if (isExistingVoucher) {
            return NextResponse.json(
                { result: false, message: "Bạn đã dùng voucher này rồi" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            result: true,
            discount: Number(voucher.value),
            message: "Voucher hợp lệ",
        });
    } catch (error) {
        console.error("Có lỗi xảy ra khi xác thực voucher:", error);
        return NextResponse.json(
            { result: false, message: "Lỗi Server 500 !" },
            { status: 500 }
        );
    }
}