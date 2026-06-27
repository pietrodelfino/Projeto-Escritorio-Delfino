import { useState } from 'react';
import { Search, Building2, Home, Trees, MapPin } from 'lucide-react';
import type { PropertyFilters } from '../services/firebase';

interface HeroProps {
  onSearch: (filters: PropertyFilters) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'corporativo' | 'residencial' | 'rural'>('corporativo');
  
  // Filter states
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState('');
  
  // Specific category filters
  const [corpType, setCorpType] = useState('Todos');
  const [corpMinArea, setCorpMinArea] = useState<number | undefined>(undefined);
  
  const [resType, setResType] = useState('Todos');
  const [resBedrooms, setResBedrooms] = useState<number | undefined>(undefined);
  
  const [ruralType, setRuralType] = useState('Todos');
  const [ruralMinArea, setRuralMinArea] = useState<number | undefined>(undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseFilters: PropertyFilters = {
      category: activeTab,
      search: searchText || undefined,
      location: location || undefined,
    };

    if (activeTab === 'corporativo') {
      onSearch({
        ...baseFilters,
        type: corpType !== 'Todos' ? corpType : undefined,
        minArea: corpMinArea,
      });
    } else if (activeTab === 'residencial') {
      onSearch({
        ...baseFilters,
        type: resType !== 'Todos' ? resType : undefined,
        bedrooms: resBedrooms,
      });
    } else if (activeTab === 'rural') {
      onSearch({
        ...baseFilters,
        type: ruralType !== 'Todos' ? ruralType : undefined,
        minArea: ruralMinArea,
      });
    }
  };

  // When changing tabs, we can automatically trigger onSearch to refresh list category
  const handleTabChange = (tab: 'corporativo' | 'residencial' | 'rural') => {
    setActiveTab(tab);
    
    // Build initial filters for that category to pre-update list
    const baseFilters: PropertyFilters = {
      category: tab,
      search: searchText || undefined,
      location: location || undefined,
    };

    if (tab === 'corporativo') {
      onSearch({
        ...baseFilters,
        type: corpType !== 'Todos' ? corpType : undefined,
        minArea: corpMinArea,
      });
    } else if (tab === 'residencial') {
      onSearch({
        ...baseFilters,
        type: resType !== 'Todos' ? resType : undefined,
        bedrooms: resBedrooms,
      });
    } else if (tab === 'rural') {
      onSearch({
        ...baseFilters,
        type: ruralType !== 'Todos' ? ruralType : undefined,
        minArea: ruralMinArea,
      });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#070F19]">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')`,
          filter: 'brightness(0.22)' 
        }}
      />

