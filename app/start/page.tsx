'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'motion/react';
import { Rocket, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EasyStartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    username: '',
    email: 'elison28araujo@gmail.com',
    password: '02770277',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Sign Up in Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // 2. Create Profile Manually (Bypassing triggers)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username: formData.username.toLowerCase(),
            full_name: formData.username,
            is_admin: formData.email === 'elison28araujo@gmail.com'
          }
        ]);

      if (profileError) {
        console.warn('Erro ao criar perfil, mas a conta foi criada:', profileError);
      }

      // 3. Create Settings Manually
      await supabase
        .from('user_settings')
        .insert([{ user_id: authData.user.id }]);

      setStep(2);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err: any) {
      console.error('Erro no registro:', err);
      setError(err.message || 'Ocorreu um erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center">
            <Rocket className="text-white w-8 h-8" />
          </div>
        </div>

        {step === 1 ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Começar agora</h1>
              <p className="text-slate-500 mt-2">Crie sua conta de forma simplificada</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Como quer ser chamado? (Username)"
                placeholder="ex: elison_araujo"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              
              <Input
                label="Seu E-mail"
                type="email"
                disabled
                value={formData.email}
              />

              <Input
                label="Sua Senha"
                type="text"
                disabled
                value={formData.password}
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-base"
                isLoading={isLoading}
              >
                Criar minha conta agora
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex justify-center mb-4"
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900">Conta criada!</h2>
            <p className="text-slate-500 mt-2">Estamos te levando para o painel...</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-top border-slate-100 text-center">
          <button 
            onClick={() => router.push('/login')}
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            Já tem conta? Entrar por aqui
          </button>
        </div>
      </motion.div>
    </div>
  );
}
