import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";

export default async function Dashboard() {
  return "Salom";
}