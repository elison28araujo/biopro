import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Profile, Link as LinkType, UserSettings } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface PublicPageProps {
  params: Promise<{ username: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  const { username } = await params;
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio')
    .eq('username', username)
    .single();

  if (!profile) return { title: 'Página não encontrada' };

  return {
    title: profile.full_name || `@${username}`,
    description: profile.bio || `Confira os links de @${username} no BioPro.`,
    openGraph: {
      title: profile.full_name || `@${username}`,
      description: profile.bio || `Confira os links de @${username} no BioPro.`,
      type: 'website',
    }
  };
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { username } = await params;

  // 1. Load Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) notFound();

  // 2. Load Links and Settings
  const [linksRes, settingsRes] = await Promise.all([
    supabase.from('links').select('*').eq('user_id', profile.id).eq('is_active', true).order('sort_order', { ascending: true }),
    supabase.from('user_settings').select('*').eq('user_id', profile.id).single(),
  ]);

  const links = linksRes.data || [];
  const settings = settingsRes.data as UserSettings;

  // 3. Record Page View (Server Side)
  // In a real app, we'd use an edge function or a separate API route to avoid blocking the render
  // For this demo, we'll just insert it
  await supabase.from('page_views').insert({
    user_id: profile.id,
  });

  return (
    <div 
      className="min-h-screen flex flex-col items-center py-16 px-6"
      style={{ 
        backgroundColor: settings.background_type === 'color' ? settings.background_value : undefined,
        backgroundImage: settings.background_type === 'gradient' ? settings.background_value : undefined,
      }}
    >
      <div className="w-full max-w-xl flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="mb-6">
          {profile.avatar_url ? (
            <div className="relative w-24 h-24">
              <Image 
                src={profile.avatar_url} 
                alt={profile.full_name || ''} 
                fill
                className="rounded-full object-cover border-4 border-white shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-3xl font-bold">
              {profile.username[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <h1 className="text-2xl font-bold mb-2" style={{ color: settings.theme_id.includes('dark') ? '#fff' : '#000' }}>
          {profile.full_name || `@${profile.username}`}
        </h1>
        {profile.bio && (
          <p className="text-base mb-10 opacity-80" style={{ color: settings.theme_id.includes('dark') ? '#ccc' : '#444' }}>
            {profile.bio}
          </p>
        )}

        {/* Links */}
        <div className="w-full space-y-4">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} settings={settings} />
          ))}
        </div>

        {/* Branding */}
        {settings.show_branding && (
          <Link 
            href="/" 
            className="mt-16 flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity"
            style={{ color: settings.theme_id.includes('dark') ? '#fff' : '#000' }}
          >
            <span className="text-xs font-bold uppercase tracking-widest">Criado com BioPro</span>
          </Link>
        )}
      </div>
    </div>
  );
}

// Client component for click tracking
import { LinkCard } from '@/components/public/link-card';
