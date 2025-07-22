import path from "path";
import fs from "fs/promises";
import {randomString} from "@/app/services/commonService";

export const saveFileToUploads = async (file: File): Promise<string> => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filename = `${randomString()}-${file.name}`;
    const filePath = path.join(uploadDir, filename);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return `${process.env.NEXT_PUBLIC_UPLOAD_URL || "https://shopcutigaming.com/"}uploads/${filename}`;
};