import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {Voucher} from "@/app/models/entities/Voucher";

export const GET = async (req: NextRequest, { params }: { params: { id: string } })  => {
    try {
        const voucherId: string = params.id;
        console.log(voucherId)
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