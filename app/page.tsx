import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export default async function Dashboard() {
  const cookieStore = await cookies(); // ← await qo'shildi
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>Not authorized</div>;
  }

  const payload = verifyToken(token) as unknown as { userId: string } | null;

  console.log(payload);
  

  if (!payload) {
    return <div>Not authorized</div>;
  }

  return <div>Welcome, user: {payload.userId}</div>;
}