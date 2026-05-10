'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import { verifyEmailOTP, verifyTwoFactor } from "@/services/authService";
import { getDeviceName } from "@/utils/device";
import { useRouter, useSearchParams } from 'next/navigation';

export function TwoFactorForm({ email, onVerified }: { email: string; onVerified?: () => void }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const flow = searchParams.get('flow') || 'login';
  const next = searchParams.get('next') || '';

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Veuillez entrer les 6 chiffres');
      return;
    }

    setIsLoading(true);

    try {
      let data;

      if (flow === "login") {
        // 🔐 LOGIN FLOW
        let pendingLogin: {
          email: string;
          password: string;
          device_name?: string | null;
          trust_device?: boolean;
        } | null = null;

        if (typeof window !== "undefined") {
          const raw = sessionStorage.getItem("pending_login");
          pendingLogin = raw ? JSON.parse(raw) : null;
        }

        if (!pendingLogin || !pendingLogin.password) {
          throw new Error("Informations de connexion manquantes. Veuillez vous reconnecter.");
        }

        data = await verifyTwoFactor(
          pendingLogin.email,
          pendingLogin.password,
          fullCode,
          pendingLogin.device_name || getDeviceName(),
          true // ✅ IMPORTANT : on trust le device après 2FA
        );

        // Nettoyer après succès
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("pending_login");
        }

      } else {
        // 📝 REGISTER / ONBOARDING FLOW
        data = await verifyEmailOTP(email, fullCode);
      }

      // ✅ Sauvegarde des tokens
      if (data.access) {
        localStorage.setItem('access', data.access);
      }
      if (data.refresh) {
        localStorage.setItem('refresh', data.refresh);
      }

      // ✅ Redirection
      if (flow === 'onboarding') {
        router.push('/onboarding');
      } else if (next === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de vérification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className= "w-full max-w-md" >
    <Link 
      href={ flow === 'onboarding' ? '/register' : '/login' }
      className = "inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
      <ArrowLeft size={ 20 } />
      < span className = "text-sm font-medium" > { flow === 'onboarding' ? 'Back to register' : 'Back to login'} </span>
    </Link>

  < div className = "flex justify-center mb-6" >
    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center" >
      <Shield className="w-8 h-8 text-white" />
        </div>
        </div>

        < h1 className = "text-3xl font-semibold text-gray-900 text-center mb-2" >
          { flow === 'onboarding' ? 'Secure Your Account' : 'Two-Factor Authentication'}
</h1>
  < p className = "text-gray-500 text-center mb-8" >
    Enter the 6 - digit code sent to < br />
      <span className="text-gray-900 font-medium" > { email } </span>
        </p>

        < form onSubmit = { handleSubmit } className = "space-y-6" >
          <div className="flex gap-2 justify-center" >
          {
            code.map((digit, index) => (
              <input
              key= { index }
              id = {`code-${index}`}
type = "text"
inputMode = "numeric"
maxLength = { 1}
value = { digit }
onChange = {(e) => handleCodeChange(index, e.target.value)}
onKeyDown = {(e) => handleKeyDown(index, e)}
className = "w-12 h-14 text-center text-2xl font-semibold bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-gray-900 focus:outline-none transition-all"
  />
          ))}
</div>

{
  error && (
    <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg" >
      { error }
      </div>
        )
}

<button
          type="submit"
disabled = { isLoading || code.join('').length !== 6}
className = "w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
  >
  { isLoading? 'Verifying...': 'Verify' }
  </button>

  < p className = "text-center text-gray-600 text-sm" >
    Didn t receive the code ? { ' '}
      < Link 
            href = {`/${flow === 'onboarding' ? 'register' : 'login'}?email=${email}&flow=${flow}`}
type = "button"
className = "text-gray-900 font-medium underline underline-offset-4 hover:text-gray-700"
  >
  Resend
  </Link>
  </p>
  </form>
  </div>
  );
}
