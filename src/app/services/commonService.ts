export const DateTimeISO8601ToUFFAndUTCP7 = (dateISO8601: any) => {
    const date = new Date(dateISO8601);
    return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}

export const toSlug = (str: string): string => {
    return str
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
};

export const randomString = (length = 4) =>
    Array.from({ length }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join("");

export const generateVoucherCode = (length: number = 10) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let voucherCode = ""

    for (let i = 0; i < length; i++) {
        voucherCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return voucherCode;
};