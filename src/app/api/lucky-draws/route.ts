import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {LuckyDraw} from "@/app/models/entities/LuckyDraw";
import {LuckyDrawItem} from "@/app/models/entities/LuckyDrawItem";

export const GET = async (req: NextRequest) => {
    try {
        const luckyDrawRepo = await initRepository(LuckyDraw);

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const [luckyDraws, total] = await luckyDrawRepo.findAndCount({
            skip,
            take: limit,
            order: {
                created_at: "DESC",
            },
        });

        return NextResponse.json({
            success: true,
            luckyDraws,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json(
            { message: (e as Error).message },
            { status: 500 }
        );
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const luckyDrawRepo = await initRepository(LuckyDraw);
        const luckyDrawItemRepo = await initRepository(LuckyDrawItem);

        const data = await req.json();
        
        if (!data.name || !data.type || !data.amount_draw || !data.quality) {
            return NextResponse.json({ message: "Thiếu các trường bắt buộc" }, { status: 400 });
        }
        if (!["voucher", "acc_game", "text", "combine"].includes(data.type)) {
            return NextResponse.json({ message: "Loại vòng quay không hợp lệ" }, { status: 400 });
        }
        if (!Array.isArray(data.items) || data.items.length === 0) {
            return NextResponse.json({ message: "Danh sách phần thưởng không hợp lệ" }, { status: 400 });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const totalProbability = data.items.reduce((sum: number, item: any) => sum + (item.probability || 0), 0);
        if (totalProbability !== 1) {
            return NextResponse.json({ message: "Tổng tỉ lệ trúng phải bằng 1" }, { status: 400 });
        }
        
        const luckyDraw = luckyDrawRepo.create({
            name: data.name,
            type: data.type,
            amount_draw: data.amount_draw,
            quality: data.quality,
            accept_draw: data.accept_draw === 1 || data.accept_draw === true,
            issue_date: data.is_no_expired ? null : new Date(data.issue_date),
            expired_date: data.is_no_expired ? null : new Date(data.expired_date),
            is_no_expired: data.is_no_expired || false,
        });

        const savedLuckyDraw = await luckyDrawRepo.save(luckyDraw);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items = data.items.map((item: any) => {
            return luckyDrawItemRepo.create({
                lucky_draw_id: savedLuckyDraw.id,
                item_type: item.item_type,
                item_id: item.item_id || null,
                item_text: item.item_text || (item.item_type === "no_luck" ? "Chúc bạn may mắn lần sau" : null),
                probability: item.probability,
            });
        });

        const savedItems = await luckyDrawItemRepo.save(items);

        return NextResponse.json({ luckyDraw: savedLuckyDraw, items: savedItems }, { status: 201 });
    } catch (e) {
        return NextResponse.json({ message: (e as Error).message }, { status: 500 });
    }
};