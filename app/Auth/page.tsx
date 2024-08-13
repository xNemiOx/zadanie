import Authentific from '@/components/authForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import Link from 'next/link'

export default async function Auth() {

    const session = await getServerSession();

    if (session?.user) {
        redirect('/'); // Перенаправляем авторизованного пользователя на главную страницу
        return null;
    }

    return (
        <div className=''>
            <div className=''>
                <Authentific />
            </div>
        </div>
    )
}
