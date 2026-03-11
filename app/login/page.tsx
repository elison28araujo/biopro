'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Tentando login...');
      console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        throw new Error('As chaves do Supabase não foram configuradas corretamente no Vercel. Verifique as Variáveis de Ambiente e faça um Redeploy.');
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Erro do Supabase:', authError);
        throw authError;
      }

      console.log('Sucesso!', data);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Erro capturado:', err);
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">BioPro</span>
          </Link>
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
          <p className="text-slate-500 mt-2">Entre na sua conta para gerenciar seus links.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              <span className="text-slate-500">Não tem uma conta? </span>
              <Link href="/start" className="font-semibold text-slate-900 hover:underline">
                Criar conta grátis
              </Link>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <Link href="/register" className="text-xs text-slate-400 hover:text-slate-600">
                Registro avançado
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