      {/* Decorative Gold & Blue Gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#0B192C]/50 rounded-full blur-3xl" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 text-[#C5A880] text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
          Assessoria Imobiliária Premium desde 1908
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-normal leading-tight max-w-4xl mx-auto mb-4">
          Discrição, Tradição e <span className="text-[#C5A880] font-semibold italic">Segurança Jurídica</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-300 text-lg sm:text-xl font-light max-w-2xl mx-auto mb-10">
          Intermediação confidencial de ativos imobiliários corporativos, residências de alto padrão e fazendas produtivas em Araraquara e região central.
        </p>

        {/* Search Engine Card */}
        <div className="w-full max-w-4xl mx-auto bg-[#0B192C]/80 backdrop-blur-md rounded-xl border border-[#C5A880]/20 p-5 sm:p-6 shadow-2xl">
          {/* Tabs Navigation */}
          <div className="flex flex-wrap border-b border-gray-800/80 mb-6">
            <button
              onClick={() => handleTabChange('corporativo')}
              className={`flex items-center gap-2 pb-3.5 px-4 font-sans text-sm font-semibold tracking-wider uppercase border-b-2 transition-all duration-200 ${
                activeTab === 'corporativo'
                  ? 'border-[#C5A880] text-[#C5A880]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Corporativo / Industrial
            </button>
            <button
              onClick={() => handleTabChange('residencial')}
              className={`flex items-center gap-2 pb-3.5 px-4 font-sans text-sm font-semibold tracking-wider uppercase border-b-2 transition-all duration-200 ${
                activeTab === 'residencial'
                  ? 'border-[#C5A880] text-[#C5A880]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              Residencial
            </button>
            <button
              onClick={() => handleTabChange('rural')}
              className={`flex items-center gap-2 pb-3.5 px-4 font-sans text-sm font-semibold tracking-wider uppercase border-b-2 transition-all duration-200 ${
                activeTab === 'rural'
                  ? 'border-[#C5A880] text-[#C5A880]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Trees className="w-4 h-4" />
              Rural / Fazendas
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              {/* Field 1: Search Text */}
              <div className="relative">
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1.5">
                  Palavra-chave
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Ex: Rodovia, Alto Padrão..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-900/60 border border-gray-700/80 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                </div>
              </div>

              {/* Field 2: Location */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1.5">
                  Localização
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Centro, Vila Harmonia..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-900/60 border border-gray-700/80 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                </div>
              </div>

              {/* Field 3: Dynamic Category Selection */}
              {activeTab === 'corporativo' && (
                <>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1.5">
                      Tipo de Imóvel
                    </label>
                    <select
                      value={corpType}
                      onChange={(e) => setCorpType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-900/60 border border-gray-700/80 rounded text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Todos" className="bg-gray-900">Todos os tipos</option>
                      <option value="Galpão Industrial" className="bg-gray-900">Galpões Industriais</option>
                      <option value="Prédio Comercial" className="bg-gray-900">Prédios Comerciais</option>
                      <option value="Área Comercial" className="bg-gray-900">Áreas Comerciais</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1.5">
                      Área Mínima
                    </label>
                    <select
                      value={corpMinArea || ''}
                      onChange={(e) => setCorpMinArea(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2.5 bg-gray-900/60 border border-gray-700/80 rounded text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-gray-900">Qualquer área</option>
                      <option value="500" className="bg-gray-900">Mais de 500 m²</option>
                      <option value="1000" className="bg-gray-900">Mais de 1.000 m²</option>
                      <option value="5000" className="bg-gray-900">Mais de 5.000 m²</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'residencial' && (
                <>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1.5">
                      Tipo de Imóvel
                    </label>
                    <select
                      value={resType}
                      onChange={(e) => setResType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-900/60 border border-gray-700/80 rounded text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Todos" className="bg-gray-900">Todos os tipos</option>
                      <option value="Casa em Condomínio" className="bg-gray-900">Casa em Condomínio</option>
                      <option value="Casa Residencial" className="bg-gray-900">Casa Residencial</option>
                      <option value="Apartamento" className="bg-gray-900">Apartamento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1.5">
                      Dormitórios
                    </label>
                    <select
                      value={resBedrooms || ''}
                      onChange={(e) => setResBedrooms(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2.5 bg-gray-900/60 border border-gray-700/80 rounded text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-gray-900">Qualquer dormitório</option>
                      <option value="2" className="bg-gray-900">2 ou mais quartos</option>
                      <option value="3" className="bg-gray-900">3 ou mais quartos</option>
                      <option value="4" className="bg-gray-900">4 ou mais quartos</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'rural' && (
                <>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1.5">
                      Tipo de Imóvel
                    </label>
                    <select
                      value={ruralType}
                      onChange={(e) => setRuralType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-900/60 border border-gray-700/80 rounded text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Todos" className="bg-gray-900">Todos os tipos</option>
                      <option value="Fazenda" className="bg-gray-900">Fazendas</option>
                      <option value="Sítio" className="bg-gray-900">Sítios</option>
                      <option value="Chácara" className="bg-gray-900">Chácaras</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1.5">
                      Área Mínima (Lote)
                    </label>
                    <select
                      value={ruralMinArea || ''}
                      onChange={(e) => setRuralMinArea(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2.5 bg-gray-900/60 border border-gray-700/80 rounded text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-gray-900">Qualquer área</option>
                      <option value="10000" className="bg-gray-900">Mais de 10.000 m²</option>
                      <option value="50000" className="bg-gray-900">Mais de 50.000 m²</option>
                      <option value="200000" className="bg-gray-900">Mais de 200.000 m²</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-800/80 gap-3">
              <span className="text-xs text-gray-400 italic">
                * Filtros pré-formatados para o mercado imobiliário central de SP.
              </span>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-[#B3966E] text-[#0B192C] font-bold text-xs uppercase tracking-widest px-8 py-3 rounded transition-all duration-200 shadow-md cursor-pointer active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  Buscar Imóveis
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
