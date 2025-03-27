import Link from 'next/link';
import { Metadata } from 'next';
import Image from "next/image";

// Định nghĩa kiểu dữ liệu cho bài viết
interface Post {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    thumbnail?: string;
    category?: string;
}

// Dữ liệu mẫu cho bài viết (15 bài viết)
const posts: Post[] = [
    {
        id: 1,
        slug: 'mua-acc-freefire-gia-re-tai-shop-cu-ti',
        title: 'Mua Acc FreeFire Giá Rẻ Tại Shop Cu Tí - Uy Tín Hàng Đầu',
        excerpt:
            'Tìm kiếm acc FreeFire giá rẻ? Shop Cu Tí cung cấp tài khoản chất lượng, giao dịch an toàn, giá cả hợp lý.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-1.webp',
        category: 'Shop Acc',
    },
    {
        id: 2,
        slug: 'shop-acc-game-uy-tin-shopcutigaming',
        title: 'Shop Acc Game Uy Tín - Shopcutigaming Có Gì Hấp Dẫn?',
        excerpt:
            'Shopcutigaming - Địa chỉ mua acc game đáng tin cậy, đặc biệt là acc FreeFire với giá siêu tốt.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-2.jpg',
        category: 'Shop Acc',
    },
    {
        id: 3,
        slug: 'shop-freefire-acc-dep-gia-re',
        title: 'Shop FreeFire - Chuyên Bán Acc Đẹp Giá Rẻ Nhất 2025',
        excerpt:
            'Bạn cần acc FreeFire đẹp, rank cao? Shop FreeFire của chúng tôi có tất cả với giá cực kỳ hấp dẫn.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-3.jpg',
        category: 'Shop Acc',
    },
    {
        id: 4,
        slug: 'huong-dan-mua-acc-freefire-tai-shop-cu-ti',
        title: 'Hướng Dẫn Mua Acc FreeFire Tại Shop Cu Tí Đơn Giản Nhất',
        excerpt:
            'Tìm hiểu cách mua acc FreeFire nhanh chóng, an toàn tại Shop Cu Tí Gaming chỉ với vài bước.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-4.jpg',
        category: 'Hướng Dẫn',
    },
    {
        id: 5,
        slug: 'top-5-acc-freefire-re-nhat-tai-shop-cu-ti',
        title: 'Top 5 Acc FreeFire Rẻ Nhất Tại Shop Cu Tí Gaming 2025',
        excerpt:
            'Khám phá danh sách 5 acc FreeFire giá rẻ nhất tại Shop Cu Tí, phù hợp với mọi game thủ.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-5.jpg',
        category: 'Top List',
    },
    {
        id: 6,
        slug: 'tai-sao-nen-mua-acc-tai-shopcutigaming',
        title: 'Tại Sao Nên Mua Acc FreeFire Tại Shopcutigaming?',
        excerpt:
            'Shopcutigaming mang đến trải nghiệm mua acc FreeFire an toàn, nhanh chóng và đáng tin cậy.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-6.jpg',
        category: 'Shop Acc',
    },
    {
        id: 7,
        slug: 'shop-acc-freefire-rank-cao-gia-re',
        title: 'Shop Acc FreeFire Rank Cao Giá Rẻ - Shop Cu Tí Gaming',
        excerpt:
            'Mua acc FreeFire rank cao với giá rẻ tại Shop Cu Tí, đảm bảo uy tín và giao dịch nhanh.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-7.jpg',
        category: 'Shop Acc',
    },
    {
        id: 8,
        slug: 'kinh-nghiem-mua-acc-freefire-an-toan',
        title: 'Kinh Nghiệm Mua Acc FreeFire An Toàn Tại Shop Acc Game',
        excerpt:
            'Chia sẻ kinh nghiệm mua acc FreeFire an toàn, tránh lừa đảo khi giao dịch tại các shop acc game.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-8.jpg',
        category: 'Kinh Nghiệm',
    },
    {
        id: 9,
        slug: 'shop-cu-ti-ban-acc-freefire-vip',
        title: 'Shop Cu Tí - Chuyên Bán Acc FreeFire VIP Đẹp Nhất',
        excerpt:
            'Sở hữu acc FreeFire VIP với skin xịn, rank cao tại Shop Cu Tí Gaming với giá cực tốt.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-9.jpg',
        category: 'Shop Acc',
    },
    {
        id: 10,
        slug: 'mua-acc-freefire-co-skin-hiem-tai-shopcutigaming',
        title: 'Mua Acc FreeFire Có Skin Hiếm Tại Shopcutigaming',
        excerpt:
            'Shopcutigaming cung cấp acc FreeFire với skin hiếm, giá rẻ, giao dịch an toàn 100%.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-10.jpg',
        category: 'Shop Acc',
    },
    {
        id: 11,
        slug: 'shop-freefire-acc-gia-re-nhat-thi-truong',
        title: 'Shop FreeFire - Acc Giá Rẻ Nhất Thị Trường 2025',
        excerpt:
            'Tìm acc FreeFire giá rẻ nhất thị trường? Shop FreeFire của chúng tôi là lựa chọn số 1!',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-11.webp',
        category: 'Shop Acc',
    },
    {
        id: 12,
        slug: 'danh-gia-shop-acc-game-cu-ti-gaming',
        title: 'Đánh Giá Shop Acc Game Cu Tí Gaming - Có Uy Tín Không?',
        excerpt:
            'Shop Cu Tí Gaming có thực sự uy tín? Đánh giá chi tiết về dịch vụ mua acc FreeFire tại đây.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-12.webp',
        category: 'Đánh Giá',
    },
    {
        id: 13,
        slug: 'cach-chon-acc-freefire-phu-hop-tai-shop-cu-ti',
        title: 'Cách Chọn Acc FreeFire Phù Hợp Tại Shop Cu Tí Gaming',
        excerpt:
            'Hướng dẫn chọn acc FreeFire phù hợp với nhu cầu của bạn tại Shop Cu Tí Gaming.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-13.jpeg',
        category: 'Hướng Dẫn',
    },
    {
        id: 14,
        slug: 'shopcutigaming-khuyen-mai-acc-freefire',
        title: 'Shopcutigaming Khuyến Mãi Acc FreeFire - Giảm Giá Sốc',
        excerpt:
            'Nhanh tay nhận ưu đãi giảm giá acc FreeFire tại Shopcutigaming, số lượng có hạn!',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-14.jpg',
        category: 'Khuyến Mãi',
    },
    {
        id: 15,
        slug: 'shop-acc-game-freefire-tot-nhat-2025',
        title: 'Shop Acc Game FreeFire Tốt Nhất 2025 - Shop Cu Tí',
        excerpt:
            'Shop Cu Tí Gaming - Địa chỉ mua acc FreeFire tốt nhất 2025, uy tín và giá rẻ.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-15.jpg',
        category: 'Shop Acc',
    },
];

