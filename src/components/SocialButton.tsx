import React, { useEffect, useState } from 'react';
import api from "@/app/services/axiosService";

// Định nghĩa interface cho SocialLink
export interface SocialLink {
    name: string;
    url: string;
    icon: React.ReactNode; // Sử dụng React node để render SVG
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
            <circle cx="24" cy="24" r="24" fill="#0068FF" /> {/* Nền tròn màu xanh lam */}
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
        <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="#1E90FF" />
            <path
                d="M34 36c-1.5 0-3-.5-4.5-1.5-3-2-6-4.5-9-7.5s-5-6-7-9c-1-1.5-1.5-3-1.5-4.5 0-1.5.5-3 1.5-4.5l2-2c.5-.5 1-.5 1.5 0l4 4c.5.5.5 1 0 1.5l-2 2c-.5.5-.5 1 0 1.5 1 1.5 2 3 3.5 4.5s3 2.5 4.5 3.5c.5.5 1 .5 1.5 0l2-2c.5-.5 1-.5 1.5 0l4 4c.5.5.5 1 0 1.5l-2 2c-1.5 1-3 1.5-4.5 1.5z"
                fill="white"
            />
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
                        bgColor: 'bg-gradient-to-br from-blue-600 to-cyan-500',
                        hoverColor: 'hover:from-blue-700 hover:to-cyan-600',
                    });
                }

                setSocialLinks(links);
            } catch (error) {
                console.error('Error fetching system data:', error);
            }
        };

        fetchSystemData();
    }, []);

    return (
        <div
            className={`
                fixed
                ${position === 'left' ? 'left-4' : 'right-4'}
                top-3/4
                -translate-y-1/2
                z-20
                flex
                flex-col
                items-center
                gap-4
            `}
            style={{ [position]: `${offset}px` }}
        >
            {socialLinks.map((social, index) => (
                <div key={social.name} className="relative group">
                    <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            block
                            w-12
                            h-12
                            rounded-full
                            ${social.bgColor}
                            ${social.hoverColor}
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
                            animate-[float_3s_ease-in-out_infinite]
                        `}
                        style={{ animationDelay: `${index * 0.2}s` }}
                    >
                        {/* Hiệu ứng ánh sáng khi hover */}
                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transform skew-x-12 transition-opacity duration-300" />

                        {/* Biểu tượng SVG */}
                        <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                            {social.icon}
                        </div>

                        {/* Hiệu ứng pulse */}
                        <span
                            className="absolute inset-0 rounded-full border-2 border-white opacity-20 scale-125 animate-[pulse_2s_infinite]"
                            style={{ animationDelay: `${index * 0.4}s` }}
                        />
                    </a>

                    {/* Tooltip cho Zalo */}
                    {social.name === 'Zalo' && social.phone && (
                        <div
                            className={`
                                absolute
                                ${position === 'left' ? 'right-14' : 'left-14'}
                                top-1/2
                                -translate-y-1/2
                                bg-gray-800
                                text-white
                                px-3
                                py-1
                                rounded-lg
                                text-sm
                                font-medium
                                opacity-0
                                group-hover:opacity-100
                                transform
                                ${position === 'left' ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}
                                transition-all
                                duration-300
                                pointer-events-none
                                whitespace-nowrap
                                shadow-md
                            `}
                        >
                            {social.phone}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FloatingSocialIcons;