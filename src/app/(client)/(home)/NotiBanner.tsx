"use client"

import { INotificationBanner } from "@/app/interfaces/INotificationBanner";
import api from "@/app/services/axiosService";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NotiBannerPage = () => {
    const [banner, setBanner] = useState<INotificationBanner | null>(null);
    const [showBanner, setShowBanner] = useState(false);

    const fetchBanner = async () => {
        try {
            const response = await api.get("clients/noti-banners");
            if (response.data.banner) {
                setBanner(response.data.banner);
                setTimeout(() => {
                    setShowBanner(true);
                }, 1000); // đợi 1 giây mới hiển thị
            }
        } catch (e) {
            console.log(e);
        }
    };


    useEffect(() => {
        fetchBanner();
    }, []);

    return (
        <AnimatePresence>
        {showBanner && banner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
            onClick={() => setShowBanner(false)} // đóng khi click ngoài modal
          >
            {/* Ngăn việc click bên trong modal đóng luôn */}
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-[90vw] max-w-xl mx-auto"
              onClick={(e) => e.stopPropagation()} // chặn sự kiện nổi bọt
            >
              <div className="bg-yellow-100 border border-yellow-300 rounded-xl shadow-xl p-4 relative ">
                <button
                  onClick={() => setShowBanner(false)}
                  className="absolute top-5 right-3 text-xl text-gray-600 hover:text-black"
                >
                  ✕
                </button>
      
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  {banner.title}
                </h3>
      
                {banner.content && (
                  <p className="text-sm text-gray-800 mb-3">{banner.content}</p>
                )}
      
                {banner.image_url && (
                  <img
                    src={banner.image_url}
                    alt="Banner"
                    className="w-full h-auto rounded-lg"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      

    );
};

export default NotiBannerPage;
