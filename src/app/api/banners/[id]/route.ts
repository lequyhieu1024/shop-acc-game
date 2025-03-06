import { initRepository } from "@/app/models/connect";
import { NextResponse } from "next/server";
import { uploadFileToPinata } from "@/app/services/pinataService";
import { Banner } from "@/app/models/entities/Banner";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const bannerId: string = (await params).id;
    const bannerRepository = await initRepository(Banner);
    const banner: object | null = await bannerRepository.findOne({
      where: { id: Number(bannerId) }
    });
    if (!banner) {
      return NextResponse.json(
        {
          result: false,
          message: "Banner not found server"
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ banner });
  } catch (e) {
    return NextResponse.json(
      {
        result: false,
        message: (e as Error).message
      },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const bannerRepository = await initRepository(Banner);
    const bannerId: string = (await params).id;
    const banner = await bannerRepository.findOne({
      where: { id: Number(bannerId) }
    });
    const formData = await req.formData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newData: any = Object.fromEntries(formData.entries());
    newData.is_active = newData.is_active === "1";
    console.log(newData);
    if (!newData.image_url) {
      newData.image_url = banner?.image_url;
    } else {
      newData.image_url = await uploadFileToPinata(newData.image_url);
    }

    await bannerRepository.update(bannerId, newData);
    return NextResponse.json({
      result: true,
      message: "Success",
      banner: newData
    });
  } catch (e) {
    return NextResponse.json(
      { result: false, message: `Lỗi: ${(e as Error).message}` },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const bannerRepo = await initRepository(Banner);
    const bannerId: string = (await params).id;
    await bannerRepo.softDelete(bannerId);
    return NextResponse.json(
      {
        result: true,
        message: "Soft delete banner successfully!"
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        result: false,
        message: (e as Error).message
      },
      { status: 500 }
    );
  }
};
