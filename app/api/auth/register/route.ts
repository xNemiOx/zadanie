import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  try {
    const { name, phone, email, password } = await req.json();

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Хешируем пароль
    const hashedPassword = await hash(password, 10);

    // Создаем нового пользователя
    const newUser = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (e) {
    console.error('Error creating user:', e);
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
}
