import {initRepository} from "@/app/models/connect";
import {Banner} from "@/app/models/entities/Banner";
import {NextResponse} from "next/server";

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const bannerRepository = await initRepository(Banner);
        const bannerId: string = params.id
        const banner = await bannerRepository.findOne({where: {id: Number(bannerId)}})

        await bannerRepository.update(bannerId, {is_active: !banner?.is_active});
        return NextResponse.json({ result: true, message: "Success"});
    } catch (e) {
        return NextResponse.json({ result: false, message: `Lỗi: ${(e as Error).message}` }, { status: 500 });
    }
};