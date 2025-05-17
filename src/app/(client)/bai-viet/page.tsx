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
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-20 font-sans">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                        Bài Viết & Tin Tức
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Cập nhật tin tức mới nhất về game và shop acc
                    </p>
                </div>

                {/* Bố cục 2 cột */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Cột chính (bên trái) */}
                    <div className="md:w-2/3 w-full">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/20 shadow-xl">
                            <h2 className="text-2xl font-bold text-white border-b border-purple-500/20 pb-4 mb-6">
                                Danh Sách Bài Viết
                            </h2>
                            <div className="space-y-6">
                                {posts.map((post) => (
                                    <article
                                        key={post.id}
                                        className="flex flex-col md:flex-row items-start bg-gray-800/50 p-6 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
                                    >
                                        {post.thumbnail && (
                                            <div className="md:w-1/3 w-full mb-4 md:mb-0 md:mr-6">
                                                <Link href={`/bai-viet/${post.slug}`}>
                                                    <div className="relative aspect-video overflow-hidden rounded-lg group">
                                                        <Image
                                                            width={400}
                                                            height={225}
                                                            src={post.thumbnail}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                        <div className="md:w-2/3 w-full">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 text-sm font-medium bg-purple-500/20 text-purple-400 rounded-full">
                                                    {post.category}
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-semibold text-white hover:text-purple-400 transition-colors mb-2">
                                                <Link href={`/bai-viet/${post.slug}`}>{post.title}</Link>
                                            </h2>
                                            <p className="text-gray-400 text-sm md:text-base line-clamp-2 mb-4">
                                                {post.excerpt}
                                            </p>
                                            <Link
                                                href={`/bai-viet/${post.slug}`}
                                                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                                            >
                                                Đọc thêm
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 ml-1"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cột phụ (bên phải) */}
                    <div className="md:w-1/3 w-full">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/20 shadow-xl">
                            <h2 className="text-2xl font-bold text-white border-b border-purple-500/20 pb-4 mb-6">
                                Bài Viết Nổi Bật
                            </h2>
                            <div className="space-y-6">
                                {featuredPosts.map((post) => (
                                    <article
                                        key={post.id}
                                        className="flex items-start space-x-4 group"
                                    >
                                        {post.thumbnail && (
                                            <div className="w-1/3">
                                                <Link href={`/bai-viet/${post.slug}`}>
                                                    <div className="relative aspect-video overflow-hidden rounded-lg">
                                                        <Image
                                                            width={200}
                                                            height={112}
                                                            src={post.thumbnail}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                        <div className="w-2/3">
                                            <h3 className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                                                <Link href={`/bai-viet/${post.slug}`}>{post.title}</Link>
                                            </h3>
                                            <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}