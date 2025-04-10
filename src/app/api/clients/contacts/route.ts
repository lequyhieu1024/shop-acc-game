// app/api/contacts/route.ts
import { NextResponse, NextRequest } from "next/server";
import { initRepository } from "@/app/models/connect";
import { Contact } from "@/app/models/entities/Contact";

function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidPhone(phone: string) {
    const phoneRegex = /^(\+84|0)[3|5|7|8|9]\d{8}$/;
    return phoneRegex.test(phone);
}

export const POST = async (req: NextRequest) => {
    try {
        const { fullName, email, message, phone } = await req.json();

        const errors: string[] = [];

        if (!fullName || fullName.trim().length < 2) {
            errors.push("Họ tên phải có ít nhất 2 ký tự.");
        }

        if (!email || !isValidEmail(email)) {
            errors.push("Email không hợp lệ.");
        }

        if (!message || message.trim().length < 2) {
            errors.push("Nội dung tin nhắn phải có ít nhất 2 ký tự.");
        }

        if (phone && !isValidPhone(phone)) {
            errors.push("Số điện thoại không hợp lệ.");
        }

        if (errors.length > 0) {
            return NextResponse.json({
                result: false,
                message: "Dữ liệu không hợp lệ.",
                errors
            }, { status: 400 });
        }

        const contactRepo = await initRepository(Contact);
        const contact = contactRepo.create({ fullName, email, message, phone });
        await contactRepo.save(contact);

        return NextResponse.json({
            result: true,
            message: "Gửi liên hệ thành công."
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json({
            result: false,
            message: (e as Error).message || "Lỗi server khi gửi liên hệ."
        }, { status: 500 });
    }
};
