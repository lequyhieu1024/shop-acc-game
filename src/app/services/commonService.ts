import crypto from "crypto";
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
