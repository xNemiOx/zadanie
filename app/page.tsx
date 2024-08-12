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
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/Auth');
        } else {
            const user = session.user;
            console.log(user); // Проверка структуры данных

            setName(user?.name || '');
            setEmail(user?.email || '');

            // Условие на случай, если телефонный номер не передается
            setPhone(user?.phone || '');
        }
    }, [session, status, router]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      setMessage('');
  
      try {
          const response = await fetch('/api/user/update', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  name,
                  phone,
                  email,
                  password, // Передаем пароль, если он указан
              }),
          });
  
          if (response.ok) {
              setMessage('Данные успешно обновлены');
          } else {
              const data = await response.json();
              setError(data.error || 'Произошла ошибка при обновлении данных');
          }
      } catch (error) {
          setError('Произошла ошибка при выполнении запроса');
          console.error('Ошибка:', error);
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
                            <input
                                name='name'
                                placeholder='Имя'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='text-black py-3 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-grey'
                            />
                            <input
                                name='phone'
                                placeholder='Телефон'
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
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-12 pr-3 flex items-center text-black">
                                    {showPassword ? 'Скрыть' : 'Показать'}
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
                        <button type="submit" className="text-black bg-white rounded-3xl w-52 py-3">
                            Обновить
                        </button>
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
