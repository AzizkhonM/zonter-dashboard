import { NextResponse } from "next/server";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { verifyToken } from "@/lib/jwt";
import { r2 } from "@/lib/r2";
import { cookies } from "next/headers";
import { OrganizationType } from "@prisma/client";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5 MB

function isOrganizationType(value: string): value is OrganizationType {
  return Object.values(OrganizationType).includes(value as OrganizationType);
}

export async function POST(req: Request) {
  let uploadedLogoKey: string | null = null;

  try {
    // 1. Auth
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value?.trim();

    if (!token) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    let decoded;

    try {
      decoded = await verifyToken(token);
    } catch {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
    }

    if (!decoded?.userId) {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
    }

    const userId = decoded.userId;

    // 2. Only one pending request
    const pendingRequest = await prisma.organizationRequest.findFirst({
      where: {
        userId,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    });

    if (pendingRequest) {
      return NextResponse.json(
        { error: "PENDING_REQUEST_EXISTS" },
        { status: 409 },
      );
    }

    // 3. FormData
    const formData = await req.formData();

    const name = String(formData.get("name") ?? "").trim();

    const type = String(formData.get("type") ?? "").trim();

    const description = String(formData.get("description") ?? "").trim();

    const affiliatedOrganization = String(
      formData.get("affiliatedOrganization") ?? "",
    ).trim();

    const website = String(formData.get("website") ?? "").trim();

    const country = String(formData.get("country") ?? "").trim();

    const region = String(formData.get("region") ?? "").trim();

    const city = String(formData.get("city") ?? "").trim();

    const reason = String(formData.get("reason") ?? "").trim();

    const logo = formData.get("logo");

    // 4. Validation
    if (!name || name.length < 3) {
      return NextResponse.json({ error: "INVALID_NAME" }, { status: 400 });
    }

    if (!isOrganizationType(type)) {
      return NextResponse.json({ error: "INVALID_TYPE" }, { status: 400 });
    }

    if (!country) {
      return NextResponse.json({ error: "INVALID_COUNTRY" }, { status: 400 });
    }

    // 5. Logo upload
    let logoUrl: string | null = null;

    if (logo instanceof File && logo.size > 0) {
      if (
        !ALLOWED_TYPES.includes(logo.type as (typeof ALLOWED_TYPES)[number])
      ) {
        return NextResponse.json(
          { error: "INVALID_LOGO_TYPE" },
          { status: 400 },
        );
      }

      if (logo.size > MAX_LOGO_SIZE) {
        return NextResponse.json({ error: "LOGO_TOO_LARGE" }, { status: 400 });
      }

      const extension =
        logo.type === "image/png"
          ? "png"
          : logo.type === "image/webp"
            ? "webp"
            : "jpg";

      const fileName = `${crypto.randomUUID()}.${extension}`;
      const key = `organization-logo/${fileName}`;

      const buffer = Buffer.from(await logo.arrayBuffer());

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: logo.type,
        }),
      );

      uploadedLogoKey = key;
      logoUrl = key;
    }

    // 6. Create request
    const request = await prisma.organizationRequest.create({
      data: {
        userId,

        name,
        description: description || null,
        logoUrl,

        type,

        affiliatedOrganization: affiliatedOrganization || null,

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
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE ORGANIZATION ERROR:", error);

    // DB unique constraint:
    // one PENDING request per user
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      if (uploadedLogoKey) {
        try {
          await r2.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME!,
              Key: uploadedLogoKey,
            }),
          );
        } catch (cleanupError) {
          console.error("R2 CLEANUP ERROR:", cleanupError);
        }
      }

      return NextResponse.json(
        { error: "PENDING_REQUEST_EXISTS" },
        { status: 409 },
      );
    }

    // Any other DB/server error:
    // remove uploaded logo to avoid orphan file
    if (uploadedLogoKey) {
      try {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: uploadedLogoKey,
          }),
        );
      } catch (cleanupError) {
        console.error("R2 CLEANUP ERROR:", cleanupError);
      }
    }

    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
