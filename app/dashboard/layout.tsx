'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { supabase } from '@/lib/supabase';
import { Profile, Link as LinkType, UserSettings } from '@/types';
import { PublicPagePreview } from '@/components/dashboard/preview';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      const [profileRes, linksRes, settingsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('links').select('*').eq('user_id', user.id).order('sort_order', { ascending: true }),
        supabase.from('user_settings').select('*').eq('user_id', user.id).single(),
      ]);

      setProfile(profileRes.data);
      setLinks(linksRes.data || []);
      setSettings(settingsRes.data);
      setIsLoading(false);
    }

    loadData();

    // Real-time subscriptions
    const linksSub = supabase
      .channel('links_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'links' }, () => {
        loadData();
      })
      .subscribe();

    const settingsSub = supabase
      .channel('settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_settings' }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(linksSub);
      supabase.removeChannel(settingsSub);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex">
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
        
        {/* Real-time Preview Sidebar */}
        <div className="w-[400px] border-l border-slate-100 bg-white p-8 hidden xl:flex flex-col items-center justify-center sticky top-0 h-screen">
          <div className="text-center mb-8">
            <h3 className="font-bold text-slate-900">Preview em tempo real</h3>
            <p className="text-xs text-slate-500">Veja como sua página está ficando</p>
          </div>
          <PublicPagePreview profile={profile} links={links} settings={settings} />
          <div className="mt-8">
            <a 
              href={`/${profile?.username}`} 
              target="_blank" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 underline"
            >
              biopro.com/{profile?.username}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
