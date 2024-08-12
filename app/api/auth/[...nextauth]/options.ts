// pages/api/auth.ts

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { Awaitable, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import type { User } from 'next-auth/';

const prisma = new PrismaClient();

async function checkPassword(phone: string, email: string, password: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                phone,
                email,
            },
        });

    // Проверяем, существует ли пользователь с таким email
    if (!user) {
        console.error('Пользователь не найден');
        return null;
    }

    // Хешируем введенный пользователем пароль и сравниваем с хешем из базы данных
    const passwordMatches = await compare(password, user.password);

    if (passwordMatches) {
        // Если пароль совпадает, возвращаем пользователя
        return user;
    } else {
        // Если пароль не совпадает, возвращаем null
        console.error('Неверный пароль');
        return null;
    }
} catch (error) {
    console.error('Error while checking password:', error);
    // Возвращаем общее сообщение об ошибке
    return null;
}
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                phone: { label: 'Phone', type: 'text' },
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials, req): Promise <User | null> {
                const { email, password } = credentials as { email: string, password: string };

                // Проверка для репетитора
                const user = await checkPassword(email, password);
                if (user) {
                    const { password, ...res } = user;
                    return {...res, username: ''};
                }

                return null;
            },
        }),
    ],

    session: {
        strategy:
            'jwt'
    },

    adapter: PrismaAdapter(prisma as any),

    // Измененный маршрут на /api/auth
    callbacks: {
        async session({ session, token, user }) {
            // Проверяем, что сессия существует и содержит пользователя
            if (session && session.user) {
                session.user = token
                return session;
            } else {
                // Если сессия или пользователь не найдены, возвращаем null
                return session;
            }
        },
    },

};

export default NextAuth(authOptions);
