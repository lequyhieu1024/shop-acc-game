import React, { useEffect, useState } from 'react';
import api from "@/app/services/axiosService";

// Định nghĩa interface cho SocialLink
export interface SocialLink {
    name: string;
    url: string;
    icon: React.ReactNode;
    bgColor: string;
    hoverColor: string;
    phone?: string;
}

interface FloatingSocialIconsProps {
    position?: 'left' | 'right';
    offset?: number;
    size?: number;
    gap?: number;
}

const FloatingSocialIcons: React.FC<FloatingSocialIconsProps> = ({
    position = 'right',
    offset = 20,
}) => {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // SVG icons cho các mạng xã hội
    const TikTokIcon = () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 1.88.68V9.21a6.66 6.66 0 0 0-1.88-.27 6.33 6.33 0 0 0-6.34 6.82 6.33 6.33 0 0 0 10.67 4.58 6.33 6.33 0 0 0 1.67-4.58V8.67a8.23 8.23 0 0 0 4.11 1.13V6.69z" />
        </svg>
    );

    const FacebookIcon = () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12a10 10 0 1 0-11.56 9.88V15h-2.27v-3h2.27V9.5a3.13 3.13 0 0 1 3.34-3.5 13.38 13.38 0 0 1 2 .17v2.32h-1.38a1.27 1.27 0 0 0-1.43 1.38V12h2.5l-.4 3H14v6.88A10 10 0 0 0 22 12z" />
        </svg>
    );

    const YouTubeIcon = () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.5 6.19a3 3 0 0 0-2.11-2.13C19.47 3.5 12 3.5 12 3.5s-7.47 0-9.39.56A3 3 0 0 0 .5 6.19 31.22 31.22 0 0 0 0 12a31.22 31.22 0 0 0 .5 5.81 3 3 0 0 0 2.11 2.13C4.53 20.5 12 20.5 12 20.5s7.47 0 9.39-.56a3 3 0 0 0 2.11-2.13A31.22 31.22 0 0 0 24 12a31.22 31.22 0 0 0-.5-5.81zM9.75 15.5V8.5l6.5 3.5-6.5 3.5z" />
        </svg>
    );

    const ZaloIcon = () => (
        <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="#0068FF" />
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="white"
                fontSize="16"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
            >
                Zalo
            </text>
        </svg>
    );

    const PhoneIcon = () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
        </svg>
    );

    useEffect(() => {
        const fetchSystemData = async () => {
            try {
                const response = await api.get('/clients/systems');
                const data = response.data.system;

                const links: SocialLink[] = [];

                if (data?.tiktok) {
                    links.push({
                        name: 'TikTok',
                        url: data.tiktok,
                        icon: <TikTokIcon/>,
                        bgColor: 'bg-gradient-to-br from-black to-gray-800',
                        hoverColor: 'hover:from-pink-500 hover:to-purple-500',
                    });
                }

                if (data?.facebook) {
                    links.push({
                        name: 'Facebook',
                        url: data.facebook,
                        icon: <FacebookIcon/>,
                        bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
                        hoverColor: 'hover:from-blue-600 hover:to-indigo-700',
                    });
                }

                if (data?.youtube) {
                    links.push({
                        name: 'YouTube',
                        url: data.youtube,
                        icon: <YouTubeIcon/>,
                        bgColor: 'bg-gradient-to-br from-red-600 to-red-800',
                        hoverColor: 'hover:from-red-700 hover:to-red-900',
                    });
                }

                if (data?.zalo) {
                    links.push({
                        name: 'Zalo',
                        url: `https://zalo.me/${data.zalo}`,
                        icon: <ZaloIcon />,
                        bgColor: 'bg-gradient-to-br from-blue-600 to-cyan-500',
                        hoverColor: 'hover:from-blue-700 hover:to-cyan-600',
                    });
                }

                if (data?.phone) {
                    links.push({
                        name: 'Phone',
                        url: `tel:${data.phone}`,
                        icon: <PhoneIcon />,
                        bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
                        hoverColor: 'hover:from-green-600 hover:to-emerald-700',
                    });
                }

                setSocialLinks(links);
            } catch (error) {
                console.error('Error fetching system data:', error);
            }
        };

        fetchSystemData();
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            className={`
                fixed
                ${position === 'left' ? 'left-4' : 'right-4'}
                top-1/2
                -translate-y-1/2
                z-20
                flex
                flex-col
                items-center
                gap-4
            `}
            style={{ [position]: `${offset}px` }}
        >
            {/* Nút liên hệ chính */}
            <div className="relative group">
                <button
                    onClick={toggleMenu}
                    className={`
                        block
                        w-12
                        h-12
                        rounded-full
                        bg-gradient-to-br from-green-500 to-emerald-600
                        hover:from-green-600 hover:to-emerald-700
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        hover:shadow-xl
                        transform
                        transition-all
                        duration-300
                        hover:scale-110
                        relative
                        overflow-hidden
                    `}
                >
                    {/* Hiệu ứng ánh sáng khi hover */}
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transform skew-x-12 transition-opacity duration-300" />

                    {/* Biểu tượng điện thoại */}
                    <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                        <PhoneIcon />
                    </div>

                    {/* Hiệu ứng pulse */}
                    <span
                        className="absolute inset-0 rounded-full border-2 border-white opacity-20 scale-125 animate-[pulse_2s_infinite]"
                    />
                </button>

                {/* Tooltip */}
                <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Liên hệ ngay
                </div>

                {/* Menu xổ xuống chứa các nút social */}
                {isOpen && (
                    <div className="absolute right-0 top-16 bg-white rounded-lg shadow-xl p-2 w-48 transform transition-all duration-300">
                        <div className="text-center font-bold text-gray-800 mb-2 pb-2 border-b border-gray-200">
                            Liên hệ với chúng tôi
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            <div className="flex flex-col gap-2">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`
                                            flex items-center gap-2 p-2 rounded-md
                                            ${social.bgColor}
                                            ${social.hoverColor}
                                            text-white
                                            transition-all
                                            duration-300
                                            hover:scale-105
                                        `}
                                    >
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            {social.icon}
                                        </div>
                                        <span className="font-medium">{social.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FloatingSocialIcons;