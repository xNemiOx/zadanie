import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function updateProfile(request: NextApiRequest, response: NextApiResponse) {
  const session = await getSession({ req: request });

  if (!session) {
    return response.status(401).json({ error: 'Пользователь не авторизован' });
  }

  const { name, surname, patronymic, location, birth_day, start_date, cost, about_me, gender, lessons, for_whom } = request.body;

  if (!name || !surname || !location || !birth_day || !start_date || !cost || !about_me || !gender || !lessons || !for_whom) {
    return response.status(400).json({ error: 'Не все обязательные поля заполнены' });
  }

  const sessionUserId = (session?.user as { id?: string })?.id;

  if (!sessionUserId) {
    throw new Error('Не удалось получить идентификатор пользователя из сессии');
  }
  
  try {
    const updatedUserData = await prisma.tutor.update({
      where: {
        id: sessionUserId,
      },
      data: {
        // name,
        // surname,
        // patronymic,
        // location,
        // birth_day,
        // start_date,
        // cost,
        // about_me,
        // gender,
        // lessons,
        // for_whom,
      },
    });
  
    console.log('Данные пользователя обновлены:', updatedUserData);
  
    return response.status(200).json({ message: 'Данные успешно обновлены' });
  } catch (error) {
    console.error('Ошибка при обновлении данных пользователя:', error);
    return response.status(500).json({ error: 'Ошибка при обновлении данных пользователя' });
  }
}  
