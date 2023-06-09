import Input from '@/components/Input';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useRouter } from 'next/router';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [variant, setVariant] = useState('login');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === 'login' ? 'register' : 'login'
    );
  }, []);

  const login = useCallback(async () => {
    setIsLoading(true);
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    }).then((res) => {
      console.log('res', res);
      if (res?.ok) {
        router.push('/profiles');
      } else {
        setErrorMessage(res?.error || '');
        setIsLoading(false);
      }
    });
  }, [email, password]);

  const register = useCallback(async () => {
    setIsLoading(true);
    axios
      .post('/api/register', {
        email,
        name,
        password,
      })
      .then((res) => {
        console.log(res);
        login();
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setIsLoading(false);
        setErrorMessage(error.response.data.error);
      });
  }, [email, name, password, login]);

  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className='bg-black w-full h-full lg:bg-opacity-50 md:bg-opacity-50'>
        <nav className='px-12 py-5'>
          <img
            src='/images/logo.png'
            alt='logo'
            className='h-12'
          />
        </nav>
        <div className='flex justify-center'>
          <div className='bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full'>
            <h2 className='text-white text-4xl mb-8 font-semibold'>
              {variant === 'login' ? 'Sign In' : 'Register'}
            </h2>
            {errorMessage && (
              <div
                className='p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300'
                role='alert'
              >
                {errorMessage}
              </div>
            )}
            <div className='flex flex-col gap-4'>
              {variant === 'register' && (
                <Input
                  label='Username'
                  onChange={(ev: any) => {
                    setName(ev.target.value);
                  }}
                  id='name'
                  value={name}
                />
              )}
              <Input
                label='Email'
                onChange={(ev: any) => {
                  setEmail(ev.target.value);
                }}
                id='email'
                type='email'
                value={email}
              />
              <Input
                label='Password'
                onChange={(ev: any) => {
                  setPassword(ev.target.value);
                }}
                id='password'
                type='password'
                value={password}
              />
            </div>
            <button
              disabled={isLoading}
              onClick={variant === 'login' ? login : register}
              className='text-center bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition'
            >
              {isLoading ? (
                <div className='text-center'>
                  <div role='status'>
                    <svg
                      aria-hidden='true'
                      className='inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-white-600 fill-red-600'
                      viewBox='0 0 100 101'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                        fill='currentColor'
                      />
                      <path
                        d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                        fill='currentFill'
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <>{variant === 'login' ? 'Login' : 'Register'}</>
              )}
            </button>
            <div className='flex flex-row items-center gap-4 mt-8 justify-center '>
              <div
                onClick={() => signIn('google', { callbackUrl: '/profiles' })}
                className='w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition'
              >
                <FcGoogle size={30} />
              </div>
              <div
                onClick={() => signIn('github', { callbackUrl: '/profiles' })}
                className='w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition'
              >
                <FaGithub size={30} />
              </div>
            </div>
            <p className='text-neutral-500 mt-12'>
              {variant === 'login'
                ? 'First time using Netflix?'
                : 'Already have an account?'}

              <span
                onClick={toggleVariant}
                className='text-white ml-1 hover:underline cursor-pointer'
              >
                {variant === 'login' ? ' Create an account' : ' Login'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
