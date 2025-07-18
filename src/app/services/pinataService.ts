import "server-only"
import {PinataSDK} from "pinata-web3"
import {NextResponse} from "next/server";
import {randomString, toSlug} from "@/app/services/commonService";

export const pinata = new PinataSDK({
    pinataJwt: `${process.env.PINATA_JWT}`,
    pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
})

export const uploadFileToPinata = async (file: File, name: string = ""): Promise<string | NextResponse> => {
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
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        return NextResponse.json(
            {error: "Internal Server Error", details: (error as Error).message},
            {status: 500}
        );
    }
}

const extractCID = (url: string): string => {
    const match = url.match(/\/ipfs\/([^/?#]+)/);
    return match ? match[1] : '';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteOnPinata = async (data: any): Promise<NextResponse> => {
    try {
        const cids: string[] = [];

        if (Array.isArray(data) && data.length > 1) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.forEach((arr: any) => {
                const cid = extractCID(arr.image_url);
                if (cid) {
                    cids.push(cid);
                }
            });
        } else {
            cids.push(extractCID(data))
        }

        if (cids.length === 0) {
            return NextResponse.json({message: 'No files to delete'});
        }

        const result = await pinata.unpin(cids);
        return NextResponse.json({message: 'Unpinned successfully', result});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Unpin error:', error);
        return NextResponse.json({message: 'Failed to unpin', error: error.message}, {status: 500});
    }
};