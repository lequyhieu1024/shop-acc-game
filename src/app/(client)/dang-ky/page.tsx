"use client"; // Add this line at the top of the file

import dynamic from "next/dynamic";

const AuthForm = dynamic(() => import("@/components/(client)/AuthForm"), {
  ssr: false
});

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <AuthForm tab="register" />
        </div>
      </div>
    </div>
  );
}
