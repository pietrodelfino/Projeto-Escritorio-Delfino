import { useState } from 'react';
import type { Property } from '../types/property';
import { createProperty, updateProperty } from '../services/firebase';
import { ArrowLeft, Save, Loader2, Plus, X, ImageIcon } from 'lucide-react';

interface PropertyFormProps {
  initialData: Property | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type FormData = Omit<Property, 'id'>;

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  type: '',
  category: 'corporativo',
  price: 0,
  location: '',
  area: 0,
  lotArea: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  parking: undefined,
  ceilingHeight: undefined,
  hasVirtualTour: false,
  photos: [''],
  tags: [],
  complianceVerified: false,
};

export default function PropertyForm({ initialData, onSuccess, onCancel }: PropertyFormProps) {
  const [form, setForm] = useState<FormData>(() =>
    initialData
      ? { ...initialData }
      : { ...EMPTY_FORM }
  );
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const isEditing = initialData !== null;

  // ── Generic field setter ───────────────────────────────────
  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // ── Photo URL management ───────────────────────────────────
  const setPhoto = (idx: number, url: string) => {
    const updated = [...form.photos];
    updated[idx] = url;
    setField('photos', updated);
  };

  const addPhoto = () => setField('photos', [...form.photos, '']);
  const removePhoto = (idx: number) => {
    if (form.photos.length <= 1) return;
    setField('photos', form.photos.filter((_, i) => i !== idx));
  };

  // ── Tag management ─────────────────────────────────────────
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      setField('tags', [...form.tags, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setField('tags', form.tags.filter(t => t !== tag));
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setIsSaving(true);

    // Filter out empty photo URLs before saving
    const cleanedForm: FormData = {
      ...form,
      photos: form.photos.filter(url => url.trim() !== ''),
    };

    if (cleanedForm.photos.length === 0) {
      cleanedForm.photos = ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'];
    }

    try {
      if (isEditing && initialData) {
        await updateProperty(initialData.id, cleanedForm);
      } else {
        await createProperty(cleanedForm);
      }
      onSuccess();
    } catch {
      setSaveError('Erro ao salvar o imóvel. Verifique os dados e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Shared input classes ───────────────────────────────────
  const inputClass = 'w-full px-3 py-2.5 bg-gray-900/80 border border-gray-700 rounded text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C5A880] transition-colors';
  const labelClass = 'block text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1.5';
  const sectionClass = 'bg-[#0B192C] border border-[#C5A880]/10 rounded-xl p-6 space-y-5';
  const sectionTitleClass = 'text-xs uppercase tracking-widest text-[#C5A880] font-bold border-b border-gray-800 pb-2 mb-5';

  return (
    <div className="min-h-screen bg-[#040A12] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[#0B192C]/95 backdrop-blur-md border-b border-[#C5A880]/15 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-white">
              {isEditing ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-[#C5A880] font-bold">Painel Admin</p>
          </div>
        </div>

        <button
          form="property-form"
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-[#B3966E] disabled:bg-gray-700 disabled:cursor-not-allowed text-[#0B192C] font-bold text-[11px] uppercase tracking-wider px-5 py-2 rounded transition-all active:scale-95 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Publicar Imóvel')}
        </button>
      </header>

      {/* Form */}
      <form id="property-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {saveError && (
          <div className="p-4 bg-red-950/50 border border-red-500/30 rounded-lg text-sm text-red-300">
            {saveError}
          </div>
        )}

        {/* ── Section 1: Informações Básicas ── */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>1. Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Título do Imóvel *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setField('title', e.target.value)}
                placeholder="Ex: Galpão Industrial Washington Luís"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Categoria *</label>
              <select
                required
                value={form.category}
                onChange={e => setField('category', e.target.value as FormData['category'])}
                className={inputClass}
              >
                <option value="corporativo">Corporativo / Industrial</option>
                <option value="residencial">Residencial</option>
                <option value="rural">Rural / Fazendas</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Tipo de Imóvel *</label>
              <input
                type="text"
                required
                value={form.type}
                onChange={e => setField('type', e.target.value)}
                placeholder="Ex: Galpão Industrial, Casa em Condomínio, Fazenda..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Preço (R$) *</label>
              <input
                type="number"
                required
                min={0}
                value={form.price || ''}
                onChange={e => setField('price', Number(e.target.value))}
                placeholder="Ex: 15000000"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Localização Completa *</label>
              <input
                type="text"
                required
                value={form.location}
                onChange={e => setField('location', e.target.value)}
                placeholder="Ex: Centro, Araraquara - SP"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Descrição Completa *</label>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                placeholder="Descreva detalhadamente o imóvel, características, diferenciais e infraestrutura..."
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        </div>

        {/* ── Section 2: Características Técnicas ── */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>2. Características Técnicas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Área Útil (m²) *</label>
              <input
                type="number"
                required
                min={1}
                value={form.area || ''}
                onChange={e => setField('area', Number(e.target.value))}
                placeholder="Ex: 5200"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Área do Lote (m²)</label>
              <input
                type="number"
                min={0}
                value={form.lotArea || ''}
                onChange={e => setField('lotArea', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 10000"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Dormitórios / Suítes</label>
              <input
                type="number"
                min={0}
                value={form.bedrooms || ''}
                onChange={e => setField('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 4"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Banheiros</label>
              <input
                type="number"
                min={0}
                value={form.bathrooms || ''}
                onChange={e => setField('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 6"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Vagas de Garagem</label>
              <input
                type="number"
                min={0}
                value={form.parking || ''}
                onChange={e => setField('parking', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 4"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Pé-Direito (m) — Galpões</label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={form.ceilingHeight || ''}
                onChange={e => setField('ceilingHeight', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Ex: 12"
                className={inputClass}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.hasVirtualTour}
                  onChange={e => setField('hasVirtualTour', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.hasVirtualTour ? 'bg-[#C5A880] border-[#C5A880]' : 'bg-transparent border-gray-600 group-hover:border-gray-400'}`}>
                  {form.hasVirtualTour && <span className="text-[#0B192C] font-bold text-xs">✓</span>}
                </div>
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Tour Virtual 360°</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.complianceVerified}
                  onChange={e => setField('complianceVerified', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.complianceVerified ? 'bg-[#C5A880] border-[#C5A880]' : 'bg-transparent border-gray-600 group-hover:border-gray-400'}`}>
                  {form.complianceVerified && <span className="text-[#0B192C] font-bold text-xs">✓</span>}
                </div>
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Segurança Jurídica Auditada</span>
            </label>
          </div>
        </div>

        {/* ── Section 3: Fotos (URLs) ── */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>3. Fotos do Imóvel (URLs)</h2>
          <div className="space-y-3">
            {form.photos.map((url, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {/* Preview thumbnail */}
                <div className="w-16 h-10 rounded bg-gray-900 border border-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {url ? (
                    <img src={url} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-gray-700" />
                  )}
                </div>
                <div className="relative flex-grow">
                  <input
                    type="url"
                    value={url}
                    onChange={e => setPhoto(idx, e.target.value)}
                    placeholder={`URL da Foto ${idx + 1} (Unsplash, Firebase Storage...)`}
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  disabled={form.photos.length <= 1}
                  className="p-2 text-gray-600 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Remover foto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addPhoto}
              className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] hover:text-white border border-[#C5A880]/25 hover:border-[#C5A880]/50 px-4 py-2 rounded transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar Mais Fotos
            </button>
          </div>
        </div>

        {/* ── Section 4: Tags ── */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>4. Tags e Palavras-chave</h2>

          {/* Current tags */}
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {form.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-gray-900 text-gray-300 text-xs px-2.5 py-1 rounded border border-gray-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    aria-label={`Remover tag ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add tag */}
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="Ex: Pé-direito 12m, Logística, Nascentes..."
              className={`${inputClass} flex-grow`}
            />
            <button
              type="button"
              onClick={addTag}
              className="inline-flex items-center gap-1 bg-[#C5A880]/10 hover:bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/25 text-xs font-bold px-4 py-2 rounded transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-1.5">Pressione Enter ou clique em "Adicionar" para inserir cada tag individualmente.</p>
        </div>

        {/* ── Footer action bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8 border-t border-gray-800">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Cancelar e Voltar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-[#B3966E] disabled:bg-gray-700 disabled:cursor-not-allowed text-[#0B192C] font-bold text-sm uppercase tracking-wider px-8 py-3 rounded transition-all active:scale-95 shadow-lg cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Publicar Imóvel')}
          </button>
        </div>
      </form>
    </div>
  );
}
