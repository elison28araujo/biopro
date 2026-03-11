'use client';

import React from 'react';
import { Link as LinkType, UserSettings } from '@/types';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LinkCardProps {
  link: LinkType;
  settings: UserSettings;
}

export function LinkCard({ link, settings }: LinkCardProps) {
  const handleClick = async () => {
    // Record click
    await supabase.from('link_clicks').insert({
      link_id: link.id,
      user_id: link.user_id,
    });
    
    // Open URL
    window.open(link.url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full py-4 px-6 flex items-center justify-center relative transition-all hover:scale-[1.02] active:scale-[0.98]',
        settings.button_style,
        settings.button_variant === 'solid' && 'shadow-md',
        link.is_highlighted && 'ring-2 ring-offset-2 ring-slate-900 animate-pulse'
      )}
      style={{
        backgroundColor: settings.button_variant === 'solid' ? settings.primary_color : 'transparent',
        borderColor: settings.primary_color,
        borderWidth: settings.button_variant === 'outline' ? '2px' : '0px',
        color: settings.button_variant === 'solid' ? '#fff' : settings.primary_color,
      }}
    >
      <span className="text-lg font-bold tracking-tight">{link.title}</span>
      <ExternalLink className="w-4 h-4 absolute right-6 opacity-40" />
    </button>
  );
}
