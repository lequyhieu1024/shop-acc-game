import { NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { Product } from "@/app/models/entities/Product";
import { Category } from "@/app/models/entities/Category";
import { LessThanOrEqual } from "typeorm";

export const GET = async () => {
    try {
        const productRepo = await initRepository(Product);
        const categoryRepo = await initRepository(Category);

        const categories = await categoryRepo.find();

        const [featuredProducts] = await productRepo.findAndCount({
            where: {
                is_for_sale: true,
                status: "active"
            },
            order: {
                created_at: "DESC"
            },
            take: 10
        });

        // Get products by category
        const productsByCategory = await Promise.all(
            categories.map(async (category) => {
                const [products] = await productRepo.findAndCount({
                    where: {
                        category_id: category.id,
                        is_for_sale: true,
                        status: "active"
                    },
                    order: {
                        created_at: "DESC"
                    },
                    take: 5
                });

                return {
                    category,
                    products
                };
            })
        );
        const [saleProducts] = await productRepo.findAndCount({
            where: {
                is_for_sale: true,
                status: "active",
                regular_price: LessThanOrEqual(1000000)
            },
            order: {
                created_at: "DESC"
            },
            take: 10
        });

        const productsWithDiscount = [...featuredProducts, ...saleProducts].map(product => ({
            ...product,
            discount_percentage: product.regular_price && product.sale_price
                ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100)
                : 0
        }));

        productsWithDiscount.sort((a, b) => b.discount_percentage - a.discount_percentage);

        return NextResponse.json({
            featured_products: featuredProducts,
            products_by_category: productsByCategory,
            sale_products: productsWithDiscount.slice(0, 10),
            categories
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json(
            {
                success: false,
                message: (e as Error).message || "Lỗi server nội bộ",
            },
            { status: 500 }
        );
    }
}; 