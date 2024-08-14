'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Profile() {
    const { data: session, status } = useSession();
    const [name, setName] = useState('');
    const [originalName, setOriginalName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/Auth');
        } else {
            const user = session.user;
            setName(user?.name || '');
            setOriginalName(user?.name || '');
            setEmail(user?.email || '');
            setOriginalEmail(user?.email || '');
            setPhone(user?.phone || '');
        }
    }, [session, status, router]);

    const handleUpdate = async () => {
        if (name === originalName && email === originalEmail && !newPassword) {
            setMessage('Изменений нет.');
            setIsEditing(false);
            return;
        }

        setError('');
        setMessage('');

        try {
            const response = await fetch('/api/auth/user/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phone, oldPassword, newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                setError(errorData?.error || 'Произошла ошибка при обновлении данных');
                return;
            }

            const data = await response.json();
            setMessage('Данные успешно обновлены');
            setOriginalName(name);
            setOriginalEmail(email);

            router.refresh();

            setIsEditing(false);
        } catch (error) {
            setError('Произошла ошибка при выполнении запроса');
        }
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-24 bg-white">
            <div className="flex justify-center relative w-full max-w-sm">
                <div className="px-9 pb-4 w-full h-auto rounded-md backdrop-filter backdrop-blur-lg bg-grey transition duration-300 text-center items-center flex flex-col">
                    <div className="text-black font-sans text-4xl flex flex-row justify-center">
                        <p className="text-black pt-5 pb-8">Профиль</p>
                    </div>
                    <form className='flex flex-col items-center justify-center'>
                        <div className='pt-5 space-y-8 pb-8'>
                            {isEditing ? (
                                <>
                                    <div className='flex flex-col items-center'>
                                        <input
                                            name='name'
                                            placeholder='Имя'
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className='text-black py-3 px-2 font-semibold rounded-md h-14 transition w-72 bg-white z-10 placeholder:text-grey'
                                        />
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <input
                                            name='email'
                                            placeholder='Почта'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className='text-black py-3 px-2 font-semibold rounded-md h-14 transition w-72 bg-white z-10 placeholder:text-grey'
                                        />
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <input
                                            name='phone'
                                            placeholder='Телефон'
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className='text-black py-3 px-2 font-semibold rounded-md h-14 transition w-72 bg-white z-10 placeholder:text-grey'
                                        />
                                    </div>
                                    <div className='flex flex-col items-center relative'>
                                        <input
                                            type={showPasswords ? 'text' : 'password'}
                                            name='oldPassword'
                                            placeholder='Старый пароль'
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className='text-black py-3 px-2 font-semibold rounded-md h-14 transition w-72 bg-white z-10 placeholder:text-grey'
                                        />
                                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute inset-y-0 right-1 pr-3 flex items-center text-black z-50">
                                            {showPasswords ? 'Скрыть' : 'Показать'}
                                        </button>
                                    </div>
                                    <div className='flex flex-col items-center relative'>
                                        <input
                                            type={showPasswords ? 'text' : 'password'}
                                            name='newPassword'
                                            placeholder='Новый пароль'
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className='text-black py-3 px-2 font-semibold rounded-md h-14 transition w-72 bg-white z-10 placeholder:text-grey'
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='flex flex-col items-center'>
                                        <label className='text-black py-3 px-2 font-semibold rounded-md h-14 transition z-10'>
                                            {name || 'Имя'}
                                        </label>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <label className='text-black py-3 px-2 font-semibold rounded-md h-14 transition z-10'>
                                            {email || 'Почта'}
                                        </label>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <label className='text-black py-3 px-2 font-semibold rounded-md h-14 transition z-10'>
                                            {phone || 'Телефон'}
                                        </label>
                                    </div>
                                </>
                            )}
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
                        <div className="flex space-x-4">
                            {isEditing ? (
                                <>
                                    <button type="button" onClick={handleUpdate} className="text-black bg-white rounded-3xl w-36 py-3">
                                        Обновить
                                    </button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="text-black bg-white rounded-3xl w-36 py-3">
                                        Отмена
                                    </button>
                                </>
                            ) : (
                                <button type="button" onClick={() => setIsEditing(true)} className="text-black bg-white rounded-3xl w-52 py-3">
                                    Редактировать
                                </button>
                            )}
                        </div>
                    </form>
                    <div className="space-x-8 mt-4">
                        <Link onClick={() => { signOut(); }} href="/" className="text-black pb-5">
                            Выйти из аккаунта
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}