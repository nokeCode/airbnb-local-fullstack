'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';
import { Wallet } from 'lucide-react';
import { loginUser } from "@/services/authService";
import { getDeviceId, getDeviceName } from '@/utils/device';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (!navigator.onLine) {
      setError("Vous n'êtes pas connecté à Internet");
      return;
    }

    setIsLoading(true);

    try {

      const device_id = getDeviceId();
      const device_name = getDeviceName();

      const data = await loginUser(
        email,
        password,
        device_id,
        device_name,
        rememberDevice
      );

      if (data.requires_2fa) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "pending_login",
            JSON.stringify({
              email,
              password,
              device_name,
              trust_device: false
            })
          );
        }
        router.push(`/verify-2fa?email=${encodeURIComponent(email)}&flow=login`);
        return;
      }

      if (data.access) {
        localStorage.setItem("access", data.access);
      }
      if (data.refresh) {
        localStorage.setItem("refresh", data.refresh);
      }

      if (data.access) {
        router.push("/dashboard");
      }

    } catch (err: any) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div className= "w-full max-w-md" >
    {/* Toggle Login/Sign Up */ }
    < div className = "flex justify-center mb-8" >
      <div className="bg-white/50 rounded-full p-1 flex gap-1" >
        <button
            onClick={ () => setActiveTab('login') }
  className = {`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'login'
    ? 'bg-white text-gray-900 shadow-sm'
    : 'text-gray-600 hover:text-gray-900'
    }`
}
          >
  <span className="flex items-center gap-2" >
    <svg className="w-4 h-4" fill = "none" stroke = "currentColor" viewBox = "0 0 24 24" >
      <path strokeLinecap="round" strokeLinejoin = "round" strokeWidth = { 2} d = "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
Login
  </span>
  </button>
  < Link href = "/register" >
    <button onClick={ () => setActiveTab('signup') } className = {`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900' }`} >
      <span className="flex items-center gap-2" >
        <svg className="w-4 h-4" fill = "none" stroke = "currentColor" viewBox = "0 0 24 24" >
          <path strokeLinecap="round" strokeLinejoin = "round" strokeWidth = { 2} d = "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
                    Sign Up
      </span>
    </button>
  </Link>
  </div>
  </div>

{/* Titre */ }
<h1 className="text-3xl font-semibold text-gray-900 text-center mb-2" >
  Welcome!
  </h1>
  < p className = "text-gray-500 text-center mb-8" >
    Please enter your details to login.
      </p>

{
  error && (
    <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg mb-4" >
      { error }
      </div>
      )
}

<form onSubmit={ handleSubmit } className = "space-y-5" >
  {/* Email */ }
  < div >
  <label className="block text-sm font-medium text-gray-700 mb-1.5" >
    Email address
      </label>
      < input
type = "email"
placeholder = "Enter your email address"
value = { email }
onChange = {(e) => setEmail(e.target.value)}
className = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
  />
  </div>

{/* Password */ }
<div>
  <div className="flex justify-between items-center mb-1.5" >
    <label className="block text-sm font-medium text-gray-700" >
      Password
      </label>
      < Link href = "#" className = "text-sm text-gray-900 hover:underline" >
        Forgot password ?
          </Link>
          </div>
          < div className = "relative" >
            <input
              type={ showPassword ? 'text' : 'password' }
placeholder = "Enter your password"
value = { password }
onChange = {(e) => setPassword(e.target.value)}
className = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all pr-10"
  />
  <button
              type="button"
onClick = {() => setShowPassword(!showPassword)}
className = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
  >
  { showPassword?<EyeOff size = { 18 } /> : <Eye size={ 18 } />}
</button>
  </div>
  </div>

  < div className = "flex items-center gap-2" >
    <input
    type="checkbox"
checked = { rememberDevice }
onChange = {(e) => setRememberDevice(e.target.checked)}
  />
  < label className = "text-sm text-gray-600" >
    Se souvenir de cet appareil
      </label>
      </div>

{/* Submit Button */ }
<button type="submit" disabled = { isLoading } className = "w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50" >
  { isLoading? 'Logging in...': 'Log In' }
  </button>

{/* Divider */ }
<div className="relative my-6" >
  <div className="absolute inset-0 flex items-center" >
    <div className="w-full border-t border-gray-300" > </div>
      </div>
      < div className = "relative flex justify-center text-sm" >
        <span className="px-2 bg-[#F5F1EB] text-gray-500" > OR </span>
          </div>
          </div>

{/* Social Buttons */ }
<div className="space-y-3" >
  <button
            type="button"
className = "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all text-gray-700 font-medium"
  >
  <FcGoogle size={ 20 } />
            Continue with Google
</button>

< button
            type = "button"
className = "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all text-gray-700 font-medium"
  >
  <FaApple size={ 20 } className = "text-black" />
    Continue with Apple
    </button>

    < button
            type = "button"
className = "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all text-gray-700 font-medium"
  >
  <SiBinance size={ 20 } className = "text-yellow-500" />
    Continue with Binance
    </button>

    < button
            type = "button"
className = "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all text-gray-700 font-medium"
  >
  <Wallet size={ 20 } className = "text-gray-600" />
    Continue with Wallet
    </button>
    </div>

        {/* Sign up link */ }
<p className="text-center text-gray-600 text-sm mt-6" >
  Don t have an account yet ? { ' '}
    < Link href = "/register" className = "text-gray-900 font-medium underline underline-offset-4 hover:text-gray-700" >
      Sign up
        </Link>
        </p>
        </form>
        </div>
  );
}

