import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/ev-bg.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-white/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 -mt-32">
        {/* Top Branding */}
        <div className="flex flex-col items-center pb-8">
          <div className="w-[90%] max-w-sm mb-4">
            <Image
              src="/images/ev-logo-main.png"
              alt="EV Academy"
              width={384}
              height={96}
              className="w-full h-auto drop-shadow-md"
              priority
            />
          </div>

          <p className="text-sm text-gray-700 font-medium drop-shadow-sm">
            AI-Powered Smart Class Management
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-sm bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/10 p-6">
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-6 text-center">
        <p className="text-[11px] text-gray-600 font-medium">
          &copy; 2026 EV Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
}
