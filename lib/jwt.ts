import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export type JwtPayload = {
  userId: string;
  role: "USER" | "SUPER_ADMIN";
};

export async function signToken(payload: JwtPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, SECRET);

  if (
    typeof payload.userId !== "string" ||
    (payload.role !== "USER" && payload.role !== "SUPER_ADMIN")
  ) {
    throw new Error("INVALID_TOKEN_PAYLOAD");
  }

  return {
    userId: payload.userId,
    role: payload.role,
  };
}
