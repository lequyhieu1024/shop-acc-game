import axios from "axios";
import { getRandomInt, hashMD5 } from "@/app/services/commonService";

class CardService {
  private partnerId: string;
  private partnerKey: string;
  private apiUrl: string;

  constructor() {
    this.partnerId = process.env.PARTNER_ID_SUPPER_CHEAP_CARD || "";
    this.partnerKey = process.env.PARTNER_KEY_SUPPER_CHEAP_CARD || "";
    this.apiUrl = process.env.URL_API_SUPPER_CHEAP_CARD || "";
    // console.log(this.apiUrl);
    // console.log(this.partnerId);
    // console.log(this.partnerKey);
    if (!this.partnerId || !this.partnerKey || !this.apiUrl) {
      throw new Error(
        "Missing required environment variables for Supper Cheap Card API."
      );
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async chargeCard(data: Record<string, any>) {
    try {
      const formData = new FormData();

      for (const key in data) {
        formData.append(key, data[key]);
      }

      formData.append("request_id", Date.now().toString() + getRandomInt());
      formData.append("partner_id", this.partnerId);
      formData.append(
        "sign",
        hashMD5(this.partnerKey + formData.get("code") + formData.get("serial"))
      );
      formData.append("command", "charging");

      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Lỗi nạp thẻ:", error.response?.data || error.message);
      throw new Error("Failed to process card.");
    }
  }
}

export const cardService = new CardService();
