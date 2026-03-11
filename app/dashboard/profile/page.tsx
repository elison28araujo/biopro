'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    avatar_url: ''
  });

  const loadProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return data;
  }, []);

  useEffect(() => {
    loadProfile().then(data => {
      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        });
      }
      setIsLoading(false);
    });

    // Get current email
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setNewEmail(user.email);
    });
  }, [loadProfile]);

  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault();
    setIsUpdatingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      alert('Erro ao atualizar e-mail: ' + error.message);
    } else {
      alert('Um link de confirmação foi enviado para o novo e-mail.');
    }
    setIsUpdatingEmail(false);
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      alert('Erro ao atualizar senha: ' + error.message);
    } else {
      alert('Senha atualizada com sucesso!');
      setNewPassword('');
    }
    setIsUpdatingPassword(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        bio: formData.bio,
        avatar_url: formData.avatar_url
      })
      .eq('id', profile.id);

    if (!error) {
      alert('Perfil atualizado com sucesso!');
    }
    setIsSaving(false);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setIsSaving(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      setIsSaving(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);

    setFormData({ ...formData, avatar_url: publicUrl });
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
    setIsSaving(false);
  }

  if (isLoading) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-slate-500 text-sm">Atualize suas informações públicas.</p>
      </header>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-sm relative">
                {formData.avatar_url ? (
                  <Image 
                    src={formData.avatar_url} 
                    alt="Avatar" 
                    fill 
                    className="object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Camera className="w-10 h-10" />
                  </div>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>
            <p className="text-xs text-slate-400">Recomendado: 400x400px. Máximo 2MB.</p>
          </div>

          <div className="space-y-4">
            <Input 
              label="Nome Completo" 
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Seu nome ou nome do seu negócio"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Bio</label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Conte um pouco sobre você ou seu negócio..."
                maxLength={160}
              />
              <p className="text-[10px] text-right text-slate-400">{formData.bio.length}/160</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isSaving} className="px-10">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-12">
        <header className="mb-8">
          <h2 className="text-2xl font-bold">Segurança</h2>
          <p className="text-slate-500 text-sm">Gerencie seu acesso à conta.</p>
        </header>

        <div className="space-y-6">
          {/* Email Update */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <h3 className="font-bold text-lg">Alterar E-mail</h3>
              <Input 
                label="Novo E-mail" 
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="seu-novo@email.com"
                required
              />
              <div className="flex justify-end">
                <Button type="submit" isLoading={isUpdatingEmail} variant="outline">
                  Atualizar E-mail
                </Button>
              </div>
            </form>
          </div>

          {/* Password Update */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <h3 className="font-bold text-lg">Alterar Senha</h3>
              <Input 
                label="Nova Senha" 
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <div className="flex justify-end">
                <Button type="submit" isLoading={isUpdatingPassword} variant="outline">
                  Atualizar Senha
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
