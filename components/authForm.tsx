'use client'

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
    const [email, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Добавляем состояние для отображения пароля
    const [error, setError] = useState('');

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Предотвращаем стандартное поведение отправки формы
        try {

            const response = await signIn('credentials', {
                email: email,
                password: password,
                redirect: true,
                callbackUrl: '/Repcenter'
            })

            if (response?.ok) {
                // Если аутентификация прошла успешно, перенаправляем пользователя на защищенную страницу
                router.push('/Repcenter');
                router.refresh();
            }
        } catch (error) {
            console.error('Ошибка:', error);
            setError('Произошла ошибка при выполнении запроса');
        }

    };

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-24 bg-background">
            <div className="flex justify-center relative w-full max-w-sm">
                <div className="px-9 w-full h-auto rounded-md backdrop-filter backdrop-blur-lg bg-Liteprimary transition duration-300 text-center items-center flex flex-col">
                    <div className="text-black font-sans text-4xl flex flex-row justify-center">
                        <p className="text-text pt-5 pb-8">Вход</p>
                    </div>
                    <form onSubmit={(e) => handleLogin(e)} className='flex flex-col items-center justify-center'>
                        <div className='pt-5 space-y-8 pb-8'>
                            <input name='email' placeholder='Логин' value={email} onChange={(e) => setLogin(e.target.value)} className='text-background py-3 px-2 font-semibold rounded-md h-14 transition bg-text z-10 placeholder:text-background'></input>
                            <div className="relative">
                                <input name='password' type={showPassword ? 'text' : 'password'} placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)} className='text-background py-3 px-2 font-semibold rounded-md h-14 transition bg-text z-10 placeholder:text-background'></input>
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    {showPassword ? 'Скрыть' : 'Показать'}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="text-text bg-primary rounded-3xl w-52 py-3">
                            Войти
                        </button>
                        {error && <p className="text-text text-sm mt-2">{error}</p>}
                        <Link href="/Reg" className="text-text text-xs mt-4 pb-4">Ещё нет аккаунта?</Link>
                    </form>
                </div>
            </div>
        </main>
    );
}
