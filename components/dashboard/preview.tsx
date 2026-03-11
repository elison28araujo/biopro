'use client';

import React from 'react';
import Image from 'next/image';
import { Profile, Link as LinkType, UserSettings } from '@/types';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface PreviewProps {
  profile: Profile | null;
  links: LinkType[];
  settings: UserSettings | null;
}

export function PublicPagePreview({ profile, links, settings }: PreviewProps) {
  if (!profile || !settings) return null;

  const activeLinks = links.filter(l => l.is_active).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="w-full max-w-[320px] aspect-[9/19] bg-white rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden relative flex flex-col">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-2xl z-20" />
      
      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto pt-12 pb-8 px-6 text-center no-scrollbar"
        style={{ 
          backgroundColor: settings.background_type === 'color' ? settings.background_value : undefined,
          backgroundImage: settings.background_type === 'gradient' ? settings.background_value : undefined,
        }}
      >
        {/* Avatar */}
        <div className="mb-4 flex justify-center">
          {profile.avatar_url ? (
            <div className="relative w-20 h-20">
              <Image 
                src={profile.avatar_url} 
                alt={profile.full_name || ''} 
                fill
                className="rounded-full object-cover border-2 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-2xl font-bold">
              {profile.username[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <h2 className="font-bold text-lg mb-1" style={{ color: settings.theme_id.includes('dark') ? '#fff' : '#000' }}>
          {profile.full_name || `@${profile.username}`}
        </h2>
        {profile.bio && (
          <p className="text-sm mb-8 opacity-80" style={{ color: settings.theme_id.includes('dark') ? '#ccc' : '#666' }}>
            {profile.bio}
          </p>
        )}

        {/* Links */}
        <div className="space-y-3">
          {activeLinks.map((link) => (
            <div
              key={link.id}
              className={cn(
                'w-full py-3 px-4 flex items-center justify-center relative transition-transform hover:scale-[1.02] cursor-pointer',
                settings.button_style,
                settings.button_variant === 'solid' && 'shadow-sm'
              )}
              style={{
                backgroundColor: settings.button_variant === 'solid' ? settings.primary_color : 'transparent',
                borderColor: settings.primary_color,
                borderWidth: settings.button_variant === 'outline' ? '2px' : '0px',
                color: settings.button_variant === 'solid' ? '#fff' : settings.primary_color,
              }}
            >
              <span className="text-sm font-semibold">{link.title}</span>
              <ExternalLink className="w-3 h-3 absolute right-4 opacity-50" />
            </div>
          ))}
        </div>

        {/* Branding */}
        {settings.show_branding && (
          <div className="mt-12 flex items-center justify-center gap-1 opacity-40">
            <span className="text-[10px] font-bold uppercase tracking-widest">BioPro</span>
          </div>
        )}
      </div>
    </div>
  );
}
