// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertToInt(decimal: any) {
    const intValue = Math.floor(decimal);
    return intValue.toLocaleString('vi-VN');
}