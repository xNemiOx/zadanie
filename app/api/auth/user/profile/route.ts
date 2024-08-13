import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, phone, email, oldPassword, newPassword } = req.body;

        console.log('Request Body:', req.body);  // Логируем данные запроса

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        console.log('Looking for user with email:', email);  // Логируем email

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log('User not found');  // Логируем, если пользователь не найден
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('User found:', user);  // Логируем найденного пользователя

        if (oldPassword && newPassword) {
            const isMatch = await compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Old password is incorrect' });
            }

            const hashedNewPassword = await hash(newPassword, 10);
            user.password = hashedNewPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                name,
                phone,
                ...(newPassword ? { password: await hash(newPassword, 10) } : {}), // Обновляем пароль только если он указан
            },
        });

        return res.status(200).json({ message: 'User updated successfully', user: updatedUser });

    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
