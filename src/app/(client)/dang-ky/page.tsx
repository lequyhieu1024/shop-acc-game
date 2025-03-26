"use client"; // Add this line at the top of the file

import dynamic from "next/dynamic";

const AuthForm = dynamic(() => import("@/components/(client)/AuthForm"), {
  ssr: false
});

export default function Home() {
  return <AuthForm tab={'register'}/>;
}
