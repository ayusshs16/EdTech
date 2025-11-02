"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import GenZAnimation from "@/components/ui/genz-animation";

function WelcomeBanner() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <GenZAnimation className="p-5 w-full text-black rounded-lg">
      <div className="flex items-center gap-6">
        <Image src={"/laptop.png"} alt="laptop" width={100} height={100} />
        <div>
          <h2 className="font-bold text-3xl">Hello, {user?.fullName} 🚀</h2>
          <p className="">
            Welcome back, it&apos;s time to get back and start learning new course ✨
          </p>
        </div>
      </div>
    </GenZAnimation>
  );
}

export default WelcomeBanner;
