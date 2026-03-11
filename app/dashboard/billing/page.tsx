'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, Zap, Crown, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 'R$ 0',
    description: 'Para quem está começando',
    features: ['Até 5 links', 'Temas básicos', 'Analytics básico', 'Marca BioPro visível'],
    icon: Zap,
    color: 'text-slate-600'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 19',
    description: 'Para profissionais e criadores',
    features: ['Links ilimitados', 'Todos os temas', 'Analytics avançado', 'Remover marca BioPro', 'Imagens de fundo'],
    icon: Crown,
    color: 'text-violet-600',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 49',
    description: 'Para negócios e agências',
    features: ['Tudo do Pro', 'Domínio próprio', 'Pixel do Facebook', 'Suporte prioritário'],
    icon: ShieldCheck,
    color: 'text-emerald-600'
  }
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('subscriptions')
        .select('plan_id')
        .eq('user_id', user.id)
        .single();

      if (data) setCurrentPlan(data.plan_id);
      setIsLoading(false);
    }

    loadSubscription();
  }, []);

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlan) return;
    
    // In a real app, redirect to Stripe Checkout
    alert('Redirecionando para o Stripe Checkout...');
    
    // Mock update for demo
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('subscriptions').update({ plan_id: planId }).eq('user_id', user.id);
      setCurrentPlan(planId);
    }
  };

  if (isLoading) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-bold">Assinatura e Faturamento</h1>
        <p className="text-slate-500 text-sm">Gerencie seu plano e pagamentos.</p>
      </header>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
            Plano Atual
          </span>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-4xl font-display font-bold capitalize">{currentPlan}</h2>
            <div className="h-8 w-[1px] bg-white/20" />
            <p className="text-slate-400 text-sm max-w-[200px]">
              {currentPlan === 'free' ? 'Você está usando a versão gratuita.' : 'Você é um membro premium!'}
            </p>
          </div>
          {currentPlan === 'free' && (
            <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
              Fazer Upgrade agora
            </Button>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 blur-[100px] rounded-full -mr-32 -mt-32" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={cn(
              "p-8 rounded-3xl border transition-all bg-white flex flex-col",
              plan.id === currentPlan ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2" : "border-slate-100"
            )}
          >
            <div className="mb-8">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-slate-50", plan.color)}>
                <plan.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-display font-bold">{plan.price}</span>
                <span className="text-slate-500 text-sm">/mês</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {f}
                </li>
              ))}
            </ul>

            <Button 
              variant={plan.id === currentPlan ? 'outline' : 'primary'} 
              className="w-full"
              disabled={plan.id === currentPlan}
              onClick={() => handleUpgrade(plan.id)}
            >
              {plan.id === currentPlan ? 'Plano Atual' : 'Escolher Plano'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
