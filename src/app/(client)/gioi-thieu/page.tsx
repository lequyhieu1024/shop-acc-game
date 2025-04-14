import Head from "next/head";

export default function AboutPage() {
    return (
        <>
            <Head>
                <title>Giới thiệu Shop Cuti Gaming - Bán acc Free Fire uy tín</title>
                <meta
                    name="description"
                    content="Shop Cuti Gaming - Địa chỉ bán acc Free Fire uy tín tại shopcutigaming.com. Cung cấp tài khoản Free Fire giá rẻ, an toàn, hỗ trợ 24/7 bởi Lê Quý Hiếu."
                />
                <meta name="keywords" content="bán acc Free Fire, shopcutigaming, acc Free Fire giá rẻ, Lê Quý Hiếu" />
                <link rel="canonical" href="https://shopcutigaming.com/about" />
            </Head>
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
                    Giới thiệu về Shop Cuti Gaming - Shop bán acc Free Fire uy tín
                </h1>

                <p className="text-center text-lg mb-10">
                    Chào mừng bạn đến với <strong>Shop Cuti Gaming</strong> tại{" "}
                    <a href="https://shopcutigaming.com" className="text-blue-600 hover:underline">
                        shopcutigaming.com
                    </a>
                    ! Chúng tôi tự hào là địa chỉ uy tín cung cấp tài khoản Free Fire chất lượng, giá rẻ và hỗ trợ tận tình.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Về chúng tôi</h2>
                        <p className="text-gray-700">
                            Shop Cuti Gaming được thành lập bởi <strong>Lê Quý Hiếu</strong>, với mục tiêu mang đến cho game thủ Free Fire những tài khoản chất lượng cao, từ acc VIP, acc rank cao đến acc giá rẻ. Chúng tôi cam kết:
                        </p>
                        <ul className="list-disc pl-5 mt-2 text-gray-700">
                            <li>Tài khoản 100% an toàn, không hack.</li>
                            <li>Giá cả cạnh tranh, phù hợp mọi đối tượng.</li>
                            <li>Hỗ trợ đổi trả nhanh chóng nếu có lỗi.</li>
                        </ul>
                    </div>

                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Tại sao chọn Shop Cuti Gaming?</h2>
                        <p className="text-gray-700">
                            Với kinh nghiệm nhiều năm trong lĩnh vực cung cấp acc game, Shop Cuti Gaming luôn đặt sự hài lòng của khách hàng lên hàng đầu:
                        </p>
                        <ul className="list-disc pl-5 mt-2 text-gray-700">
                            <li>Giao dịch nhanh chóng qua website <strong>shopcutigaming.com</strong>.</li>
                            <li>Đội ngũ hỗ trợ 24/7 qua fanpage và hotline.</li>
                            <li>Cập nhật acc Free Fire mới mỗi ngày.</li>
                        </ul>
                    </div>
                </div>

                <div className="text-center mt-10">
                    <h3 className="text-xl font-semibold mb-4">
                        Sẵn sàng chinh phục Free Fire cùng Shop Cuti Gaming?
                    </h3>
                    <a
                        href="/danh-muc"
                        className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                    >
                        Xem ngay kho acc Free Fire
                    </a>
                </div>

                <meta
                    name="description"
                    content="Shop Cuti Gaming - Địa chỉ bán acc Free Fire uy tín tại shopcutigaming.com. Cung cấp tài khoản Free Fire giá rẻ, an toàn, hỗ trợ 24/7 bởi Lê Quý Hiếu."
                />
            </div>
        </>
    );
}