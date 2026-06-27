import { useState } from 'react';
import type { Property } from '../types/property';
import PropertyForm from './PropertyForm';
import { deleteProperty } from '../services/firebase';
import {
  Plus, Pencil, Trash2, LogOut, Building2, Home, Trees,
  ShieldCheck, Maximize2, AlertTriangle, Loader2
} from 'lucide-react';

interface AdminDashboardProps {
  properties: Property[];
  onLogout: () => void;
  onRefresh: () => void;
}

export default function AdminDashboard({ properties, onLogout, onRefresh }: AdminDashboardProps) {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleNewProperty = () => {
    setEditingProperty(null);
    setView('form');
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setView('form');
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteProperty(id);
    setDeletingId(null);
    setDeleteConfirmId(null);
    onRefresh();
  };

  const handleFormSuccess = () => {
    setView('list');
    setEditingProperty(null);
    onRefresh();
  };

  const categoryIcon = (cat: Property['category']) => {
    if (cat === 'corporativo') return <Building2 className="w-3.5 h-3.5" />;
    if (cat === 'rural') return <Trees className="w-3.5 h-3.5" />;
    return <Home className="w-3.5 h-3.5" />;
  };

  const categoryLabel = (cat: Property['category']) => {
    if (cat === 'corporativo') return 'Corporativo';
    if (cat === 'rural') return 'Rural';
    return 'Residencial';
  };

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);

  // ── Form View ────────────────────────────────────────────────
  if (view === 'form') {
    return (
      <PropertyForm
        initialData={editingProperty}
        onSuccess={handleFormSuccess}
        onCancel={() => setView('list')}
      />
    );
  }

  // ── List View ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#040A12] text-white">
      {/* Admin Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0B192C]/95 backdrop-blur-md border-b border-[#C5A880]/15 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white leading-tight">Painel Administrativo</span>
            <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-bold">Eduardo Delfino Imóveis</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNewProperty}
            className="inline-flex items-center gap-1.5 bg-[#C5A880] hover:bg-[#B3966E] text-[#0B192C] font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Imóvel
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 text-[11px] font-medium px-3 py-2 rounded transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total de Imóveis', value: properties.length, icon: <Maximize2 className="w-4 h-4" /> },
            { label: 'Corporativos', value: properties.filter(p => p.category === 'corporativo').length, icon: <Building2 className="w-4 h-4" /> },
            { label: 'Residenciais', value: properties.filter(p => p.category === 'residencial').length, icon: <Home className="w-4 h-4" /> },
            { label: 'Rurais', value: properties.filter(p => p.category === 'rural').length, icon: <Trees className="w-4 h-4" /> },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#0B192C] border border-[#C5A880]/10 rounded-lg p-4 flex items-center gap-3">
              <div className="text-[#C5A880]/60">{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-serif text-white font-normal">
            Portfólio Cadastrado <span className="text-[#C5A880]">({properties.length})</span>
          </h2>
          <button
            onClick={handleNewProperty}
            className="inline-flex items-center gap-1.5 bg-[#C5A880]/10 hover:bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/25 font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Cadastrar Novo Imóvel
          </button>
        </div>

        {/* Properties Table */}
        {properties.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl">
            <Building2 className="w-10 h-10 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-sm font-semibold">Nenhum imóvel cadastrado.</p>
            <p className="text-gray-600 text-xs mt-1">Clique em "Cadastrar Novo Imóvel" para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map(property => (
              <div
                key={property.id}
                className="group bg-[#0B192C] border border-[#C5A880]/10 hover:border-[#C5A880]/25 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-20 h-20 sm:h-14 rounded overflow-hidden bg-gray-900 flex-shrink-0">
                  <img
                    src={property.photos[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-[#C5A880]/70">
                      {categoryIcon(property.category)}
                      {categoryLabel(property.category)}
                    </span>
                    <span className="text-gray-700">•</span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wide font-medium">{property.type}</span>
                    {property.complianceVerified && (
                      <span className="inline-flex items-center gap-0.5 text-[8px] text-[#C5A880] font-bold uppercase">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Auditado
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-white truncate">{property.title}</h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{property.location}</p>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-sm font-bold text-[#C5A880]">{formatPrice(property.price)}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{property.area} m²</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {deleteConfirmId === property.id ? (
                    // Inline delete confirmation
                    <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 rounded px-3 py-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span className="text-[10px] text-red-300 font-medium">Confirmar exclusão?</span>
                      <button
                        onClick={() => handleDelete(property.id)}
                        disabled={deletingId === property.id}
                        className="text-[10px] font-bold text-red-400 hover:text-red-300 cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        {deletingId === property.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : 'Sim'}
                      </button>
                      <span className="text-gray-700">|</span>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-[10px] font-medium text-gray-400 hover:text-white cursor-pointer"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(property)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded transition-all cursor-pointer"
                        title="Editar imóvel"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(property.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400/80 hover:text-red-400 border border-red-900/40 hover:border-red-500/40 px-3 py-1.5 rounded transition-all cursor-pointer"
                        title="Excluir imóvel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
