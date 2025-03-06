import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {Voucher} from "@/app/models/entities/Voucher";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> })  => {
    try {
        const voucherId: string = (await params).id;
        const voucherRepo = await initRepository(Voucher);
        const voucher: object | null = await voucherRepo.findOneBy({id: Number(voucherId)})
        if (!voucher) {
            return NextResponse.json({
                result: false,
                message: "Voucher not found server"
            }, {status: 400})
        }
        return NextResponse.json({voucher})
    } catch (e) {
        return NextResponse.json({ result: false, message: `Lỗi: ${(e as Error).message}` }, { status: 500 });
    }
}

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> })  => {
    try {
        const voucherId: string = (await params).id;
        const voucherRepo = await initRepository(Voucher);
        const voucher: object | null = await voucherRepo.findOneBy({id: Number(voucherId)})
        if (!voucher) {
            return NextResponse.json({
                result: false,
                message: "Voucher not found server"
            }, {status: 400})
        }
        const data = await req.json();
        const updatedVoucher = voucherRepo.update(Number(voucherId), data)
        return NextResponse.json({updatedVoucher}, {status: 200});
    } catch (e) {
        return NextResponse.json({ result: false, message: `Lỗi: ${(e as Error).message}` }, { status: 500 });
    }
}

export const DELETE = async (req:Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const voucherRepo = await initRepository(Voucher);
        const voucherId: string = (await params).id;
        await voucherRepo.softDelete(voucherId);
        return NextResponse.json({
            result: true,
            message: "Soft delete voucher successfully!"
        }, {status: 200})
    } catch (e) {
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        }, {status: 500})
    }
}