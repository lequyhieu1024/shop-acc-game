import { initRepository } from "@/app/models/connect";
import { NextRequest, NextResponse } from "next/server";
import { uploadFileToPinata } from "@/app/services/pinataService";
import { NotificationBanner } from "@/app/models/entities/NotificationBanner";

export const GET = async () => {
  try {
    const bannerRepo = await initRepository(NotificationBanner);
    const banners = await bannerRepo.find();
    return NextResponse.json({ banners });
  } catch (e) {
    return NextResponse.json({
      result: false,
      message: (e as Error).message,
    });
  }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const bannerRepo = await initRepository(NotificationBanner);
    const formData = await req.formData();

    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const start_time = formData.get("start_time")?.toString();
    const end_time = formData.get("end_time")?.toString();
    const is_active = formData.get("is_active") === "true";

    if (!title) {
      return NextResponse.json(
        { result: false, message: "Tiêu đề là bắt buộc." },
        { status: 400 }
      );
    }

    // Xử lý file ảnh nếu có
    let image_url: string | undefined = undefined;
    const imageFile = formData.get("image_url");
    if (imageFile && imageFile instanceof File) {
      const uploaded = await uploadFileToPinata(imageFile);
      if (typeof uploaded !== "string") return uploaded;
      image_url = uploaded;
    }

    const newBanner = bannerRepo.create({
      title,
      content,
      image_url,
      is_active,
      start_time: start_time ? new Date(start_time) : null,
      end_time: end_time ? new Date(end_time) : null,
    });

    await bannerRepo.save(newBanner);

    return NextResponse.json({ banner: newBanner }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      {
        result: false,
        message: "Lỗi server khi tạo banner.",
        error: (e as Error).message,
      },
      { status: 500 }
    );
  }
};
