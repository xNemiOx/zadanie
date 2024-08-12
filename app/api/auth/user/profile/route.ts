// pages/api/user/update.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { name, phone, email, password } = await request.json();

        // Валидация входных данных
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Обновляем информацию о пользователе
        const dataToUpdate: any = {
            name,
            phone,
        };

        // Если пароль указан, хэшируем его и добавляем к данным для обновления
        if (password) {
            dataToUpdate.password = await hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { email }, // Используем email для поиска пользователя
            data: dataToUpdate,
        });

        return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
    } catch (e) {
        console.error("Error updating user:", e);
        return NextResponse.json({ error: 'An error occurred during user update' }, { status: 500 });
    }
}
