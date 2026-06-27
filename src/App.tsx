import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HistorySection from './components/HistorySection';
import PropertyCard from './components/PropertyCard';
import PropertyDetailsModal from './components/PropertyDetailsModal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { getProperties } from './services/firebase';
import type { Property } from './types/property';
import type { PropertyFilters } from './services/firebase';
import { ShieldCheck, Mail, Phone, MapPin, Building2, Trees, Home, Lock } from 'lucide-react';
import { auth } from './services/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  // View state: 'public' | 'login' | 'admin'
  const [appView, setAppView] = useState<'public' | 'login' | 'admin'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Keep track of current filters applied
  const [currentFilters, setCurrentFilters] = useState<PropertyFilters>({
    category: 'corporativo'
  });

  // ── SPA Routing System ──
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setAppView(auth.currentUser ? 'admin' : 'login');
      } else {
        setAppView('public');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Listen to Firebase Auth state changes to persist dashboard login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminAuthenticated(true);
        if (window.location.pathname === '/admin') {
          setAppView('admin');
        }
      } else {
        setIsAdminAuthenticated(false);
        if (window.location.pathname === '/admin') {
          setAppView('login');
        } else {
          setAppView('public');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const navigateToLogin = () => {
    window.history.pushState({}, '', '/admin');
    setAppView(auth.currentUser ? 'admin' : 'login');
  };

  const navigateToPublic = () => {
    window.history.pushState({}, '', '/');
    setAppView('public');
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigateToPublic();
  };

  // Fetch properties whenever current filters change
  useEffect(() => {
    let isMounted = true;
    
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await getProperties(currentFilters);
        if (isMounted) {
          setProperties(data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, [currentFilters]);

  // Standalone refresh used by admin panel after mutations
  const fetchAllProperties = async () => {
    const data = await getProperties();
    setProperties(data);
  };

  // Handler triggered by search in Hero
  const handleSearch = (filters: PropertyFilters) => {
    setCurrentFilters(filters);
  };

  // Scroll to properties section
  const scrollToProperties = () => {
    const section = document.getElementById('imoveis');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ── Admin view: render login or dashboard ─────────────────
  if (appView === 'login') {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          setAppView('admin');
        }}
        onCancel={navigateToPublic}
      />
    );
  }

  if (appView === 'admin' && isAdminAuthenticated) {
    return (
      <AdminDashboard
        properties={properties}
        onLogout={handleLogout}
        onRefresh={() => fetchAllProperties()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#111E31] text-white font-sans selection:bg-[#C5A880]/30 selection:text-[#C5A880]">
      {/* Header component */}
      <Header />

      {/* Hero component with filters search */}
      <Hero onSearch={(filters) => {
        handleSearch(filters);
        scrollToProperties();
      }} />

      {/* Main Properties Section */}
      <section id="imoveis" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-800 pb-6 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">
              Portfólio de Ativos Exclusivos
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal mt-2">
              Opções em{' '}
              <span className="text-[#C5A880] font-semibold italic">
                {currentFilters.category === 'corporativo'
                  ? 'Corporativo & Industrial'
                  : currentFilters.category === 'residencial'
                  ? 'Residencial de Alto Padrão'
                  : 'Rurais & Fazendas'}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-900/60 border border-gray-800 px-3.5 py-2 rounded">
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            <span>Todos os ativos contam com conformidade fiscal e jurídica.</span>
          </div>
        </div>

        {/* Loading/Listing Switch */}
        {loading ? (
          /* Premium Skeleton Loader */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-[#0D1F38]/40 border border-gray-800 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-gray-800/50" />
                <div className="p-5 space-y-4">
                  <div className="h-3 bg-gray-850 rounded w-1/3" />
                  <div className="h-5 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-850 rounded w-1/2" />
                  <div className="h-8 bg-gray-800/30 rounded w-full border border-gray-800/40" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gray-800 rounded w-1/3" />
                    <div className="h-8 bg-[#C5A880]/20 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          /* Empty Search State */
          <div className="text-center py-16 bg-[#0B192C]/40 border border-[#C5A880]/15 rounded-lg max-w-xl mx-auto px-6">
            <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4 text-[#C5A880]/60">
              {currentFilters.category === 'corporativo' ? (
                <Building2 className="w-6 h-6" />
              ) : currentFilters.category === 'rural' ? (
                <Trees className="w-6 h-6" />
              ) : (
                <Home className="w-6 h-6" />
              )}
            </div>
            <h3 className="font-serif text-lg text-white font-semibold mb-2">Nenhum imóvel localizado</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed mb-6">
              Não encontramos resultados para os parâmetros escolhidos. Tente alterar os filtros ou entre em contato direto para assessoria personalizada offline.
            </p>
            <button
              onClick={() => setCurrentFilters({ category: currentFilters.category })}
              className="text-xs font-bold uppercase tracking-wider text-[#C5A880] hover:underline"
            >
              Limpar Filtros e Ver Todos
            </button>
          </div>
        ) : (
          /* Properties Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={(prop) => setSelectedProperty(prop)}
              />
            ))}
          </div>
        )}
      </section>

      {/* History section */}
      <HistorySection />

      {/* Contact info/Footer Section */}
      <footer id="contato" className="bg-[#040A12] border-t border-gray-900 pt-16 pb-12 text-gray-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand Col */}
          <div>
            <div className="flex items-center mb-2">
              <img src="/logo.jpg" alt="Eduardo Delfino Imóveis" className="h-10 w-auto object-contain brightness-110" />
            </div>
            <span className="text-[10px] tracking-wider text-[#C5A880] font-sans font-medium mt-1 block">
              Discrição, Tradição e Segurança Jurídica
            </span>
            <p className="mt-4 leading-relaxed font-light pr-4 text-gray-500">
              Intermediação de ativos imobiliários de alto padrão sob rigorosos padrões de confidencialidade e assessoria jurídica integrada em Araraquara/SP.
            </p>
          </div>

          {/* Quick links & regulatory info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white font-serif">Escritório Central</h4>
            <div className="space-y-2 font-light">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                <span>Rua Comendador Pedro Morgante, 2412 - Centro, Araraquara - SP</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                <span>(16) 3336-6669</span>
              </p>
              <p className="flex items-center gap-2">
                {/* WhatsApp principal — número: (16) 99704-9115 */}
                <svg className="w-4 h-4 text-[#C5A880] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <a
                  href="https://wa.me/5516997049115?text=Olá%2C%20gostaria%20de%20solicitar%20atendimento%20exclusivo."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C5A880] transition-colors"
                >
                  (16) 99704-9115
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                <span>delfinoimoveis2026@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Compliance & OAB */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white font-serif">Conformidade e Responsabilidade</h4>
            <p className="leading-relaxed font-light text-gray-500">
              Todas as transações corporativas rurais e residenciais são auditadas e estruturadas em conjunto com departamento jurídico.
            </p>
            <div className="pt-2 border-t border-gray-900 text-gray-500 space-y-1">
              <p>Assessoria Jurídica: Silvio Delfino — OAB/SP 44.590</p>
              <p>CRECI/SP nº 1.908-J</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-900 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600">
          <p>© 2026 Eduardo Delfino Imóveis. Todos os direitos reservados. Desde 1908.</p>
          <div className="flex items-center gap-4">
            <p className="text-[10px]">Privacidade Garantida — Em conformidade com a LGPD.</p>
            {/* Acesso Restrito — link discreto para o painel administrativo */}
            <button
              onClick={navigateToLogin}
              className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-gray-700 hover:text-gray-500 transition-colors cursor-pointer"
              aria-label="Acesso Restrito ao Painel Administrativo"
            >
              <Lock className="w-2.5 h-2.5" />
              Área Restrita
            </button>
          </div>
        </div>
      </footer>

      {/* Details Modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
