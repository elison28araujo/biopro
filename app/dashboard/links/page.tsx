'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Link as LinkType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, GripVertical, ExternalLink, ToggleLeft, ToggleRight, Star, Link as LinkIcon } from 'lucide-react';
import { motion, Reorder } from 'motion/react';

export default function LinksPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  const loadLinks = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true });

    return data || [];
  }, []);

  useEffect(() => {
    loadLinks().then(data => {
      setLinks(data);
      setIsLoading(false);
    });
  }, [loadLinks]);

  const refreshLinks = useCallback(async () => {
    const data = await loadLinks();
    setLinks(data);
  }, [loadLinks]);

  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('links').insert({
      user_id: user.id,
      title: newLink.title,
      url: newLink.url,
      sort_order: links.length,
    });

    if (!error) {
      setNewLink({ title: '', url: '' });
      setIsAdding(false);
      refreshLinks();
    }
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('links').update({ is_active: !current }).eq('id', id);
    refreshLinks();
  }

  async function toggleHighlight(id: string, current: boolean) {
    await supabase.from('links').update({ is_highlighted: !current }).eq('id', id);
    refreshLinks();
  }

  async function deleteLink(id: string) {
    if (confirm('Tem certeza que deseja excluir este link?')) {
      await supabase.from('links').delete().eq('id', id);
      refreshLinks();
    }
  }

  async function handleReorder(newOrder: LinkType[]) {
    setLinks(newOrder);
    // Update sort_order in background
    const updates = newOrder.map((link, index) => ({
      id: link.id,
      sort_order: index,
    }));
    
    // In a real app, you'd use a single RPC or bulk update
    for (const update of updates) {
      await supabase.from('links').update({ sort_order: update.sort_order }).eq('id', update.id);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Meus Links</h1>
          <p className="text-slate-500 text-sm">Adicione, edite e organize seus links.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Link
        </Button>
      </header>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8"
        >
          <form onSubmit={handleAddLink} className="space-y-4">
            <Input 
              label="Título do Link" 
              placeholder="Ex: Meu WhatsApp" 
              value={newLink.title}
              onChange={e => setNewLink({ ...newLink, title: e.target.value })}
              required
            />
            <Input 
              label="URL" 
              placeholder="https://wa.me/..." 
              value={newLink.url}
              onChange={e => setNewLink({ ...newLink, url: e.target.value })}
              required
            />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
              <Button type="submit">Salvar Link</Button>
            </div>
          </form>
        </motion.div>
      )}

      <Reorder.Group axis="y" values={links} onReorder={handleReorder} className="space-y-4">
        {links.map((link) => (
          <Reorder.Item 
            key={link.id} 
            value={link}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group"
          >
            <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
              <GripVertical className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 truncate">{link.title}</h3>
                {link.is_highlighted && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
              </div>
              <p className="text-xs text-slate-400 truncate">{link.url}</p>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => toggleHighlight(link.id, link.is_highlighted)}
                className={cn("p-2 rounded-lg transition-colors", link.is_highlighted ? "text-amber-500 bg-amber-50" : "text-slate-400 hover:bg-slate-50")}
                title="Destacar link"
              >
                <Star className="w-4 h-4" />
              </button>
              <button 
                onClick={() => toggleActive(link.id, link.is_active)}
                className={cn("p-2 rounded-lg transition-colors", link.is_active ? "text-emerald-500" : "text-slate-300")}
                title={link.is_active ? "Desativar" : "Ativar"}
              >
                {link.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
              <button 
                onClick={() => deleteLink(link.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {links.length === 0 && !isLoading && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <LinkIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="font-bold text-slate-900">Nenhum link ainda</h3>
          <p className="text-slate-500 text-sm mt-1">Comece adicionando seu primeiro link acima.</p>
        </div>
      )}
    </div>
  );
}

import { cn } from '@/lib/utils';
