'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile, Subscription } from '@/types';
import { Users, CreditCard, Layout, BarChart3, Search, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalPages: 0,
    revenue: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadAdminData = async () => {
    const [usersRes, subsRes, profilesRes] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact' }),
      supabase.from('subscriptions').select('*').neq('plan_id', 'free'),
      supabase.from('profiles').select('id, username, full_name, created_at').order('created_at', { ascending: false }).limit(10)
    ]);

    setStats({
      totalUsers: usersRes.count || 0,
      activeSubscriptions: subsRes.data?.length || 0,
      totalPages: usersRes.count || 0,
      revenue: (subsRes.data?.length || 0) * 19 // Simple mock calculation
    });

    setUsers(profilesRes.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (profile?.is_admin) {
          setIsAdmin(true);
          await loadAdminData();
        } else {
          setIsAdmin(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsLoading(false);
      }
    }

    checkAdmin();
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p className="text-slate-500 mt-2">Você não tem permissão para acessar esta área.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Voltar para o Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Painel Admin</h1>
          <p className="text-slate-500 mt-1">Visão geral da plataforma BioPro.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar usuário..." className="pl-10 w-64" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <AdminStatCard icon={Users} label="Total Usuários" value={stats.totalUsers} />
        <AdminStatCard icon={CreditCard} label="Assinantes Pagos" value={stats.activeSubscriptions} />
        <AdminStatCard icon={Layout} label="Páginas Criadas" value={stats.totalPages} />
        <AdminStatCard icon={BarChart3} label="Receita Estimada" value={`R$ ${stats.revenue}`} />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold">Últimos Usuários</h2>
          <Button variant="ghost" size="sm">Ver todos</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Data Cadastro</th>
                <th className="px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{user.full_name || 'Sem nome'}</td>
                  <td className="px-6 py-4 text-slate-500">@{user.username}</td>
                  <td className="px-6 py-4 text-slate-500">{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm">Gerenciar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-display font-bold mt-1">{value}</p>
    </div>
  );
}
