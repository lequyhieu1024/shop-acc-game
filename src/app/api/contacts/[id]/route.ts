// app/api/contacts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { Contact } from "@/app/models/entities/Contact";

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const id = parseInt((await params).id);
        if (isNaN(id)) {
            return NextResponse.json({ result: false, message: "ID không hợp lệ." }, { status: 400 });
        }

        const contactRepo = await initRepository(Contact);
        const contact = await contactRepo.findOne({ where: { id } });

        if (!contact) {
            return NextResponse.json({ result: false, message: "Không tìm thấy liên hệ." }, { status: 404 });
        }

        contact.is_feedback = !contact.is_feedback; // toggle giá trị
        await contactRepo.save(contact);

        return NextResponse.json({
            result: true,
            message: `Đã cập nhật is_feedback thành ${contact.is_feedback}`,
            data: contact
        });
    } catch (e) {
        return NextResponse.json({
            result: false,
            message: (e as Error).message || "Lỗi khi cập nhật liên hệ."
        }, { status: 500 });
    }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const contactRepo = await initRepository(Contact);
    const id: string = (await params).id;
    await contactRepo.softDelete(id);
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