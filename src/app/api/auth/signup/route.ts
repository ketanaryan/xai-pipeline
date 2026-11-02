import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/authCrypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, department } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, institutional email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);
    const initials = name
      .trim()
      .split(' ')
      .map((p: string) => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'OP';

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: role || 'DEVELOPER',
        department: department?.trim() || 'Department of Computer Engineering, SITRC',
        avatar: initials
      }
    });

    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        avatar: newUser.avatar
      },
      message: 'Account registered successfully.'
    }, { status: 201 });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 });
  }
}
