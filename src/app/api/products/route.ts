import { NextRequest, NextResponse } from "next/server";
import {initRepository} from "@/app/models/connect";
import {uploadFileToPinata} from "@/app/services/pinataService";
import {Product} from "@/app/models/entities/Product";
import {ProductImage} from "@/app/models/entities/Image";
import {Between, LessThanOrEqual, Like} from "typeorm";

export async function GET(req: NextRequest) {
    try {
        const productRepository = await initRepository(Product);

        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const name = searchParams.get("name") || undefined;
        const categoryId = searchParams.get("category_id") ? parseInt(searchParams.get("category_id") as string) : undefined;
        const status = searchParams.get("status") as "active" | "inactive" | undefined;
        const minPrice = searchParams.get("min_price") ? parseInt(searchParams.get("min_price") as string) : undefined;
        const maxPrice = searchParams.get("max_price") ? parseInt(searchParams.get("max_price") as string) : undefined;
        const isForSale = searchParams.get("is_for_sale") ? parseInt(searchParams.get("is_for_sale") as string) : undefined;
        const code = searchParams.get("code") ? searchParams.get("code") : undefined;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};

        if (name) {
            where.name = Like(`%${name}%`);
        }
        if (categoryId !== undefined) {
            where.category_id = categoryId;
        }
        if (status) {
            where.status = status;
        }
        if (code) {
            where.code = code;
        }

        if (minPrice !== undefined && maxPrice !== undefined) {
            where.sale_price = Between(minPrice, maxPrice);
        } else if (minPrice !== undefined) {
            where.sale_price = LessThanOrEqual(minPrice);
        } else if (maxPrice !== undefined) {
            where.sale_price = LessThanOrEqual(maxPrice);
        }

        if (isForSale !== undefined) {
            where.is_for_sale = isForSale;
        }

        const [products, total] = await productRepository.findAndCount({
            where,
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
        const skinType = formData.get("skin_type") as string;
        const quantity = formData.get("quantity") as string;
        const category_id = formData.get("category_id") as string;
        const register_by = formData.get("register_by") as string;
        if (!name || !code || !thumbnailFile || !regularPrice || !salePrice || !skinType || !quantity || !category_id || !register_by) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vui lòng cung cấp đầy đủ thông tin: tên, mã, ảnh, giá gốc, giá bán, số lượng, ...",
                },
                {status: 400}
            );
        }

        const thumbnailUrl = await uploadFileToPinata(thumbnailFile, name);
        const imageFilesRaw = formData.getAll("images");
        const imageFiles = imageFilesRaw.filter(
            (file) => file instanceof File && file.name && file.size > 0
        );
        const imageUrls: string[] = [];

        for (const imageFile of imageFiles) {
            try {
                const imageUrl = await uploadFileToPinata(imageFile as File, name);
                imageUrls.push(String(imageUrl));
            } catch (error) {
                console.error("Failed to upload image:", (error as Error).message);
            }
        }

        const newProduct = productRepository.create({
            code,
            name,
            thumbnail: thumbnailUrl,
            description: formData.get("description") as string,
            regular_price: parseInt(regularPrice),
            sale_price: parseInt(salePrice),
            skin_type: skinType,
            is_infinity_card: formData.get("is_infinity_card") === "true",
            register_by: register_by,
            rank: formData.get("rank") as string,
            server: formData.get("server") as string,
            number_diamond_available: parseInt(
                formData.get("number_diamond_available") as string
            ) || 0,
            status: (formData.get("status") as "active" | "inactive") || "active",
            is_for_sale: formData.get("is_for_sale") === "true" || false,
            category_id: parseInt(category_id) || 0,
            quantity: Number(quantity),
            account_id: formData.get("account_id") || null,
            account_name: formData.get("account_name") || null
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
            {status: 200}
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