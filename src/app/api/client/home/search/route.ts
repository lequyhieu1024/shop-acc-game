import { NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { Product } from "@/app/models/entities/Product";
import { Like } from "typeorm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ products: [] });
    }

    const productRepo = await initRepository(Product);
    const products = await productRepo.find({
      where: [
        { name: Like(`%${query}%`), status: 'active' },
        { description: Like(`%${query}%`), status: 'active' }
      ],
      relations: ['category'],
      select: {
        id: true,
        name: true,
        sale_price: true,
        thumbnail: true,
        category: {
          name: true,
        }
      },
      take: 100
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 