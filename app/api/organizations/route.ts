import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { r2 } from "@/lib/r2";
import { cookies } from "next/headers";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

export async function POST(req: Request) {
  try {
    // 1. Auth
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value?.trim();

    if (!token) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    let decoded: any;

    try {
      decoded = await verifyToken(token);
    } catch {
      return NextResponse.json(
        { error: "INVALID_TOKEN" },
        { status: 401 }
      );
    }

    if (!decoded?.userId) {
      return NextResponse.json(
        { error: "INVALID_TOKEN" },
        { status: 401 }
      );
    }

    // 2. FormData
    const formData = await req.formData();

    const name = String(formData.get("name") ?? "").trim();
    const type = String(formData.get("type") ?? "");
    const description = String(
      formData.get("description") ?? ""
    ).trim();

    const affiliatedOrganization = String(
      formData.get("affiliatedOrganization") ?? ""
    ).trim();

    const website = String(
      formData.get("website") ?? ""
    ).trim();

    const country = String(
      formData.get("country") ?? ""
    ).trim();

    const region = String(
      formData.get("region") ?? ""
    ).trim();

    const city = String(
      formData.get("city") ?? ""
    ).trim();

    const reason = String(
      formData.get("reason") ?? ""
    ).trim();

    const logo = formData.get("logo");

    // 3. Basic validation
    if (!name || name.length < 3) {
      return NextResponse.json(
        { error: "INVALID_NAME" },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: "INVALID_TYPE" },
        { status: 400 }
      );
    }

    if (!country) {
      return NextResponse.json(
        { error: "INVALID_COUNTRY" },
        { status: 400 }
      );
    }

    // 4. Logo → R2
    let logoUrl: string | null = null;

    if (logo instanceof File && logo.size > 0) {
      if (!ALLOWED_TYPES.includes(logo.type)) {
        return NextResponse.json(
          { error: "INVALID_LOGO_TYPE" },
          { status: 400 }
        );
      }

      const extension =
        logo.type === "image/png"
          ? "png"
          : logo.type === "image/webp"
          ? "webp"
          : "jpg";

      const fileName = `${crypto.randomUUID()}.${extension}`;

      const key = `organization-logo/${fileName}`;

      const buffer = Buffer.from(
        await logo.arrayBuffer()
      );

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: logo.type,
        })
      );

      logoUrl = key;
    }

    const request = await prisma.organizationRequest.create({
      data: {
        userId: decoded.userId,

        name,
        description: description || null,
        logoUrl,
        type: type as any,
        affiliatedOrganization:
          affiliatedOrganization || null,
        website: website || null,
        country,
        region: region || null,
        city: city || null,
        reason: reason || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        requestId: request.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE ORGANIZATION ERROR:", error);

    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}