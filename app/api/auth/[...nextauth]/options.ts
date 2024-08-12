import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';

const prisma = new PrismaClient();

async function checkPassword(identifier: string, password: string): Promise<NextAuthUser | null> {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone: identifier },
                    { email: identifier },
                ],
            },
        });

        if (!user) {
            console.error('Пользователь не найден');
            return null;
        }

        const passwordMatches = await compare(password, user.password);

        if (passwordMatches) {
            // Возвращаем объект, который соответствует интерфейсу User и включает phone
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
            } as NextAuthUser;
        } else {
            console.error('Неверный пароль');
            return null;
        }
    } catch (error) {
        console.error('Error while checking password:', error);
        return null;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Identifier', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const { identifier, password } = credentials as { identifier: string, password: string };

                if (!identifier || !password) {
                    console.error('Необходимо указать и identifier, и пароль');
                    return null;
                }

                return await checkPassword(identifier, password);
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    adapter: PrismaAdapter(prisma as any),
    callbacks: {
        async session({ session, token }) {
            if (session && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.phone = token.phone as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.name = user.name as string;
                token.email = user.email as string;
                token.phone = user.phone as string;
            }
            return token;
        },
    },
};

export default NextAuth(authOptions);
