import {initRepository} from "@/app/models/connect";
import {Banner} from "@/app/models/entities/Banner";
import {NextRequest, NextResponse} from "next/server";

export async function PATCH(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        const bannerRepository = await initRepository(Banner);
        const bannerId: string = (await params).id;

        const banner = await bannerRepository.findOne({ where: { id: Number(bannerId) } });
        if (!banner) {
            return NextResponse.json({ result: false, message: "Banner không tồn tại" }, { status: 404 });
        }

        await bannerRepository.update(bannerId, { is_active: !banner.is_active });

        return NextResponse.json({ result: true, message: "Success" });
    } catch (e) {
        return NextResponse.json(
            { result: false, message: `Lỗi: ${(e as Error).message}` },
            { status: 500 }
        );
    }
}