import { initRepository } from "@/app/models/connect";
import { LuckyDraw } from "@/app/models/entities/LuckyDraw";
import {NextResponse} from "next/server";
import {IsNull, MoreThanOrEqual, Not} from "typeorm";
import {LuckyDrawItem} from "@/app/models/entities/LuckyDrawItem";

export const GET = async () => {
    try {
        const luckyDrawRepo = await initRepository(LuckyDraw);
        // const luckyDrawItemRepo = await initRepository(LuckyDrawItem)
        const currentDate = new Date();

        const luckyDraws = await luckyDrawRepo.find({
            where: [
                { is_no_expired: true },
                {
                    expired_date: MoreThanOrEqual(currentDate) || Not(IsNull()),
                },
            ],
        });

        // const luckyDrawsItems = await luckyDrawItemRepo.findBy({lucky_draw_id: })

        return NextResponse.json({
            luckyDraws
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json(
            { message: (e as Error).message },
            { status: 500 }
        );
    }
};