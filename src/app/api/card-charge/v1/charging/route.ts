import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {CardTransaction} from "@/app/models/entities/CardTransaction";
import {cardService} from "@/app/services/cardChargeService";

// Hàm kiểm tra số nguyên (đã được import từ commonService, không cần định nghĩa lại)
const isInteger = (value: string): boolean => /^\d+$/.test(value);

const cardRules: Record<string, { code: number; serial?: number }> = {
    VIETTEL: {code: 15, serial: 14},
    VINAPHONE: {code: 14, serial: 14},
    MOBIFONE: {code: 12, serial: 15},
    VNMOBI: {code: 12},
    GATE: {code: 10, serial: 10},
    ZING: {code: 9, serial: 12},
};

export const POST = async (req: NextRequest) => {
    try {
        const typeFromQuery = req.nextUrl.searchParams.get("type");
        const cardTransRepo = await initRepository(CardTransaction);
        const data = await req.json();
        console.log("Received data:", data);

        if (typeFromQuery === "single") {
            if (!data.telco || !data.code || !data.serial || !data.amount) {
                return NextResponse.json(
                    {result: false, message: "Thiếu thông tin bắt buộc!"},
                    {status: 400}
                );
            }

            const telco = data.telco.toUpperCase();
            const code = data.code;
            const serial = data.serial;
            const amount = data.amount;

            if (!isInteger(code)) {
                return NextResponse.json(
                    {result: false, message: "Mã thẻ phải là số!"},
                    {status: 400}
                );
            }
            if (!isInteger(serial)) {
                return NextResponse.json(
                    {result: false, message: "Số seri phải là số!"},
                    {status: 400}
                );
            }

            const rule = cardRules[telco];
            if (!rule) {
                return NextResponse.json(
                    {result: false, message: "Nhà mạng không hợp lệ!"},
                    {status: 400}
                );
            }

            if (code.length !== rule.code) {
                return NextResponse.json(
                    {
                        result: false,
                        message: `Mã thẻ của ${telco} phải có ${rule.code} ký tự!`,
                    },
                    {status: 400}
                );
            }

            if (rule.serial && serial.length !== rule.serial) {
                return NextResponse.json(
                    {
                        result: false,
                        message: `Serial của ${telco} phải có ${rule.serial} ký tự!`,
                    },
                    {status: 400}
                );
            }

            const cardData = await cardService.chargeCard({telco, code, serial, amount});
            console.log(cardData)
            if (cardData.status === 3) {
                cardData.amount = 0;
                // return NextResponse.json(
                //     { result: false, message: "Thẻ không hợp lệ!" },
                //     { status: 400 }
                // );
            }

            cardData.user_id = 1;
            cardData.command = "charge";
            const newTransLog = cardTransRepo.create(cardData);
            await cardTransRepo.save(newTransLog);

            return NextResponse.json({result: true, data: newTransLog}, {status: 200});
        } else if (typeFromQuery === "multiple") {
            if (!data.telco || !data.price || !data.code) {
                return NextResponse.json(
                    {result: false, message: "Thiếu thông tin bắt buộc!"},
                    {status: 400}
                );
            }

            const telco = data.telco.toUpperCase();
            const price = data.price;
            const codes = data.code.split("\n").map((line: string) => line.trim().split(" "));
            console.log(codes)

            const rule = cardRules[telco];
            if (!rule) {
                return NextResponse.json(
                    {result: false, message: "Nhà mạng không hợp lệ!"},
                    {status: 400}
                );
            }

            const transactions = [];
            const results = [];

            for (const [index, [code, serial]] of codes.entries()) {
                let errorMessage = null;

                if (!code || (rule.serial && !serial)) {
                    errorMessage = `Mã thẻ hoặc serial không đầy đủ (Hàng thứ ${index + 1})`;
                } else if (!isInteger(code)) {
                    errorMessage = `Mã thẻ ${code} phải là số (Hàng thứ ${index + 1})`;
                } else if (rule.serial && !isInteger(serial)) {
                    errorMessage = `Số seri ${serial} phải là số (Hàng thứ ${index + 1})`;
                } else if (code.length !== rule.code) {
                    errorMessage = `Mã thẻ của ${telco} (${code}) phải có ${rule.code} ký tự (Hàng thứ ${index + 1})`;
                } else if (rule.serial && serial.length !== rule.serial) {
                    errorMessage = `Serial của ${telco} (${serial}) phải có ${rule.serial} ký tự (Hàng thứ ${index + 1})`;
                }

                let cardData;
                if (!errorMessage) {
                    try {
                        cardData = await cardService.chargeCard({telco, code, serial, amount: price});
                        if (cardData.status === 3) {
                            errorMessage = `Thẻ ${code} không hợp lệ (Hàng thứ ${index + 1})`;
                        }
                    } catch (error) {
                        errorMessage = (error as Error).message || `Lỗi khi xử lý thẻ ${code} (Hàng thứ ${index + 1})`;
                    }
                }

                const transactionData = errorMessage
                    ? {
                        telco,
                        code,
                        serial,
                        amount: price,
                        user_id: 5,
                        command: "charge",
                        status: 3,
                        message: errorMessage,
                    }
                    : {
                        ...cardData,
                        user_id: 5,
                        command: "charge",
                        status: cardData.status,
                    };

                const newTransLog = cardTransRepo.create(transactionData);
                transactions.push(newTransLog);

                results.push({
                    code,
                    serial,
                    success: !errorMessage,
                    message: errorMessage || "Thẻ được xử lý thành công",
                });
            }

            await cardTransRepo.save(transactions);

            return NextResponse.json(
                {
                    result: true,
                    data: transactions,
                    details: results,
                },
                {status: 200}
            );
        } else {
            return NextResponse.json(
                {result: false, message: "Type không hợp lệ! Vui lòng dùng single hoặc multiple."},
                {status: 400}
            );
        }
    } catch (e) {
        console.error("Lỗi xử lý nạp thẻ:", e);
        return NextResponse.json(
            {
                result: false,
                message: (e as Error).message || "Lỗi server nội bộ",
            },
            {status: 500}
        );
    }
};