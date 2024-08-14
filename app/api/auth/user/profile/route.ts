import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentEmail = session.user.email;
  
  if (!currentEmail) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    const { name, phone, email, oldPassword, newPassword } = await req.json();

    const user = await prisma.user.findUnique({ where: { email: currentEmail } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (oldPassword) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Старый пароль неверен' }, { status: 400 });
      }
    }

    const data: any = { name, phone };

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      data.password = hashedPassword;
    }

    if (email) {
      data.email = email;
    }

    const updatedUser = await prisma.user.update({
      where: { email: currentEmail },
      data,
    });

    return NextResponse.json({ message: 'Профиль успешно обновлен', user: updatedUser });
  } catch (error: unknown) {
    const e = error as { code?: string; meta?: { target?: string[] } };

    console.error('Error updating user:', e);

    if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
      return NextResponse.json({ error: 'Этот email уже используется' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Произошла ошибка при обновлении профиля' }, { status: 500 });
  }
};










// import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
// import { compare, hash } from 'bcrypt';

// const prisma = new PrismaClient();

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method !== 'POST') {
//         return res.status(405).json({ error: 'Method Not Allowed' });
//     }

//     try {
//         const { name, phone, email, oldPassword, newPassword } = req.body;

//         console.log('Request Body:', req.body);  // Логируем данные запроса

//         if (!email) {
//             return res.status(400).json({ error: 'Email is required' });
//         }

//         console.log('Looking for user with email:', email);  // Логируем email

//         const user = await prisma.user.findUnique({ where: { email } });

//         if (!user) {
//             console.log('User not found');  // Логируем, если пользователь не найден
//             return res.status(404).json({ error: 'User not found' });
//         }

//         console.log('User found:', user);  // Логируем найденного пользователя

//         if (oldPassword && newPassword) {
//             const isMatch = await compare(oldPassword, user.password);
//             if (!isMatch) {
//                 return res.status(400).json({ error: 'Old password is incorrect' });
//             }

//             const hashedNewPassword = await hash(newPassword, 10);
//             user.password = hashedNewPassword;
//         }

//         const updatedUser = await prisma.user.update({
//             where: { email },
//             data: {
//                 name,
//                 phone,
//                 ...(newPassword ? { password: await hash(newPassword, 10) } : {}), // Обновляем пароль только если он указан
//             },
//         });

//         return res.status(200).json({ message: 'User updated successfully', user: updatedUser });

//     } catch (error) {
//         console.error('Error updating user:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// }