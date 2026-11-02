import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { auditLogs: true }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, department } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Name, email, and role are required." }, { status: 400 });
    }

    const initials = name
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {
        name,
        role,
        department: department || "Department of Computer Engineering, SITRC",
        avatar: initials
      },
      create: {
        name,
        email: email.toLowerCase().trim(),
        role,
        department: department || "Department of Computer Engineering, SITRC",
        avatar: initials
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
  }
}
