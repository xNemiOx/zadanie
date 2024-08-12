'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default function Register() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [correctPassword, setCorrectPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Добавляем состояние для отображения пароля
    const [error, setError] = useState('');

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password.length < 6) {
            setError('Пароль должен содержать не менее 6 символов');
            return;
        }
        
        if (password !== correctPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            setError('Неверный формат адреса электронной почты');
            return;
        }

        if (!phone.match(/^\+?[1-9]\d{1,14}$/)) {
            setError('Неверный формат номера телефона');
            return;
        }

        try {
            const response = await fetch(`/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    email: email,
                    password: password
                }),
            });

            console.log('Status:', response.status);

            if (response.ok) {
                router.push('/Auth');
            } else {
                const data = await response.json();
                console.error('Ошибка:', data);
                setError('Такой пользователь уже существует');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
            setError('Произошла ошибка при регистрации');
        }
    };

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-24 bg-white">
            <div className="flex justify-center relative w-full max-w-sm">
                <div className="px-9 w-full h-auto rounded-md backdrop-filter backdrop-blur-lg bg-grey transition duration-300 text-center items-center flex flex-col">
                    <div className="text-black font-sans text-4xl flex flex-row justify-center">
                        <p className="text-black pt-5 pb-8">Регистрация</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="pt-5 space-y-8 pb-8">
                            <input 
                                name='name' 
                                placeholder='Имя' 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className='text-black py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'
                            />
                            <input 
                                name='phone' 
                                placeholder='Номер телефона' 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                className='text-black py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'
                            />
                            <input 
                                name='email' 
                                placeholder='Электронная почта' 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className='text-black py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'
                            />
                            <div className="relative">
                                <input 
                                    name='password' 
                                    type={showPassword ? 'text' : 'password'} 
                                    placeholder='Пароль' 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className='text-black py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'
                                />
                                <button 
                                    type="button" 
                                    className="absolute mt-4 right-16 text-black" 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Скрыть' : 'Показать'}
                                </button>
                            </div>
                            <input 
                                name='correctPassword' 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder='Подтверждение пароля' 
                                value={correctPassword} 
                                onChange={(e) => setCorrectPassword(e.target.value)} 
                                className='text-black py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <button 
                            type="submit" 
                            className="text-black bg-white rounded-3xl w-52 py-3"
                        >
                            Зарегистрироваться
                        </button>
                    </form>
                    <Link href="/Auth" className="text-black text-xs mt-4 pb-6">
                        Уже есть аккаунт?
                    </Link>
                </div>
            </div>
        </main>
    );
}