// Bài viết nổi bật (cột bên phải) - Chọn 5 bài từ danh sách trên
const featuredPosts: Post[] = [
    {
        id: 1,
        slug: 'mua-acc-freefire-gia-re-tai-shop-cu-ti',
        title: 'Mua Acc FreeFire Giá Rẻ Tại Shop Cu Tí - Uy Tín Hàng Đầu',
        excerpt:
            'Tìm kiếm acc FreeFire giá rẻ? Shop Cu Tí cung cấp tài khoản chất lượng, giao dịch an toàn.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-1.webp',
    },
    {
        id: 2,
        slug: 'shop-acc-game-uy-tin-shopcutigaming',
        title: 'Shop Acc Game Uy Tín - Shopcutigaming Có Gì Hấp Dẫn?',
        excerpt:
            'Shopcutigaming - Địa chỉ mua acc game đáng tin cậy, đặc biệt là acc FreeFire.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-2.jpg',
    },
    {
        id: 5,
        slug: 'top-5-acc-freefire-re-nhat-tai-shop-cu-ti',
        title: 'Top 5 Acc FreeFire Rẻ Nhất Tại Shop Cu Tí Gaming 2025',
        excerpt:
            'Khám phá danh sách 5 acc FreeFire giá rẻ nhất tại Shop Cu Tí.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-5.jpg',
    },
    {
        id: 6,
        slug: 'tai-sao-nen-mua-acc-tai-shopcutigaming',
        title: 'Tại Sao Nên Mua Acc FreeFire Tại Shopcutigaming?',
        excerpt:
            'Shopcutigaming mang đến trải nghiệm mua acc FreeFire an toàn, nhanh chóng.',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-6.jpg',
    },
    {
        id: 14,
        slug: 'shopcutigaming-khuyen-mai-acc-freefire',
        title: 'Shopcutigaming Khuyến Mãi Acc FreeFire - Giảm Giá Sốc',
        excerpt:
            'Nhanh tay nhận ưu đãi giảm giá acc FreeFire tại Shopcutigaming!',
        thumbnail: '/client/assets/images/bai-viet/bai-viet-14.jpg',
    },
];

