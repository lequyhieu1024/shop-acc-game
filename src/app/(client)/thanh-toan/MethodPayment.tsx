"use client";
import { Modal, Space, Tooltip, Typography, Alert } from 'antd';
import { useEffect, useState } from 'react';
import api from '@/app/services/axiosService';
import { SocialLink } from '@/components/SocialButton';
import { ISystem } from '@/app/interfaces/ISystem';
import Image from 'next/image';

const { Title } = Typography;

interface MethodPaymentProps {
    visible: boolean;
    onClose: () => void;
}

const FacebookIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12a10 10 0 1 0-11.56 9.88V15h-2.27v-3h2.27V9.5a3.13 3.13 0 0 1 3.34-3.5 13.38 13.38 0 0 1 2 .17v2.32h-1.38a1.27 1.27 0 0 0-1.43 1.38V12h2.5l-.4 3H14v6.88A10 10 0 0 0 22 12z" />
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
    <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#1E90FF" />
        <path
            d="M34 36c-1.5 0-3-.5-4.5-1.5-3-2-6-4.5-9-7.5s-5-6-7-9c-1-1.5-1.5-3-1.5-4.5 0-1.5.5-3 1.5-4.5l2-2c.5-.5 1-.5 1.5 0l4 4c.5.5.5 1 0 1.5l-2 2c-.5.5-.5 1 0 1.5 1 1.5 2 3 3.5 4.5s3 2.5 4.5 3.5c.5.5 1 .5 1.5 0l2-2c.5-.5 1-.5 1.5 0l4 4c.5.5.5 1 0 1.5l-2 2c-1.5 1-3 1.5-4.5 1.5z"
            fill="white"
        />
    </svg>
);

export default function MethodPayment({ visible, onClose }: MethodPaymentProps) {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [data, setData] = useState<ISystem | undefined>(undefined);

    useEffect(() => {
        const fetchSystemData = async () => {
            try {
                const response = await api.get('/clients/systems');
                const data = response.data.system;
                setData(data);

                const links: SocialLink[] = [];

                if (data?.facebook) {
                    links.push({
                        name: 'Facebook',
                        url: data.facebook,
                        icon: <FacebookIcon />,
                        bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
                        hoverColor: 'hover:from-blue-600 hover:to-indigo-700',
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
                        bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
                        hoverColor: 'hover:from-blue-600 hover:to-indigo-700',
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
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={600}
        >
            <div className="space-y-6">
                <Title level={4} className="text-center">Liên hệ với Admin để mua nick</Title>
                
                <Alert
                    message="Thông báo"
                    description={
                        <div className="space-y-2">
                            <p>Chọn phương thức liên lạc với admin để mua nick.</p>
                            <p>Admin cam kết giao dịch uy tín, minh bạch nhất Việt Nam.</p>
                            <p>Có thể giao dịch trực tiếp.</p>
                        </div>
                    }
                    type="info"
                    showIcon
                />

                {data && data.qr_code && (
                    <div className="text-center">
                        <Image
                            height={300}
                            width={300}
                            src={data.qr_code}
                            alt={'QR Code'}
                            className='m-auto'
                        />
                    </div>
                )}

                <Space size="large" className="flex justify-center text-3xl">
                    {socialLinks.map((social, index) => (
                        <Tooltip title={social.name} color='blue' key={index}>
                            <div key={index} className="relative group">
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
                                    `}
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transform skew-x-12 transition-opacity duration-300" />
                                    <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                                        {social.icon}
                                    </div>
                                    <span
                                        className="absolute inset-0 rounded-full border-2 border-white opacity-20 scale-125 animate-[pulse_2s_infinite]"
                                        style={{ animationDelay: `${index * 0.4}s` }}
                                    />
                                </a>
                            </div>
                        </Tooltip>
                    ))}
                </Space>
            </div>
        </Modal>
    );
}
