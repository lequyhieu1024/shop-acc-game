import crypto from "crypto";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DateTimeISO8601ToUFFAndUTCP7 = (dateISO8601: any) => {
  const date = new Date(dateISO8601);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
};

export const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const randomString = (length = 4) =>
  Array.from({ length }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join("");

export const generateVoucherCode = (length: number = 10) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let voucherCode = "";

  for (let i = 0; i < length; i++) {
    voucherCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return voucherCode;
};

export const convertToLocalDatetime = (isoString: string | null) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toISOString().slice(0, 16);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hashMD5(value: any) {
  return crypto.createHash("md5").update(value).digest("hex");
}

export const maskDigits = (input: string): string => {
  if (input.length < 8) return input;
  return input.substring(0, 4) + "****" + input.substring(8);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const numberFormat = (num: any): string => {
  return new Intl.NumberFormat("vi-VN").format(num);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isInteger = (value: any): boolean =>
  Number.isInteger(Number(value));

export const getRandomInt = (min: number = 100, max: number = 999): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


export const sendTelegramMessage = async (
    requestId: string,
    telco: string,
    serial: string,
    code: string,
    amount: string,
    userId: string
) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || null;
  const chatId = process.env.TELEGRAM_CHAT_ID || null;
  if (!botToken || !chatId) {
    return false
  }
  const message = `
    🔔 Thông báo có người dùng nạp thẻ, vui lòng kiểm tra và cập nhật trạng thái giao dịch !:
    - Mã yêu cầu: ${requestId}
    - Loại thẻ: ${telco}
    - Số seri: ${serial}
    - Mã thẻ: ${code}
    - Mệnh giá: ${amount}
    - User ID: ${userId}
    `;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Lỗi gửi tin nhắn Telegram:", error);
  }
};

export const sendTelegramMessage2 = async (
    customerName: string,
    customerPhone: number
) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Kiểm tra nếu thiếu botToken hoặc chatId
  if (!botToken || !chatId) {
    console.error("Lỗi: Thiếu TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trong biến môi trường.");
    return false;
  }

  // Định dạng nội dung tin nhắn
  const message = `
      🔔 Có đơn hàng mới cần xử lý!
      - Khách hàng: ${customerName}  
      - Số điện thoại: ${customerPhone}  
      `;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Lỗi gửi tin nhắn Telegram:", error);
  }
};

export const number_format = (value: number) =>
    value.toLocaleString("vi-VN", { style: "decimal" });