import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, oldPassword, newPassword } = await req.json();

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Сравниваем введённый старый пароль с текущим паролем пользователя
    const passwordMatch = await compare(oldPassword, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Old password is incorrect' }, { status: 401 });
    }

    // Хешируем новый пароль
    const hashedPassword = await hash(newPassword, 10);

    // Обновляем данные пользователя в базе данных
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name,
        phone,
        password: hashedPassword,
      },
    });

    console.log(updatedUser);

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (e) {
    console.error('Error updating user:', e);
    return NextResponse.json({ error: 'An error occurred during profile update' }, { status: 500 });
  }
}
