"use client"; // Add this line at the top of the file

import dynamic from "next/dynamic";

const ProfilePage = dynamic(() => import("@/components/(client)/(header)/Profile"), {
  ssr: false
});

export default function Home() {
  return <ProfilePage />;
}
