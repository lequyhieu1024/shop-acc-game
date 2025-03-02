import { NextRequest, NextResponse } from "next/server";
import { initRepository } from "@/app/models/connect";
import { System } from "@/app/models/entities/System";
import { uploadFileToPinata } from "@/app/services/pinataService";

export const GET = async () => {
  try {
    const systemRepo = await initRepository(System);
    const system = await systemRepo.findOneBy({ id: 1 });
    return NextResponse.json({ system }, { status: 200 });
  } catch (e) {
    console.log((e as Error).message);
    return NextResponse.json({
      result: false,
      message: (e as Error).message
    });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const systemRepo = await initRepository(System);
    const system = await systemRepo.findOneBy({ id: 1 });
    const formData = await req.formData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newData: any = Object.fromEntries(formData.entries());
    if (newData.logo !== "") {
      newData.logo = await uploadFileToPinata(newData.logo);
    } else {
      newData.logo = system?.logo;
    }
    await systemRepo.update(1, newData);
    return NextResponse.json({ system: newData }, { status: 200 });
  } catch (e) {
    console.log((e as Error).message);
    return NextResponse.json({
      result: false,
      message: (e as Error).message
    });
  }
};
