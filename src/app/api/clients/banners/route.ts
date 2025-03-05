import {NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {Banner} from "@/app/models/entities/Banner";
export const GET = async () => {
    try {
        const bannerRepo = await initRepository(Banner)
        const banners = await bannerRepo
            .createQueryBuilder("banner")
            .select(["banner.image_url"])
            .where("banner.is_active = :active", { active: true })
            .getMany();
        return NextResponse.json({
            banners
        }, {status: 200})
    } catch (e) {
        return NextResponse.json(
            {
                result: false,
                message: (e as Error).message || "Lỗi server nội bộ",
            },
            {status: 500}
        );
    }
}