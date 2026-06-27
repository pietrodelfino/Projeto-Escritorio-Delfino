import { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-md'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand/Logo */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <img src="/logo.jpg" alt="Eduardo Delfino Imóveis" className="h-10 w-auto object-contain" />
            </div>
            <span className="text-[8px] sm:text-[9px] tracking-wider text-[#B3966E] font-sans font-semibold mt-1">
              Discrição, Tradição e Segurança Jurídica
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
            <a
              href="#"
              className="text-[#B3966E] transition-colors duration-200"
            >
              Início
            </a>
            <a
              href="#imoveis"
              className="text-slate-700 hover:text-[#B3966E] transition-colors duration-200"
            >
              Imóveis
            </a>
            <a
              href="#tradicao"
              className="text-slate-700 hover:text-[#B3966E] transition-colors duration-200"
            >
              Nossa História
            </a>
            <a
              href="#contato"
              className="text-slate-700 hover:text-[#B3966E] transition-colors duration-200"
            >
              Contato
            </a>
          </nav>

          {/* Call to Action Button */}
          <div className="hidden md:flex items-center">
            <a
              href="#contato"
              className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-[#B3966E] text-[#162238] font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              Atendimento Exclusivo
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-700 hover:text-[#B3966E] focus:outline-none p-1.5 rounded border border-slate-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white/95 border-b border-slate-200 backdrop-blur-lg transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-3 pb-6 space-y-4 text-center">
          <a
            href="#"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-medium text-[#B3966E] py-2 border-b border-slate-100"
          >
            Início
          </a>
          <a
            href="#imoveis"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-[#B3966E] py-2 border-b border-slate-100"
          >
            Imóveis
          </a>
          <a
            href="#tradicao"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-[#B3966E] py-2 border-b border-slate-100"
          >
            Nossa História
          </a>
          <a
            href="#contato"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-[#B3966E] py-2 border-b border-slate-100"
          >
            Contato
          </a>
          <div className="pt-2">
            <a
              href="#contato"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 w-full bg-[#C5A880] text-[#162238] font-bold text-xs uppercase tracking-widest py-3 rounded shadow-md"
            >
              <Phone className="w-4 h-4" />
              Atendimento Exclusivo
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
