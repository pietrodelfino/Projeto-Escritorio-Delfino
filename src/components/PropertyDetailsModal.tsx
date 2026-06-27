import { useState } from 'react';
import type { Property } from '../types/property';
import { submitContactForm } from '../services/firebase';
import { X, Maximize2, BedDouble, Bath, Car, ArrowUpToLine, ShieldCheck, Check, Loader2, Landmark, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

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

  // Carousel navigation handlers
  const prevPhoto = () => {
    setActivePhotoIdx((prev) =>
      prev === 0 ? property.photos.length - 1 : prev - 1
    );
  };

  const nextPhoto = () => {
    setActivePhotoIdx((prev) =>
      prev === property.photos.length - 1 ? 0 : prev + 1
    );
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
              {/* Photo Gallery Viewer — Carousel with arrows */}
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-black mb-4 group">
                {/* Main photo with crossfade via key-change */}
                <img
                  key={activePhotoIdx}
                  src={property.photos[activePhotoIdx]}
                  alt={`${property.title} - Foto ${activePhotoIdx + 1}`}
                  className="w-full h-full object-cover animate-[fadeIn_0.4s_ease-in-out]"
                  style={{ animation: 'fadeIn 0.4s ease-in-out' }}
                />

                {/* Arrow Buttons — only rendered when there is more than one photo */}
                {property.photos.length > 1 && (
                  <>
                    {/* Previous Arrow */}
                    <button
                      onClick={prevPhoto}
                      aria-label="Foto anterior"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-[#C5A880] text-white hover:text-[#0B192C] rounded-full border border-white/10 hover:border-[#C5A880] transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Next Arrow */}
                    <button
                      onClick={nextPhoto}
                      aria-label="Próxima foto"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-[#C5A880] text-white hover:text-[#0B192C] rounded-full border border-white/10 hover:border-[#C5A880] transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                      {property.photos.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePhotoIdx(idx)}
                          aria-label={`Ir para foto ${idx + 1}`}
                          className={`rounded-full transition-all duration-300 cursor-pointer ${
                            activePhotoIdx === idx
                              ? 'w-5 h-2 bg-[#C5A880]'
                              : 'w-2 h-2 bg-white/50 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Photo counter */}
                    <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                      {activePhotoIdx + 1} / {property.photos.length}
                    </span>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {property.photos.length > 1 && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
                  {property.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      aria-label={`Ver foto ${idx + 1}`}
                      className={`relative flex-shrink-0 w-20 aspect-[16/10] rounded overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                        activePhotoIdx === idx
                          ? 'border-[#C5A880] ring-1 ring-[#C5A880]/40'
                          : 'border-transparent opacity-50 hover:opacity-90'
                      }`}
                    >
                      <img src={photo} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
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


              {/* Interactive Map — OpenStreetMap (free, no API key required) */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-widest text-[#C5A880] font-bold mb-3 border-b border-gray-800 pb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Localização e Arredores
                </h3>

                {/* Map iframe container */}
                <div className="relative rounded-lg overflow-hidden border border-[#C5A880]/15 shadow-lg" style={{ height: '220px' }}>
                  {/* Dark overlay frame to integrate map into dark UI */}
                  <div className="absolute inset-0 pointer-events-none z-10 rounded-lg ring-1 ring-inset ring-[#C5A880]/10" />
                  
                  <iframe
                    title={`Mapa da região: ${property.location}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: 'block', filter: 'saturate(0.7) brightness(0.85) contrast(1.05)' }}
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-48.2260%2C-21.8200%2C-48.1500%2C-21.7600&layer=mapnik&marker=-21.7946%2C-48.1766"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Privacy / Approximate location disclaimer */}
                <div className="mt-2.5 flex items-start gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#C5A880]/60 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-500 leading-relaxed font-light">
                    <span className="text-gray-400 font-semibold">Localização aproximada.</span>{' '}
                    A posição exata de imóveis corporativos, industriais e rurais é tratada de forma aproximada neste mapa para garantir a segurança e o sigilo patrimonial dos nossos clientes.
                    A localização precisa é divulgada apenas após qualificação e NDA assinado.
                  </p>
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
                  /* Premium success card with golden branding */
                  <div className="relative overflow-hidden border border-[#C5A880]/25 rounded-xl p-6 text-center bg-gradient-to-b from-[#0D1F38] to-[#070F19] my-4">
                    {/* Subtle golden glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-[#C5A880]/60 to-transparent" />

                    {/* Animated check icon */}
                    <div className="relative mx-auto mb-5 w-16 h-16">
                      <div className="absolute inset-0 rounded-full bg-[#C5A880]/10 animate-ping" style={{ animationDuration: '2.5s' }} />
                      <div className="relative w-16 h-16 rounded-full border-2 border-[#C5A880]/60 bg-[#C5A880]/10 flex items-center justify-center">
                        <Check className="w-7 h-7 text-[#C5A880]" strokeWidth={2.5} />
                      </div>
                    </div>

                    <h4 className="text-white font-serif text-lg font-semibold mb-1">
                      Solicitação Recebida com Sigilo
                    </h4>
                    <p className="text-[#C5A880] text-[11px] uppercase tracking-widest font-bold mb-4">
                      Eduardo Delfino Imóveis — Desde 1908
                    </p>

                    <p className="text-gray-300 text-xs leading-relaxed mb-3">
                      Sua consulta foi registrada de forma confidencial.
                      O <strong className="text-white">Dr. Silvio Delfino</strong> ou o{' '}
                      <strong className="text-white">Eduardo Delfino</strong> entrarão em contato
                      com você diretamente, por canal exclusivo e seguro, em até{' '}
                      <span className="text-[#C5A880] font-semibold">2 horas úteis</span>.
                    </p>

                    <p className="text-gray-500 text-[10px] leading-relaxed mb-5">
                      Todas as informações trocadas são protegidas por acordo de
                      confidencialidade e estão em conformidade com a LGPD.
                    </p>

                    <div className="border-t border-gray-800 pt-4">
                      <button
                        onClick={() => setSubmitResult(null)}
                        className="text-[11px] text-[#C5A880]/70 hover:text-[#C5A880] transition-colors font-semibold uppercase tracking-wider"
                      >
                        ← Enviar nova consulta
                      </button>
                    </div>
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
