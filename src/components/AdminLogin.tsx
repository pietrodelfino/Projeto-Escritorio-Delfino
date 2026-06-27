import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLogin({ onLoginSuccess, onCancel }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch {
      setError('Credenciais inválidas. Verifique o e-mail e a senha de acesso.');
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040A12]/95 backdrop-blur-md p-4">
      {/* Card */}
      <div className="w-full max-w-md bg-[#0B192C] border border-[#C5A880]/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-[#0D1F38] to-[#0B192C] border-b border-[#C5A880]/15 px-8 py-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-[#C5A880]" />
          </div>
          <h1 className="text-lg font-serif text-white font-semibold">Acesso Administrativo</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold mt-1">
            Eduardo Delfino Imóveis — Área Restrita
          </p>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
          {/* Error Alert */}
          {error && (
            <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-xs text-red-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1.5">
              E-mail Administrativo
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="delfinoimoveis2026@gmail.com"
                className={`w-full pl-9 pr-3 py-2.5 bg-gray-900/80 border rounded text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  error ? 'border-red-500/50 focus:border-red-400' : 'border-gray-700 focus:border-[#C5A880]'
                }`}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                className={`w-full pl-9 pr-10 py-2.5 bg-gray-900/80 border rounded text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  error ? 'border-red-500/50 focus:border-red-400' : 'border-gray-700 focus:border-[#C5A880]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-[#B3966E] disabled:bg-gray-700 disabled:cursor-not-allowed text-[#0B192C] font-bold text-xs uppercase tracking-widest py-3 rounded transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Autenticando...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Entrar no Painel
              </>
            )}
          </button>

          {/* Cancel link */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
            >
              ← Voltar ao Portal Público
            </button>
          </div>
        </form>

        {/* Security footer */}
        <div className="border-t border-gray-900 px-8 py-4 text-center">
          <p className="text-[9px] text-gray-600 uppercase tracking-wider">
            Acesso monitorado — LGPD em conformidade
          </p>
        </div>
      </div>
    </div>
  );
}
