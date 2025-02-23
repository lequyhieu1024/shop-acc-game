import "server-only"
import { PinataSDK } from "pinata-web3"
import {NextResponse} from "next/server";
import {randomString, toSlug} from "@/app/services/commonService";

export const pinata = new PinataSDK({
    pinataJwt: `${process.env.PINATA_JWT}`,
    pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
})

export const uploadFileToPinata = async (file: File, name:string = "" ): Promise<string | NextResponse> => {
    try {
        let newFile = file;

        if (name !== "") {
            const extName = file.name.split(".").pop();
            const newName = `${toSlug(name)}-${randomString()}.${extName}`;

            newFile = new File([await file.arrayBuffer()], newName, {
                type: file.type,
            });
        }
        const uploadData = await pinata.upload.file(newFile)
        return await pinata.gateways.convert(uploadData.IpfsHash)
    } catch (e) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}