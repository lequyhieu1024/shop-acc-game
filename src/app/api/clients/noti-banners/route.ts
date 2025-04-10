import { initRepository } from "@/app/models/connect";
import { NextRequest, NextResponse } from "next/server";
import { uploadFileToPinata } from "@/app/services/pinataService";
import { NotificationBanner } from "@/app/models/entities/NotificationBanner";

export const GET = async () => {
    try {
      const bannerRepo = await initRepository(NotificationBanner);
  
      const latestActiveBanner = await bannerRepo.findOne({
        where: { is_active: true },
        order: { created_at: 'DESC' }, // Giả sử có trường created_at
      });
  
      return NextResponse.json({ banner: latestActiveBanner });
    } catch (e) {
      return NextResponse.json({
        result: false,
        message: (e as Error).message,
      });
    }
  };
  