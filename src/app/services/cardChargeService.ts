import axios from "axios";

class CardService {
    private partnerId: string;
    private partnerKey: string;
    private apiUrl: string;

    constructor() {
        this.partnerId = process.env.PARTNER_ID_SUPPER_CHEAP_CARD || "";
        this.partnerKey = process.env.PARTNER_KEY_SUPPER_CHEAP_CARD || "";
        this.apiUrl = process.env.URL_API_SUPPER_CHEAP_CARD || "";
        if (!this.partnerId || !this.partnerKey || !this.apiUrl) {
            throw new Error("Missing required environment variables for Supper Cheap Card API.");
        }
    }

    /**
     * Gửi yêu cầu nạp thẻ
     * @param telco Nhà mạng (VIETTEL, MOBIFONE, VINAPHONE, etc.)
     * @param code Mã thẻ
     * @param serial Số serial
     * @param amount Mệnh giá
     * truyền data dạng json
     */
    async chargeCard(data: Record<string, any>) {
        try {
            const formData = new FormData();

            for (const key in data) {
                formData.append(key, data[key]);
            }

            formData.append("request_id", Date.now().toString());
            formData.append("partner_id", this.partnerId);
            formData.append("partner_key", this.partnerKey);
            formData.append("sign", this.generateMD5(this.partnerKey, formData.get("code"), formData.get("serial")));
            formData.append("command", "charging");

            console.log("Dữ liệu gửi đi:", formData);

            const response = await axios.post(this.apiUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error: any) {
            console.error("Lỗi nạp thẻ:", error.response?.data || error.message);
            throw new Error("Failed to process card.");
        }
    }
    generateMD5 = (partnerKey: string, code: string, serial: string): string => {
        const data = `${partnerKey}${code}${serial}`;
        return crypto.createHash('md5').update(data).digest('hex');
    };
}

export const cardService = new CardService();
