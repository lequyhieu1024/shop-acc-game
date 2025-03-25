import { initRepository } from "@/app/models/connect";
import { Category } from "@/app/models/entities/Category";
import { NextResponse } from "next/server";
import { uploadFileToPinata } from "@/app/services/pinataService";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const categoryId: string = (await params).id;
    const categoryRepo = await initRepository(Category);
    const formData = await req.formData();

    // Lấy dữ liệu hiện tại của category
    const existingCategory = await categoryRepo.findOne({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { result: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newData: any = Object.fromEntries(formData.entries());

    if (!newData.name) {
      return NextResponse.json(
        { result: false, message: "Invalid data" },
        { status: 400 }
      );
    }

    // Kiểm tra nếu có ảnh mới thì upload lên Pinata, nếu không thì giữ ảnh cũ
    if (newData.image instanceof Blob) {
      newData.image = await uploadFileToPinata(newData.image, newData.name);
    } else {
      newData.image = existingCategory.image; // Giữ ảnh cũ nếu không có ảnh mới
    }

    await categoryRepo.update(categoryId, newData);

    return NextResponse.json({
      result: true,
      message: "Success",
      data: { ...existingCategory, ...newData }, // Gửi dữ liệu cập nhật
    });
  } catch (e) {
    return NextResponse.json(
      { result: false, message: `Lỗi: ${(e as Error).message}` },
      { status: 500 }
    );
  }
};
