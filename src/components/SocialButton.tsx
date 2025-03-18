import React, { useEffect, useState } from 'react';
import api from "@/app/services/axiosService";

interface SocialLink {
    name: string;
    url: string;
    icon: string;
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
                                                                     size = 60,
                                                                     gap = 20,
                                                                 }) => {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

    const iconImages = {
        tiktok: '/client/assets/images/tiktok_logo.jpg',
        facebook: '/client/assets/images/facebook_logo.webp',
        youtube: '/client/assets/images/youtube_logo.webp',
        zalo: '/client/assets/images/zalo_logo.webp',
    };

    useEffect(() => {
        // Gọi API để lấy dữ liệu
        const fetchSystemData = async () => {
            try {
                const response = await api.get('/clients/systems');
                const data = response.data.system;

                const links: SocialLink[] = [];

                if (data.tiktok) {
                    links.push({
                        name: 'TikTok',
                        url: data.tiktok,
                        icon: iconImages.tiktok,
                        bgColor: 'bg-gradient-to-br from-black to-gray-800',
                        hoverColor: 'hover:from-pink-500 hover:to-purple-500'
                    });
                }

                if (data.facebook) {
                    links.push({
                        name: 'Facebook',
                        url: data.facebook,
                        icon: iconImages.facebook,
                        bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
                        hoverColor: 'hover:from-blue-600 hover:to-indigo-700'
                    });
                }

                if (data.youtube) {
                    links.push({
                        name: 'YouTube',
                        url: data.youtube,
                        icon: iconImages.youtube,
                        bgColor: 'bg-gradient-to-br from-red-600 to-red-800',
                        hoverColor: 'hover:from-red-700 hover:to-red-900'
                    });
                }

                if (data.zalo) {
                    links.push({
                        name: 'Zalo',
                        url: `https://zalo.me/${data.zalo}`,
                        icon: iconImages.zalo,
                        bgColor: 'bg-gradient-to-br from-blue-600 to-cyan-500',
                        hoverColor: 'hover:from-blue-700 hover:to-cyan-600',
                        phone: data.phone
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
        ${position === 'left' ? 'left-' + offset/4 : 'right-' + offset/4}
        top-1/2
        -translate-y-1/2
        z-50
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
              w-${size/4}
              h-${size/4}
              mb-${gap/4}
              rounded-full
              ${social.bgColor}
              ${social.hoverColor}
              flex
              items-center
              justify-center
              shadow-lg
              hover:shadow-2xl
              transform
              transition-all
              duration-500
              hover:rotate-12
              relative
              overflow-hidden
              animate-[float_3s_ease-in-out_infinite]
            `}
                        style={{ animationDelay: `${index * 0.2}s` }}
                    >
                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transform skew-x-12 transition-opacity duration-300" />

                        <img
                            src={social.icon}
                            alt={social.name}
                            width={size * 0.6}
                            height={size * 0.6}
                            className="object-contain transform group-hover:scale-110 transition-transform duration-300"
                        />

                        <span className="absolute inset-0 rounded-full border-2 border-white opacity-20 scale-125 animate-[pulse_2s_infinite]" style={{ animationDelay: `${index * 0.4}s` }} />
                    </a>

                    {social.name === 'Zalo' && social.phone && (
                        <div
                            className={`
                absolute
                ${position === 'left' ? 'right-16' : 'left-16'}
                top-1/2
                -translate-y-1/2
                bg-gray-900
                text-white
                px-3
                py-1
                rounded-lg
                text-sm
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