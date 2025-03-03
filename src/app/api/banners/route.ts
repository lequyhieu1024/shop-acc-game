import { initRepository } from "@/app/models/connect";
import { NextRequest, NextResponse } from "next/server";
import { uploadFileToPinata } from "@/app/services/pinataService";
import { Banner } from "@/app/models/entities/Banner";

export const GET = async () => {
  try {
    const bannerRepo = await initRepository(Banner);
    const banners = await bannerRepo.find();
    return NextResponse.json({ banners });
  } catch (e) {
    return NextResponse.json({
      result: false,
      message: (e as Error).message
    });
  }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const bannerRepo = await initRepository(Banner);
    const formData = await req.formData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newData: any = Object.fromEntries(formData.entries());
    if (!newData.image_url) {
      return NextResponse.json(
        {
          result: false,
          message: "Invalid data"
        },
        { status: 400 }
      );
    }
    const imgUrl: string | NextResponse = await uploadFileToPinata(
      newData.image_url
    );

    const newBanner = bannerRepo.create({
      is_active: newData.is_active,
      image_url: imgUrl
    });
    await bannerRepo.save(newBanner);
    return NextResponse.json(
      {
        category: newBanner
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { result: false, message: "Lỗi server", error: (e as Error).message },
      { status: 500 }
    );
  }
};
