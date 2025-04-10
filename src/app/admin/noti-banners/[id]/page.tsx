"use client";
import { useEffect, useState } from "react";
import api from "@/app/services/axiosService";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import NotificationBannerForm from "../form";
import { INotificationBanner } from "@/app/interfaces/INotificationBanner";

export default function EditNotificationBanner() {
  const [notificationBanner, setNotificationBanner] = useState<INotificationBanner | null>(null);
  const params = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    const fetchNotificationBanner = async (): Promise<void> => {
      try {
        const response = await api.get(`noti-banners/${params.id}`);
        if (response.status === 200) {
          setNotificationBanner(response.data.banner);
        }
      } catch (e) {
        console.error((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationBanner();
  }, [params.id]);

  if (loading) return <Loading />;
  if (!notificationBanner) return <p>Notification Banner not found</p>;

  return <NotificationBannerForm isEditing={true} initialData={notificationBanner} />;
}
