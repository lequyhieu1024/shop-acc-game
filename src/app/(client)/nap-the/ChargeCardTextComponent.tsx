export default function ChargeCardTextComponent() {
    return (
        <div className="mb-6">
            <h1 className="text-center text-2xl font-bold mb-2">Đổi thẻ cào</h1>
            <p className="text-gray-700">
                <strong className="text-red-600">
                    - Không nhận API từ game bài, thẻ ăn cắp, lừa đảo, không rõ nguồn gốc, thẻ rút từ visa, credit
                    card... Phát hiện khóa vv không hoàn số dư
                </strong>
            </p>
            <p className="text-black">
                - Vui lòng đọc{' '}
                <a href="https://thesieure.com/news/http-api-tichhop247-com.html" className="text-blue-600 font-bold">
                    Điều Khoản
                </a>
                , Đổi thẻ sang thẻ game rẻ hơn tại{' '}
                <a href="https://365pay.vn/" className="text-red-600 font-bold">
                    365pay.vn
                </a>
            </p>
            <p>
                - <strong className="text-red-600">Tạo web con đổi thẻ, bán thẻ miễn phí </strong>
                <a href="https://thesieure.com/news/cap-web-con-doi-the-tich-hop-doi-the-rut-tien-tu-dong-auto-100.html"
                   className="font-bold">
                    tại đây
                </a>
                . Hướng dẫn tích hợp API gạch thẻ tự động cho Shop:{' '}
                <a href="https://thesieure.com/merchant/list" className="font-bold">tại đây</a>
            </p>
            <p>
                <a href="https://thesieure.com/doithecao" className="font-bold">Lịch sử nạp thẻ tại đây</a>,{' '}
                Thống kê{' '}
                <a href="https://thesieure.com/doithecao/san-luong" className="font-bold">tại đây</a>,{' '}
                Nhận thông báo Telegram{' '}
                <a href="https://t.me/thongbao_thesieure" className="font-bold">tại đây</a>
            </p>
        </div>
    )
}