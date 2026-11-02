import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");
    const role = searchParams.get("role");
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const whereClause: any = {};
    if (userEmail && userEmail !== "ALL") {
      whereClause.userEmail = userEmail;
    }
    if (role && role !== "ALL") {
      whereClause.userRole = role;
    }

    const logs = await prisma.auditLog.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            avatar: true,
            department: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: limit
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("API Error fetching logs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