export const metadata: Metadata = {
    title: 'Shop Acc Game Free Fire - Shop Cu Tí',
    description:
        'Khám phá shop acc Free Fire uy tín tại Shop Cu Tí. Mua acc Free Fire giá rẻ, chất lượng cao ngay hôm nay!',
    keywords:
        'shop acc, mua acc freefire, shop cu tí, shopcutigaming, shop acc game, shop freefire, freefire acc',
};

export default function BaiVietPage() {
    return (
        <main className="bg-gray-100 min-h-screen py-20 font-sans">
            <div className="max-w-6xl mx-auto px-4">
                {/* Bố cục 2 cột */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Cột chính (bên trái) */}
                    <div className="md:w-2/3 w-full">
                        <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-red-600 pb-2 mb-6">
                            Danh Sách Bài Viết - Shop Acc Free Fire
                        </h1>
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="flex flex-col md:flex-row items-start bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {post.thumbnail && (
                                        <div className="md:w-1/3 w-full mb-4 md:mb-0 md:mr-4">
                                            <Link href={`/bai-viet/${post.slug}`}>
                                                <Image width={200}
                                                       height={200}
                                                    src={post.thumbnail}
                                                    alt={post.title}
                                                    className="w-full h-40 object-cover rounded-md"
                                                />
                                            </Link>
                                        </div>
                                    )}
                                    <div className="md:w-2/3 w-full">
                                        <span className="text-sm text-red-600 font-semibold">
                                          {post.category}
                                        </span>
                                        <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mt-1">
                                            <Link href={`/bai-viet/${post.slug}`}>{post.title}</Link>
                                        </h2>
                                        <p className="text-gray-600 mt-2 text-sm md:text-base line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="md:w-1/3 w-full">
                        <h2 className="text-xl font-bold text-gray-800 border-b-2 border-red-600 pb-2 mb-4">
                            Bài Viết Nổi Bật
                        </h2>
                        <div className="space-y-4">
                            {featuredPosts.map((post) => (
                                <article key={post.id} className="flex items-start">
                                    {post.thumbnail && (
                                        <div className="w-1/3 mr-3">
                                            <Link href={`/bai-viet/${post.slug}`}>
                                                <Image width={200}
                                                     height={200}
                                                    src={post.thumbnail}
                                                    alt={post.title}
                                                    className="w-full h-20 object-cover rounded-md"
                                                />
                                            </Link>
                                        </div>
                                    )}
                                    <div className="w-2/3">
                                        <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                            <Link href={`/bai-viet/${post.slug}`}>{post.title}</Link>
                                        </h3>
                                        <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}