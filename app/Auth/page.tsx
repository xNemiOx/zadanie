import Authentific from '@/components/authForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import Link from 'next/link'

export default async function Auth() {

    const session = await getServerSession();
    if (session?.user) {
        redirect('/Repcenter');
    }

    return (
        <div className=''>
            <Link href="/" className="text-text bg-primary rounded-3xl w-40 py-2 absolute h-10 z-50 p-6 mt-6 ml-6"> ← Вернуться</Link>
            <div className=''>
                <Authentific />
            </div>
        </div>
    )
}
