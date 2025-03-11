import {initRepository} from "@/app/models/connect";
import {NextResponse} from "next/server";
import {Voucher} from "@/app/models/entities/Voucher";

export const GET = async () => {
    try {
        const voucherRepository = await initRepository(Voucher);
        const vouchers = await voucherRepository.find();
        return NextResponse.json({vouchers});
    } catch (e) {
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        })
    }
}
