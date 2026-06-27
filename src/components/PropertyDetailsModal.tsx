import { useState } from 'react';
import type { Property } from '../types/property';
import { submitContactForm } from '../services/firebase';
import { X, Maximize2, BedDouble, Bath, Car, ArrowUpToLine, ShieldCheck, Check, Loader2, Landmark, MapPin } from 'lucide-react';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function PropertyDetailsModal({ property, onClose }: PropertyDetailsModalProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [message, setMessage] = useState(
    property ? `Olá, tenho interesse e solicito informações sigilosas sobre o imóvel: "${property.title}" (Cód. ${property.id}).` : ''
  );

  if (!property) return null;

  // Format BRL Price
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await submitContactForm({
        name,
        email,
        phone,
        message,
        propertyId: property.id,
        // Since custom fields can be included in the contact data, we can log them or send them
        company,
        cnpj: cnpj || undefined,
      } as any);

      setSubmitResult(result);
      if (result.success) {
        // Reset form upon success
        setName('');
        setEmail('');
        setPhone('');
        setCompany('');
        setCnpj('');
      }
    } catch (err) {
      setSubmitResult({
        success: false,
        message: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      {/* Modal Card */}
      <div className="relative w-full max-w-5xl bg-[#0B192C] border border-[#C5A880]/20 rounded-xl overflow-hidden shadow-2xl flex flex-col my-8 max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#0B192C]/80 hover:bg-[#C5A880] text-gray-400 hover:text-[#0B192C] rounded-full border border-gray-800 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body (Scrollable Container) */}
        <div className="overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Section: Photos, Specs, Desc (7 Columns) */}
            <div className="lg:col-span-7 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-850">
              {/* Photo Gallery Viewer */}
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-black mb-4">
                <img
                  src={property.photos[activePhotoIdx]}
                  alt={`${property.title} - Foto ${activePhotoIdx + 1}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                
                {/* Thumbnails indicator overlay */}
                {property.photos.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {property.photos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                          activePhotoIdx === idx ? 'bg-[#C5A880] scale-125' : 'bg-white/50 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Photo Gallery Thumbnails */}
              {property.photos.length > 1 && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {property.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative flex-shrink-0 w-20 aspect-[16/10] rounded overflow-hidden border-2 transition-all ${
                        activePhotoIdx === idx ? 'border-[#C5A880]' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Badges, Title & Price */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
                    {property.type}
                  </span>
                  {property.complianceVerified && (
                    <span className="inline-flex items-center gap-1 bg-[#C5A880]/15 text-[#C5A880] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#C5A880]/30">
                      <ShieldCheck className="w-3 h-3" />
                      Segurança Jurídica Auditada
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal mb-2">
                  {property.title}
                </h2>
                
                <p className="text-gray-400 text-sm flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  {property.location}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-gray-900/40 border border-gray-800">
                  <div>
                    <span className="text-xs text-gray-400 block font-light">Valor Comercial Estimado</span>
                    <span className="text-2xl font-bold text-[#C5A880]">{formatPrice(property.price)}</span>
                  </div>
                  <div className="text-xs text-gray-400 sm:text-right max-w-[200px] leading-relaxed">
                    * Transações intermediadas com assessoria jurídica integrada e sigilo fiscal/patrimonial absoluto.
                  </div>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-widest text-[#C5A880] font-bold mb-3 border-b border-gray-800 pb-2">
                  Ficha Técnica Completa
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2 bg-gray-900/30 p-2.5 rounded border border-gray-850">
                    <Maximize2 className="w-4 h-4 text-[#C5A880]" />
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-semibold">Área Útil</span>
                      <span>{property.area} m²</span>
                    </div>
                  </div>

                  {property.lotArea && (
                    <div className="flex items-center gap-2 bg-gray-900/30 p-2.5 rounded border border-gray-850">
                      <Landmark className="w-4 h-4 text-[#C5A880]" />
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase font-semibold">Área Total/Lote</span>
                        <span>{property.lotArea.toLocaleString('pt-BR')} m²</span>
                      </div>
                    </div>
                  )}

                  {property.bedrooms && (
                    <div className="flex items-center gap-2 bg-gray-900/30 p-2.5 rounded border border-gray-850">
                      <BedDouble className="w-4 h-4 text-[#C5A880]" />
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase font-semibold">Dormitórios</span>
                        <span>{property.bedrooms} Suítes</span>
                      </div>
                    </div>
                  )}

                  {property.bathrooms && (
                    <div className="flex items-center gap-2 bg-gray-900/30 p-2.5 rounded border border-gray-850">
                      <Bath className="w-4 h-4 text-[#C5A880]" />
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase font-semibold">Banheiros</span>
                        <span>{property.bathrooms}</span>
                      </div>
                    </div>
                  )}

                  {property.parking && (
                    <div className="flex items-center gap-2 bg-gray-900/30 p-2.5 rounded border border-gray-850">
                      <Car className="w-4 h-4 text-[#C5A880]" />
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase font-semibold">Garagem</span>
                        <span>{property.parking} Vagas</span>
                      </div>
                    </div>
                  )}

                  {property.ceilingHeight && (
                    <div className="flex items-center gap-2 bg-gray-900/30 p-2.5 rounded border border-gray-850">
                      <ArrowUpToLine className="w-4 h-4 text-[#C5A880]" />
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase font-semibold">Pé-Direito</span>
                        <span>{property.ceilingHeight} m</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Placeholder — Localização e Arredores */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-widest text-[#C5A880] font-bold mb-3 border-b border-gray-800 pb-2">
                  📍 Localização e Arredores
                </h3>
                <div className="relative flex flex-col items-center justify-center gap-3 h-44 rounded-lg bg-gradient-to-br from-gray-950 to-[#0B192C] border border-dashed border-[#C5A880]/25 overflow-hidden">
                  {/* Decorative grid pattern */}
                  <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #C5A880 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #C5A880 0px, transparent 1px, transparent 40px)' }} />
                  <MapPin className="w-8 h-8 text-[#C5A880]/50" />
                  <div className="text-center px-6">
                    <p className="text-gray-400 text-sm font-semibold">[Mapa Interativo - API em Desenvolvimento]</p>
                    <p className="text-gray-600 text-xs mt-1 font-light">{property.location}</p>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-gray-600 font-bold border border-gray-800 px-2 py-0.5 rounded">
                    Google Maps / Leaflet — Em breve
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-[#C5A880] font-bold mb-2">
                  Memorial Descritivo do Imóvel
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed font-light whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Right Section: Sticky Contact Form (5 Columns) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#0D1F38]/60 flex flex-col justify-between">
              <div>
                <div className="mb-6 text-center lg:text-left">
                  <h3 className="text-lg font-serif text-white font-normal flex items-center justify-center lg:justify-start gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
                    Atendimento Sigiloso
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Preencha os dados corporativos/pessoais. Retornaremos via canal exclusivo e seguro em até 2 horas úteis.
                  </p>
                </div>

                {submitResult?.success ? (
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-6 rounded-lg text-center my-8">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-white font-serif font-bold text-base mb-2">Solicitação Recebida!</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {submitResult.message}
                    </p>
                    <button
                      onClick={() => setSubmitResult(null)}
                      className="mt-6 text-xs text-[#C5A880] hover:underline font-semibold"
                    >
                      Enviar nova mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error display */}
                    {submitResult && !submitResult.success && (
                      <div className="p-3 bg-red-950/40 border border-red-500/30 rounded text-xs text-red-300">
                        {submitResult.message}
                      </div>
                    )}

                    {/* Field 1: Name */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Dr. Silvio Delfino"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                      />
                    </div>

                    {/* Field 2: Email */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1">
                        E-mail Corporativo/Pessoal *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex: silvio@empresa.com.br"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                      />
                    </div>

                    {/* Field 3: Phone */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1">
                        Telefone de Contato (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: (16) 99999-9999"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                      />
                    </div>

                    {/* Field 4: Company (Razão Social) */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1">
                        Empresa / Razão Social *
                      </label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Ex: Delfino Holding SA"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                      />
                    </div>

                    {/* Field 5: CNPJ */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1">
                        CNPJ da Empresa <span className="text-gray-500 font-normal">(Opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        placeholder="Ex: 00.000.000/0001-00"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                      />
                    </div>

                    {/* Message Area */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#C5A880] font-semibold mb-1">
                        Detalhes do Interesse / Restrições de Horário *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#C5A880] hover:bg-[#B3966E] disabled:bg-gray-700 text-[#0B192C] font-bold text-xs uppercase tracking-widest py-3 rounded transition-all duration-200 shadow-md cursor-pointer active:scale-95 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        'Solicitar Atendimento Sigiloso'
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Compliance note */}
              <div className="mt-8 pt-4 border-t border-gray-800 text-center">
                <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold block">
                  Segurança da Informação LGPD
                </span>
                <p className="text-[10px] text-gray-500 font-light mt-1">
                  Seus dados não são armazenados em listas públicas nem compartilhados com terceiros sem consentimento formal prévio.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
