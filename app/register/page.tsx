'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Check if username is already taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single();

      if (existingUser) {
        throw new Error('Este nome de usuário já está em uso.');
      }

      // 2. Sign up user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // 3. Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        username: username.toLowerCase(),
        full_name: username,
      });

      if (profileError) throw profileError;

      // 4. Create default settings
      await supabase.from('user_settings').insert({
        user_id: authData.user.id,
      });

      // 5. Create free subscription
      await supabase.from('subscriptions').insert({
        user_id: authData.user.id,
        plan_id: 'free',
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
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
          <h1 className="text-2xl font-bold">Crie sua conta grátis</h1>
          <p className="text-slate-500 mt-2">Comece a transformar seu Instagram hoje.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <Input
                label="Nome de usuário"
                placeholder="seunome"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                required
                className="pl-24"
              />
              <span className="absolute left-3 bottom-3 text-slate-400 text-sm font-medium">biopro.com/</span>
            </div>
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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Criar minha conta
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">Já tem uma conta? </span>
            <Link href="/login" className="font-semibold text-slate-900 hover:underline">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
