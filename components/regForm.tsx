'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [correctPassword, setCorrectPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (password !== correctPassword) {
            setError('Пароли не совпадают');
            return;
        }
    
        try {
            const payload: { email?: string; phone?: string; password: string } = {
                password: password,
            };
    
            if (email) {
                if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                    setError('Неверный формат адреса электронной почты');
                    return;
                }
                payload.email = email;
            } else if (phone) {
                if (!phone.match(/^\+?[1-9]\d{1,14}$/)) {
                    setError('Неверный формат номера телефона');
                    return;
                }
                payload.phone = phone;
            } else {
                setError('Необходимо указать либо email, либо телефон');
                return;
            }
    
            const response = await fetch(`/api/auth/register`, {
                method: 'POST',
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                router.push('/Auth');
            } else {
                const data = await response.json();
                setError(data.error || 'Произошла ошибка при регистрации');
            }
        } catch (error) {
            setError('Произошла ошибка при регистрации');
        }
    };
    

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-24 bg-background">
            <div className="flex justify-center relative w-full max-w-sm">
                <div className="px-9 w-full h-auto rounded-md backdrop-filter backdrop-blur-lg bg-grey transition duration-300 text-center items-center flex flex-col">
                    <div className="text-black font-sans text-4xl flex flex-row justify-center">
                        <p className="text-black pt-5 pb-8">Регистрация</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="pt-5 space-y-8 pb-8">
                            <input name='Name' placeholder='Имя' className='text-background py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'></input>
                            <input name='phone' placeholder='Телефон' value={phone} onChange={(e) => setPhone(e.target.value)} className='text-background py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'></input>
                            <input name='email' placeholder='Электронная почта' value={email} onChange={(e) => setEmail(e.target.value)} className='text-background py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'></input>
                            <div className="relative">
                                <input name='password' type={showPassword ? 'text' : 'password'} placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)} className='text-background py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'></input>
                                <button type="button" className="absolute mt-4 right-10" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? 'Скрыть' : 'Показать'}
                                </button>
                            </div>
                            <input name='correctPassword' type={showPassword ? 'text' : 'password'} placeholder='Подтверждение пароля' value={correctPassword} onChange={(e) => setCorrectPassword(e.target.value)} className='text-background py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'></input>

                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <button type="submit" className="text-black bg-primary rounded-3xl w-52 py-3">
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
