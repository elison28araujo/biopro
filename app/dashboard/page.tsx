'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Palette, Zap, BarChart3, Link as LinkIcon, Eye, MousePointer2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    views: 0,
    clicks: 0,
    links: 0,
    ctr: 0
  });

  useEffect(() => {
    async function loadStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [viewsRes, clicksRes, linksRes] = await Promise.all([
        supabase.from('page_views').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('link_clicks').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('links').select('id', { count: 'exact' }).eq('user_id', user.id),
      ]);

      const views = viewsRes.count || 0;
      const clicks = clicksRes.count || 0;
      const links = linksRes.count || 0;
      const ctr = views > 0 ? (clicks / views) * 100 : 0;

      setStats({ views, clicks, links, ctr });
    }

    loadStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-display font-bold">Olá! 👋</h1>
        <p className="text-slate-500 mt-1">Aqui está o resumo da sua performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={Eye} 
          label="Visualizações" 
          value={stats.views.toString()} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          icon={MousePointer2} 
          label="Cliques Totais" 
          value={stats.clicks.toString()} 
          color="bg-emerald-50 text-emerald-600" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="CTR Médio" 
          value={`${stats.ctr.toFixed(1)}%`} 
          color="bg-violet-50 text-violet-600" 
        />
        <StatCard 
          icon={LinkIcon} 
          label="Links Ativos" 
          value={stats.links.toString()} 
          color="bg-orange-50 text-orange-600" 
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Dicas para crescer</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                <Palette className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Personalize seu tema</h4>
                <p className="text-xs text-slate-500 mt-1">Cores que combinam com sua marca aumentam a confiança do seguidor.</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                <Zap className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Use links em destaque</h4>
                <p className="text-xs text-slate-500 mt-1">Destaque seu produto principal para chamar mais atenção.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-display font-bold mt-1">{value}</p>
    </div>
  );
}

