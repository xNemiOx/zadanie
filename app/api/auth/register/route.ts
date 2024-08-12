import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { phone, email, password } = await request.json();

    // Валидация, чтобы либо email, либо телефон были указаны
    if (!email && !phone) {
      return NextResponse.json({ error: 'Необходимо указать либо email, либо телефон' }, { status: 400 });
    }

    // Хэшируем пароль
    const hashedPassword = await hash(password, 10);

    // Создаем нового пользователя
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
      },
    });

    console.log(user);

    return NextResponse.json({ message: 'success' });

  } catch (e) {
    console.error("Error creating user:", e);
    return NextResponse.json({ error: 'An error occurred during user creation' }, { status: 500 });
  }
}
