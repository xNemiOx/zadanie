'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    yandexCaptchaCallback: (token: string) => void;
  }
}

export default function AuthForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://captcha-api.yandex.ru/captcha.js';
    script.async = true;
    document.body.appendChild(script);

    window.yandexCaptchaCallback = function (token) {
      setCaptchaToken(token);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaToken) {
      setError('Пожалуйста, подтвердите, что вы не робот.');
      return;
    }

    try {
      const response = await signIn('credentials', {
        identifier,
        password,
        captchaToken,
        redirect: false,
        callbackUrl: '/'
      });

      if (response?.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Неверный телефон/почта или пароль');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Произошла ошибка при выполнении запроса');
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex justify-center relative w-full max-w-sm">
        <div className="px-9 w-full h-auto rounded-md backdrop-filter backdrop-blur-lg bg-grey transition duration-300 text-center items-center flex flex-col">
          <div className="text-black font-sans text-4xl flex flex-row justify-center">
            <p className="text-black pt-5 pb-8">Вход</p>
          </div>
          <form onSubmit={(e) => handleLogin(e)} className='flex flex-col items-center justify-center'>
            <div className='pt-5 space-y-8 pb-8'>
              <input 
                name='identifier' 
                placeholder='Телефон или почта' 
                value={identifier} 
                onChange={(e) => setIdentifier(e.target.value)} 
                className='text-black py-3 w-72 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'
              />
              <div className="relative">
                <input 
                  name='password' 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder='Пароль' 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className='text-black py-3 w-72 px-2 font-semibold rounded-md h-14 transition bg-white z-10 placeholder:text-background'
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="text-black absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? 'Скрыть' : 'Показать'}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div id="smart-captcha" 
                   className="smart-captcha" 
                   data-sitekey="ysc1_AGejMw3jRC6GMmFeVOiuh6m6TOzrjjnBv6vCOq9p9a3b9cb5"
                   data-callback="yandexCaptchaCallback">
              </div>
            </div>

            <button type="submit" className="text-black bg-white rounded-3xl w-52 py-3">
              Войти
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Link href="/Reg" className="text-black text-xs mt-4 pb-4">Ещё нет аккаунта?</Link>
          </form>
        </div>
      </div>
    </main>
  )
}