import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const {email, password, role, name } = await request.json();

    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        role,
        email,
        password: hashedPassword,
        name
      }
    })

    console.log(user)

  } catch (e) {
    console.error("Error creating user:", e);
    return NextResponse.json({ error: 'An error occurred during user creation' }, { status: 500 });
  }

  return NextResponse.json({ message: 'success' });
}
