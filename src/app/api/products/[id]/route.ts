import {NextRequest, NextResponse} from "next/server";
import {initRepository} from "@/app/models/connect";
import {Product} from "@/app/models/entities/Product";
import {ProductImage} from "@/app/models/entities/Image";
import {deleteImage} from "@/app/services/pinataService";
import {In} from "typeorm";
import {saveFileToUploads} from "@/app/services/uploadHosting";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const productId = (await params).id
    try {
        const productRepo = await initRepository(Product);
        const imageRepo = await initRepository(ProductImage);
        const product = await productRepo.findOneBy({id: Number(productId)})

        const images = await imageRepo.findBy({product_id: Number(productId)})

        return NextResponse.json({product, images}, {status: 200})
    } catch (e) {
        return NextResponse.json({
            message: (e as Error).message
        })
    }
}

export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const productId = (await params).id;
    try {
        const productRepo = await initRepository(Product);
        const imageRepo = await initRepository(ProductImage);

        const product = await productRepo.findOneBy({ id: Number(productId) });
        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Sản phẩm không tồn tại",
                },
                { status: 404 }
            );
        }

        const formData = await req.formData();

        // Lấy các trường dữ liệu từ formData
        const name = formData.get("name") as string;
        const code = formData.get("code") as string;
        const thumbnailFile = formData.get("thumbnail") as File;
        const regularPrice = formData.get("regular_price") as string;
        const salePrice = formData.get("sale_price") as string;
        const skinType = formData.get("skin_type") as string;
        const quantity = formData.get("quantity") as string;
        const category_id = formData.get("category_id") as string;
        const register_by = formData.get("register_by") as string;

        if (
            !name ||
            !code ||
            !regularPrice ||
            !salePrice ||
            !skinType ||
            !quantity ||
            !category_id ||
            !register_by
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Vui lòng cung cấp đầy đủ thông tin: tên, mã, giá gốc, giá bán, số lượng, ...",
                },
                { status: 400 }
            );
        }

        let thumbnailUrl = product.thumbnail;
        if (thumbnailFile && thumbnailFile.size > 0) {
            thumbnailUrl = await saveFileToUploads(thumbnailFile);
            await deleteImage(product.thumbnail);
        }

        const deletedImageIdsRaw = formData.get("deletedImageIds") as string;
        const deletedImageIds: number[] = deletedImageIdsRaw
            ? JSON.parse(deletedImageIdsRaw)
            : [];

        if (deletedImageIds.length > 0) {
            const imagesToDelete = await imageRepo.find({
                where: {
                    id: In(deletedImageIds)
                }
            });

            if (imagesToDelete.length > 0) {
                try {
                    await deleteImage(imagesToDelete);
                } catch (error) {
                    console.error("Failed to delete images from Pinata:", error);
                }
            }

            await imageRepo.delete({
                id: In(deletedImageIds),
            });
        }

        const imageFilesRaw = formData.getAll("images");
        const imageFiles = imageFilesRaw.filter(
            (file) => file instanceof File && file.name && file.size > 0
        );
        const newImageUrls: string[] = [];

        if (imageFiles.length > 0) {
            for (const imageFile of imageFiles) {
                try {
                    const imageUrl = await saveFileToUploads(imageFile as File);
                    newImageUrls.push(String(imageUrl));
                } catch (error) {
                    console.error("Failed to upload image:", (error as Error).message);
                }
            }

            if (newImageUrls.length > 0) {
                const imageEntities = newImageUrls.map((url) =>
                    imageRepo.create({
                        product_id: Number(productId),
                        image_url: url,
                    })
                );
                await imageRepo.save(imageEntities);
            }
        }

        const updatedProductData = {
            ...product,
            code: code || product.code,
            name: name || product.name,
            thumbnail: thumbnailUrl,
            description: (formData.get("description") as string) || product.description,
            regular_price: parseInt(regularPrice) || product.regular_price,
            sale_price: parseInt(salePrice) || product.sale_price,
            skin_type: skinType || product.skin_type,
            is_infinity_card: formData.get("is_infinity_card") === "true",
            register_by: register_by || product.register_by,
            rank: (formData.get("rank") as string) || product.rank,
            server: (formData.get("server") as string) || product.server,
            number_diamond_available:
                parseInt(formData.get("number_diamond_available") as string) ||
                product.number_diamond_available,
            status:
                (formData.get("status") as "active" | "inactive") || product.status,
            is_for_sale: formData.get("is_for_sale") === "true",
            category_id: parseInt(category_id) || product.category_id,
            quantity: Number(quantity) || product.quantity,
            account_id: (formData.get("account_id") as string) || product.account_id,
            account_name: (formData.get("account_name") as string) || product.account_name,
        };

        const savedProduct = await productRepo.save(updatedProductData);

        const updatedImages = await imageRepo.find({
            where: { product_id: Number(productId) },
        });

        return NextResponse.json(
            {
                success: true,
                product: savedProduct,
                images: updatedImages.map((img) => ({
                    id: img.id,
                    image_url: img.image_url,
                })),
                message: "Cập nhật sản phẩm thành công",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Đã xảy ra lỗi khi cập nhật sản phẩm",
            },
            { status: 500 }
        );
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const productId = (await params).id
    try {
        const productRepo = await initRepository(Product);
        const imageRepo = await initRepository(ProductImage)

        const product = await productRepo.findOneBy({ id: Number(productId) });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        await deleteImage(product.thumbnail)
        await productRepo.softDelete({ id: Number(productId) });

        const imagesToDelete = await imageRepo.findBy({ product_id: Number(productId)})
        if (imagesToDelete.length > 0) {
            await deleteImage(imagesToDelete);
        }
        await imageRepo.delete({ product_id: Number(productId) });

        return NextResponse.json(
            { message: "Product and related images deleted successfully" },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            { message: (e as Error).message },
            { status: 500 }
        );
    }
};