import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>Not authorized</div>;
  }

  const payload = verifyToken(token);

  console.log(payload);

  if (!payload) {
    return <div>Not authorized</div>;
  }

  if (typeof payload === "string") {
    return <div>Invalid token</div>;
  }

  const userId = (payload as JwtPayload & { userId: string }).userId;

  return <div>Welcome, user: {userId}</div>;
}