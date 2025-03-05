import { initRepository } from "@/app/models/connect";
import { Category } from "@/app/models/entities/Category";
import { NextResponse } from "next/server";
import { uploadFileToPinata } from "@/app/services/pinataService";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const categoryId: string = (await params).id;
    const categoryRepository = await initRepository(Category);
    const category: object | null = await categoryRepository.findOne({
      where: { id: Number(categoryId) }
    });
    if (!category) {
      return NextResponse.json(
        {
          result: false,
          message: "Category not found server"
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ category });
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
    const categoryId: string = (await params).id;
    const categoryRepo = await initRepository(Category);
    const formData = await req.formData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newData: any = Object.fromEntries(formData.entries());

    if (!newData.name)
      return NextResponse.json(
        { result: false, message: "Invalid data" },
        { status: 400 }
      );

    if (newData.image instanceof Blob) {
      newData.image = await uploadFileToPinata(newData.image, newData.name);
    }
    await categoryRepo.update(categoryId, newData);
    return NextResponse.json({
      result: true,
      message: "Success",
      data: newData
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
    const categoryRepo = await initRepository(Category);
    const categoryId: string = (await params).id;
    await categoryRepo.softDelete(categoryId);
    return NextResponse.json(
      {
        result: true,
        message: "Soft delete category successfully!"
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
