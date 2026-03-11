'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ArrowRight, Instagram, Zap, BarChart3, Palette, Smartphone } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5 fill-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">BioPro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">Funcionalidades</Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">Preços</Link>
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Entrar</Link>
            <Button size="sm" asChild>
              <Link href="/register">Começar Grátis</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-wider mb-6">
                  O Link na Bio definitivo
                </span>
                <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.1]">
                  Transforme seu Instagram em uma <span className="text-slate-400">máquina de conversão</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                  Crie uma página de links profissional, elegante e personalizada em menos de 5 minutos. Perfeito para influenciadores, criadores e negócios.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="w-full sm:w-auto group">
                    Criar minha página grátis
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Ver exemplos
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Mockup Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-20 relative max-w-5xl mx-auto"
            >
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-50 p-4 md:p-8">
                <div className="flex gap-4">
                  {/* Dashboard Sidebar Mockup */}
                  <div className="hidden md:block w-48 space-y-4">
                    <div className="h-8 w-full bg-slate-200 rounded-md" />
                    <div className="h-4 w-3/4 bg-slate-200 rounded-md" />
                    <div className="h-4 w-1/2 bg-slate-200 rounded-md" />
                    <div className="h-4 w-2/3 bg-slate-200 rounded-md" />
                  </div>
                  {/* Main Editor Mockup */}
                  <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
                    <div className="h-6 w-32 bg-slate-100 rounded-md" />
                    <div className="space-y-3">
                      <div className="h-12 w-full bg-slate-50 border border-slate-100 rounded-xl" />
                      <div className="h-12 w-full bg-slate-50 border border-slate-100 rounded-xl" />
                      <div className="h-12 w-full bg-slate-50 border border-slate-100 rounded-xl" />
                    </div>
                  </div>
                  {/* Phone Preview Mockup */}
                  <div className="w-64 h-[400px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-800 rounded-b-2xl z-20" />
                    <div className="p-6 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-slate-700 rounded-full mb-4" />
                      <div className="h-4 w-24 bg-white/20 rounded-md mb-2" />
                      <div className="h-2 w-32 bg-white/10 rounded-md mb-8" />
                      <div className="w-full space-y-3">
                        <div className="h-10 w-full bg-white/10 rounded-full" />
                        <div className="h-10 w-full bg-white/10 rounded-full" />
                        <div className="h-10 w-full bg-white/10 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Tudo o que você precisa para crescer</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Funcionalidades pensadas para converter seguidores em clientes.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Palette, title: 'Personalização Total', desc: 'Mude cores, fontes, botões e fundos para combinar com sua marca.' },
                { icon: BarChart3, title: 'Analytics em Tempo Real', desc: 'Saiba exatamente quantos cliques cada link recebeu e de onde vêm seus acessos.' },
                { icon: Zap, title: 'Super Rápido', desc: 'Páginas otimizadas para carregar instantaneamente em qualquer dispositivo.' },
                { icon: Smartphone, title: 'Mobile First', desc: 'Experiência perfeita no celular, onde 99% do seu público está.' },
                { icon: Instagram, title: 'Foco em Conversão', desc: 'Layouts testados para aumentar o CTR dos seus links.' },
                { icon: Check, title: 'Domínio Próprio', desc: 'Use seu próprio domínio para passar ainda mais autoridade (Plano Premium).' },
              ].map((f, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
                    <f.icon className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Planos simples e transparentes</h2>
              <p className="text-slate-600">Escolha o plano ideal para o seu momento.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { name: 'Free', price: 'R$ 0', desc: 'Para quem está começando', features: ['Até 5 links', 'Temas básicos', 'Analytics básico', 'Marca BioPro visível'] },
                { name: 'Pro', price: 'R$ 19', desc: 'Para profissionais', features: ['Links ilimitados', 'Todos os temas', 'Analytics avançado', 'Remover marca BioPro', 'Imagens de fundo'], popular: true },
                { name: 'Premium', price: 'R$ 49', desc: 'Para negócios', features: ['Tudo do Pro', 'Domínio próprio', 'Pixel do Facebook', 'Suporte prioritário'] },
              ].map((p, i) => (
                <div key={i} className={cn(
                  "relative p-8 rounded-3xl border transition-all",
                  p.popular ? "border-slate-900 shadow-xl scale-105 z-10 bg-white" : "border-slate-200 bg-white"
                )}>
                  {p.popular && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full">
                      Mais Popular
                    </span>
                  )}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-display font-bold">{p.price}</span>
                      <span className="text-slate-500 text-sm">/mês</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-2">{p.desc}</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant={p.popular ? 'primary' : 'outline'} className="w-full">
                    Começar agora
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-12 mb-12">
            <div className="flex items-center gap-2">
              <Zap className="text-white w-6 h-6 fill-white" />
              <span className="font-display font-bold text-2xl tracking-tight">BioPro</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-400">
              <Link href="#" className="hover:text-white transition-colors">Termos</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
              <Link href="#" className="hover:text-white transition-colors">Contato</Link>
            </div>
          </div>
          <div className="text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} BioPro. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
