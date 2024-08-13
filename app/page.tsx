'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Profile() {
    const { data: session, status } = useSession();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/Auth');
        } else {
            const user = session.user;
            setName(user?.name || '');
            setEmail(user?.email || '');
            setPhone(user?.phone || '');
        }
    }, [session, status, router]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setMessage('');
    
        try {
            const response = await fetch('/api/auth/user/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    oldPassword,
                    newPassword,
                }),
            });
    
            // Логирование полного ответа для отладки
            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);
    
            // Проверка на ошибки
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Response error data:', errorData); // Логирование данных ошибки
                setError(errorData?.error || 'Произошла ошибка при обновлении данных');
                return;
            }
    
            const data = await response.json();
            setMessage('Данные успешно обновлены');
            setOldPassword(''); // Очистка полей пароля после успешного обновления
            setNewPassword('');
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);  // Логирование ошибок
            setError('Произошла ошибка при выполнении запроса');
        }
    };
    
    

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-24 bg-white">
            <div className="flex justify-center relative w-full max-w-sm">
                <div className="px-9 w-full h-auto rounded-md backdrop-filter backdrop-blur-lg bg-grey transition duration-300 text-center items-center flex flex-col">
                    <div className="text-black font-sans text-4xl flex flex-row justify-center">
                        <p className="text-black pt-5 pb-8">Профиль</p>
                    </div>
                    <form onSubmit={handleUpdate} className='flex flex-col items-center justify-center'>
                        <div className='pt-5 space-y-8 pb-8'>
                            <div className='flex items-center'>
                                {isEditing ? (
                                    <input
                                        name='name'
                                        placeholder='Имя'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className='text-black py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-grey'
                                    />
                                ) : (
                                    <label className='text-black py-3 px-2 font-semibold rounded-md h-14 transition z-10'>
                                        {name || 'Имя'}
                                    </label>
                                )}
                            </div>
                            <div className='flex items-center'>
                                {isEditing ? (
                                    <input
                                        name='phone'
                                        placeholder='Телефон'
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className='text-black py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'
                                    />
                                ) : (
                                    <label className='text-black py-3 px-2 font-semibold rounded-md h-14 transition  z-10'>
                                        {phone || 'Телефон'}
                                    </label>
                                )}
                            </div>
                            <div className='flex items-center'>
                                {isEditing ? (
                                    <input
                                        name='email'
                                        placeholder='Электронная почта'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='text-black py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'
                                    />
                                ) : (
                                    <label className='text-black py-3 px-2 font-semibold rounded-md h-14 transition z-10'>
                                        {email || 'Электронная почта'}
                                    </label>
                                )}
                            </div>

                            {isEditing && (
                                <>
                                    <div className="relative">
                                        <input
                                            name='oldPassword'
                                            type={showOldPassword ? 'text' : 'password'}
                                            placeholder='Старый пароль'
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className='text-black py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'
                                        />
                                        <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute inset-y-0 right-12 pr-3 flex items-center text-black">
                                            {showOldPassword ? 'Скрыть' : 'Показать'}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <input
                                            name='newPassword'
                                            type={showNewPassword ? 'text' : 'password'}
                                            placeholder='Новый пароль'
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className='text-black py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'
                                        />
                                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-12 pr-3 flex items-center text-black">
                                            {showNewPassword ? 'Скрыть' : 'Показать'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
                        <div className="flex space-x-4">
                            {isEditing ? (
                                <>
                                    <button type="submit" className="text-black bg-white rounded-3xl w-52 py-3">
                                        Обновить
                                    </button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="text-black bg-gray-300 rounded-3xl w-52 py-3">
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
                        <Link onClick={() => { signOut(); }} href="/" className="text-black">
                            Выйти
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
