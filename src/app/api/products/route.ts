import { NextRequest, NextResponse } from "next/server";
import {initRepository} from "@/app/models/connect";
import {uploadFileToPinata} from "@/app/services/pinataService";
import {Product} from "@/app/models/entities/Product";
import {ProductImage} from "@/app/models/entities/Image";

export async function GET(req: NextRequest) {
    try {
        const productRepository = await initRepository(Product)

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const [products, total] = await productRepository.findAndCount({
            skip,
            take: limit,
            order: {
                created_at: "DESC",
            },
        });

        return NextResponse.json({
            success: true,
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }, { status: 200 });

    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Đã xảy ra lỗi khi lấy danh sách sản phẩm",
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const productRepository = await initRepository(Product);

        const formData = await req.formData();

        const name = formData.get("name") as string;
        const code = formData.get("code") as string;
        const thumbnailFile = formData.get("thumbnail") as File;
        const regularPrice = formData.get("regular_price") as string;
        const salePrice = formData.get("sale_price") as string;

        if (!name || !code || !thumbnailFile || !regularPrice || !salePrice) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vui lòng cung cấp đầy đủ thông tin: tên, mã, ảnh, giá gốc, giá bán",
                },
                {status: 400}
            );
        }

        const thumbnailUrl = await uploadFileToPinata(thumbnailFile, name);
        if (typeof thumbnailUrl !== "string") {
            return thumbnailUrl;
        }

        const imageFiles = formData.getAll("images[]") as File[];
        const imageUrls: string[] = [];
        for (const imageFile of imageFiles) {
            const imageUrl = await uploadFileToPinata(imageFile, name);
            if (typeof imageUrl === "string") {
                imageUrls.push(imageUrl);
            } else {
                return imageUrl;
            }
        }

        const newProduct = productRepository.create({
            code,
            name,
            thumbnail: thumbnailUrl,
            description: formData.get("description") as string,
            regular_price: parseFloat(regularPrice),
            sale_price: parseFloat(salePrice),
            skin_type: formData.get("skin_type") as string,
            is_infinity_card: formData.get("is_infinity_card") === "true",
            register_by: formData.get("register_by") as string,
            rank: formData.get("rank") as string,
            server: formData.get("server") as string,
            number_diamond_available: parseInt(
                formData.get("number_diamond_available") as string
            ) || 0,
            status: (formData.get("status") as "active" | "inactive") || "active",
            is_for_sale: formData.get("is_for_sale") === "true" || false,
            category_id: parseInt(formData.get("category_id") as string) || 0,
            created_at: new Date(),
            updated_at: new Date(),
        });

        const savedProduct = await productRepository.save(newProduct);

        if (imageUrls.length > 0) {
            const imageRepository = await initRepository(ProductImage);
            const imageEntities = imageUrls.map((url) =>
                imageRepository.create({
                    product_id: savedProduct.id,
                    image_url: url,
                })
            );
            await imageRepository.save(imageEntities);
        }

        return NextResponse.json(
            {
                success: true,
                product: savedProduct,
                images: imageUrls,
                message: "Tạo sản phẩm thành công",
            },
            {status: 201}
        );
    } catch (error) {
        console.error("Lỗi khi tạo sản phẩm:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Đã xảy ra lỗi khi tạo sản phẩm",
            },
            {status: 500}
        );
    }
}