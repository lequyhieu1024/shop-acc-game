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

    const imageFile = formData.get("image_url");
    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json(
          { result: false, message: "Invalid image file" },
          { status: 400 }
      );
    }

    const is_active = formData.get("is_active") === "1";

    const imgUrl: string | NextResponse = await uploadFileToPinata(imageFile);
    if (typeof imgUrl !== "string") {
      return imgUrl;
    }

    const newBanner = bannerRepo.create({
      is_active,
      image_url: imgUrl
    });

    await bannerRepo.save(newBanner);

    return NextResponse.json(
        { banner: newBanner },
        { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
        { result: false, message: "Lỗi server", error: (e as Error).message },
        { status: 500 }
    );
  }
};
