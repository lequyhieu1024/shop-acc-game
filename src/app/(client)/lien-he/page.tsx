import Head from "next/head";
import Link from "next/link";

export default function ContactPage() {
    return (
        <>
            <Head>
                <title>Liên hệ ShopCutiGaming - Hỗ trợ mua acc Free Fire 24/7</title>
                <meta
                    name="description"
                    content="Liên hệ Shop Cuti Gaming qua hotline, email hoặc fanpage để được hỗ trợ mua acc Free Fire nhanh chóng, uy tín tại shopcutigaming.com."
                />
                <meta name="keywords" content="liên hệ Shop Cuti Gaming, hỗ trợ acc Free Fire, shopcutigaming" />
                <link rel="canonical" href="https://shopcutigaming.com/contact" />
            </Head>

            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
                    Liên hệ Shop Cuti Gaming - Hỗ trợ 24/7
                </h1>

                <p className="text-center text-lg mb-10">
                    Bạn cần hỗ trợ mua <strong>acc Free Fire</strong> hoặc có thắc mắc? Liên hệ ngay với chúng tôi qua các kênh dưới đây tại{" "}
                    <a href="https://shopcutigaming.com" className="text-blue-600 hover:underline">
                        shopcutigaming.com
                    </a>!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Thông tin liên hệ</h2>
                        <ul className="text-gray-700 space-y-4">
                            <li>
                                <strong>Hotline:</strong>{" "}
                                <a href="tel:0123456789" className="text-blue-600 hover:underline">
                                    0123 456 789
                                </a>{" "}
                                (Hỗ trợ 24/7)
                            </li>
                            <li>
                                <strong>Email:</strong>{" "}
                                <a href="mailto:support@shopcutigaming.com" className="text-blue-600 hover:underline">
                                    support@shopcutigaming.com
                                </a>
                            </li>
                            <li>
                                <strong>Fanpage:</strong>{" "}
                                <a
                                    href="https://facebook.com/shopcutigaming"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Facebook Shop Cuti Gaming
                                </a>
                            </li>
                            <li>
                                <strong>Địa chỉ:</strong> Được quản lý bởi Lê Quý Hiếu - TP. Hồ Chí Minh, Việt Nam
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Gửi tin nhắn cho chúng tôi</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="Nhập email của bạn"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
                                    Tin nhắn
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    rows={4}
                                    placeholder="Nội dung tin nhắn"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Gửi tin nhắn
                            </button>
                        </form>
                    </div>
                </div>

                {/* Call-to-action */}
                <div className="text-center mt-10">
                    <h3 className="text-xl font-semibold mb-4">
                        Mua acc Free Fire ngay hôm nay!
                    </h3>
                    <Link
                        href="/danh-muc"
                        className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                    >
                        Xem kho acc Free Fire
                    </Link>
                </div>
            </div>
        </>
    );
}