import { initRepository } from "@/app/models/connect";
import { NotificationBanner } from "@/app/models/entities/NotificationBanner";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ result: false, message: "ID không hợp lệ." }, { status: 400 });
        }

        const notiBannerRepo = await initRepository(NotificationBanner);
        const notiBanner = await notiBannerRepo.findOne({ where: { id } });

        if (!notiBanner) {
            return NextResponse.json({ result: false, message: "Không tìm thấy liên hệ." }, { status: 404 });
        }

        notiBanner.is_active = !notiBanner.is_active; // toggle giá trị
        await notiBannerRepo.save(notiBanner);

        return NextResponse.json({
            result: true,
            message: `Đã cập nhật is_active thành ${notiBanner.is_active}`,
            data: notiBanner
        });
    } catch (e) {
        return NextResponse.json({
            result: false,
            message: (e as Error).message || "Lỗi khi cập nhật liên hệ."
        }, { status: 500 });
    }
};