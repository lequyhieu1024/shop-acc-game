import { NextRequest, NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { Voucher } from "@/app/models/entities/Voucher";
import { Like } from "typeorm";

interface IFilter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  where?: any;
}

export const GET = async (req: NextRequest) => {
  try {
    const voucherRepo = await initRepository(Voucher);
    const searchParams = req.nextUrl.searchParams;
    const size = parseInt(searchParams.get("size") || "10");
    const data = searchParams.get("data") || null;
    const filter: IFilter = {};
    if (data !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const conditions: any[] = [];

      if (data.trim() !== "") {
        conditions.push({ name: Like(`%${data}%`) });
        conditions.push({ type: data });
        conditions.push({ status: data });
      }

      const numValue = parseInt(data);
      if (!isNaN(numValue)) {
        conditions.push({ value: numValue });
      }

      if (conditions.length > 0) {
        filter.where = conditions;
      }
    }

    const vouchers = await voucherRepo.find({
      where: filter.where,
      take: size
    });
    return NextResponse.json({ vouchers });
  } catch (e) {
    console.log((e as Error).message);
    return NextResponse.json({
      result: false,
      message: (e as Error).message
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const voucherRepo = await initRepository(Voucher);
    const data = await req.json();
    const newVoucher = voucherRepo.create(data);
    await voucherRepo.save(newVoucher);
    return NextResponse.json({ newVoucher }, { status: 200 });
  } catch (e) {
    console.log((e as Error).message);
    return NextResponse.json({
      result: false,
      message: (e as Error).message
    });
  }
};
