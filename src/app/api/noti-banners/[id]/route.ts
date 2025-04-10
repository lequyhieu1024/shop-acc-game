import { initRepository } from "@/app/models/connect";
import { NotificationBanner } from "@/app/models/entities/NotificationBanner";
import { uploadFileToPinata } from "@/app/services/pinataService";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const repo = await initRepository(NotificationBanner);
    const banner = await repo.findOneBy({ id: Number(params.id) });

    if (!banner) {
      return NextResponse.json(
        { result: false, message: "Không tìm thấy banner." },
        { status: 404 }
      );
    }

    return NextResponse.json({ banner });
  } catch (e) {
    return NextResponse.json(
      { result: false, message: "Lỗi server", error: (e as Error).message },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  _: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const repo = await initRepository(NotificationBanner);
    const banner = await repo.findOneBy({ id: Number(params.id) });

    if (!banner) {
      return NextResponse.json(
        { result: false, message: "Không tìm thấy banner." },
        { status: 404 }
      );
    }

    await repo.softRemove(banner); // dùng softDelete nếu bạn dùng @DeleteDateColumn
    return NextResponse.json({ result: true, message: "Xóa thành công." });
  } catch (e) {
    return NextResponse.json(
      { result: false, message: "Lỗi khi xóa", error: (e as Error).message },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const repo = await initRepository(NotificationBanner);
    const id = Number(params.id);
    const banner = await repo.findOneBy({ id });

    if (!banner) {
      return NextResponse.json(
        { result: false, message: "Không tìm thấy banner." },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const data: any = Object.fromEntries(formData.entries());

    // Convert is_active từ string sang boolean
    data.is_active = data.is_active === "1";

    // Nếu không có ảnh mới thì giữ ảnh cũ
    if (!data.image_url) {
      data.image_url = banner.image_url;
    } else {
      data.image_url = await uploadFileToPinata(data.image_url);
    }

    // Cập nhật các trường cần thiết
    repo.merge(banner, {
      title: data.title,
      content: data.content,
      is_active: data.is_active,
      start_time: data.start_time,
      end_time: data.end_time,
      image_url: data.image_url
    });

    await repo.save(banner);

    return NextResponse.json({ result: true, message: "Cập nhật thành công", banner });
  } catch (e) {
    return NextResponse.json(
      { result: false, message: `Lỗi: ${(e as Error).message}` },
      { status: 500 }
    );
  }
};
