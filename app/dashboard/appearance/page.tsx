'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Palette, Type, Square, Circle, Layout } from 'lucide-react';

const themes = [
  { id: 'clean-light', name: 'Clean Light', bg: '#F9FAFB', text: '#000', primary: '#000' },
  { id: 'dark-premium', name: 'Dark Premium', bg: '#0F172A', text: '#fff', primary: '#38BDF8' },
  { id: 'neon-creator', name: 'Neon Creator', bg: '#000', text: '#fff', primary: '#00FF00' },
  { id: 'soft-pastel', name: 'Soft Pastel', bg: '#FFF1F2', text: '#881337', primary: '#FB7185' },
  { id: 'business-minimal', name: 'Business', bg: '#FFFFFF', text: '#1E293B', primary: '#2563EB' },
];

const buttonStyles = [
  { id: 'rounded-none', name: 'Quadrado', icon: Square },
  { id: 'rounded-md', name: 'Arredondado', icon: Layout },
  { id: 'rounded-full', name: 'Pílula', icon: Circle },
];

export default function AppearancePage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setSettings(data);
      setIsLoading(false);
    };

    loadSettings();
  }, []);

  async function updateSettings(updates: Partial<UserSettings>) {
    if (!settings) return;
    setIsSaving(true);

    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    const { error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', settings.user_id);

    if (error) {
      console.error('Error updating settings:', error);
    }
    setIsSaving(false);
  }

  if (isLoading || !settings) return null;

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Aparência</h1>
        <p className="text-slate-500 text-sm">Personalize o visual da sua página pública.</p>
      </header>

      <div className="space-y-10">
        {/* Themes */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-slate-400" />
            <h2 className="font-bold">Temas Pré-definidos</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => updateSettings({ 
                  theme_id: theme.id, 
                  background_value: theme.bg,
                  primary_color: theme.primary
                })}
                className={cn(
                  "relative p-4 rounded-2xl border-2 transition-all text-left group overflow-hidden",
                  settings.theme_id === theme.id ? "border-slate-900" : "border-slate-100 hover:border-slate-200"
                )}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.bg }} />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }} />
                  </div>
                  <span className="text-xs font-bold">{theme.name}</span>
                </div>
                {settings.theme_id === theme.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-slate-900" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Custom Colors */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full border-2 border-slate-400" />
            <h2 className="font-bold">Cores Customizadas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Cor Principal (Botões)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={settings.primary_color}
                  onChange={(e) => updateSettings({ primary_color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                />
                <span className="text-sm font-mono text-slate-600 uppercase">{settings.primary_color}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Cor de Fundo</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={settings.background_value}
                  onChange={(e) => updateSettings({ background_value: e.target.value, background_type: 'color' })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                />
                <span className="text-sm font-mono text-slate-600 uppercase">{settings.background_value}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Button Styles */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Circle className="w-5 h-5 text-slate-400" />
            <h2 className="font-bold">Estilo dos Botões</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {buttonStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => updateSettings({ button_style: style.id as any })}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all bg-white",
                  settings.button_style === style.id ? "border-slate-900" : "border-slate-100 hover:border-slate-200"
                )}
              >
                <style.icon className="w-6 h-6 text-slate-600" />
                <span className="text-xs font-bold">{style.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Branding */}
        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-bold">Remover Marca BioPro</h3>
            <p className="text-xs text-slate-500">Disponível apenas nos planos Pro e Premium.</p>
          </div>
          <button 
            onClick={() => updateSettings({ show_branding: !settings.show_branding })}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              settings.show_branding ? "bg-slate-200" : "bg-emerald-500"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
              settings.show_branding ? "left-1" : "left-7"
            )} />
          </button>
        </section>
      </div>
    </div>
  );
}
