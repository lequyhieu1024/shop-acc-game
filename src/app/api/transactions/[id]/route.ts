import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {CardStatus, CardTransaction} from "@/app/models/entities/CardTransaction";
import {User} from "@/app/models/entities/User";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const transRepo = await initRepository(CardTransaction)
        const userRepo = await initRepository(User)
        const transaction = await transRepo.findOneBy({id: Number((await params).id)})
        const user = await userRepo.findOneBy({id: transaction?.user_id})
        return NextResponse.json({transaction, user})
    } catch (e) {
        console.log((e as Error).message)
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        }, {status: 500})
    }
}

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { status } = await req.json();
        if (![CardStatus.SUCCESS_CORRECT, CardStatus.SUCCESS_INCORRECT, CardStatus.FAILED].includes(status)) {
            return NextResponse.json(
                { result: false, message: "Trạng thái không hợp lệ!" },
                { status: 400 }
            );
        }

        const cardTransRepo = await initRepository(CardTransaction);
        const userRepo = await initRepository(User);

        const transaction = await cardTransRepo.findOne({ where: { id: Number((await params).id) } });
        if (!transaction) {
            return NextResponse.json(
                { result: false, message: "Không tìm thấy giao dịch!" },
                { status: 404 }
            );
        }

        transaction.status = status;
        transaction.message =
            status === CardStatus.SUCCESS_CORRECT
                ? "Thành công"
                : status === CardStatus.SUCCESS_INCORRECT
                    ? "Thành công, sai mệnh giá"
                    : "Thất bại";

        if (status === CardStatus.SUCCESS_CORRECT) {
            const user = await userRepo.findOne({ where: { id: transaction.user_id } });
            if (!user) {
                return NextResponse.json(
                    { result: false, message: "Không tìm thấy người dùng!" },
                    { status: 404 }
                );
            }
            user.balance = (user.balance || 0) + transaction.amount;
            await userRepo.save(user);
        }

        await cardTransRepo.save(transaction);

        return NextResponse.json(
            { result: true, data: transaction },
            { status: 200 }
        );
    } catch (e) {
        console.error("Lỗi cập nhật giao dịch:", e);
        return NextResponse.json(
            { result: false, message: (e as Error).message || "Lỗi server nội bộ" },
            { status: 500 }
        );
    }
};