"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OtpVerify from "@/components/auth/OtpVerify";

export default function VerifyPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingEmail");

    if (!pendingEmail) {
      router.replace(".");
    } else {
      setEmail(pendingEmail);
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return null;
  }

  return <OtpVerify email={email} type="register" />;
}