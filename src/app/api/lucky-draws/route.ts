import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {LuckyDraw} from "@/app/models/entities/LuckyDraw";

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
        const data = await req.json();
        const luckyDraw = luckyDrawRepo.create(data);
        await luckyDrawRepo.save(luckyDraw);
        return NextResponse.json({luckyDraw});
    } catch (e) {
        return NextResponse.json(
            { message: (e as Error).message },
            { status: 500 }
        );
    }
}