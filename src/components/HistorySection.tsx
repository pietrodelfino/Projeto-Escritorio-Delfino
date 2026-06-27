import { Award, History, Users } from 'lucide-react';

export default function HistorySection() {
  const partners = [
    { name: 'Randon', role: 'Expansão de Plantas e Centros de Distribuição | Intermediação de Terrenos para Fábricas' },
    { name: 'Extra Supermercados', role: 'Estudos de Viabilidade de Pontos Comerciais' },
    { name: 'Savegnago Supermercados', role: 'Locação e Venda de Áreas Corporativas' }
  ];

  return (
    <section id="tradicao" className="py-20 bg-[#F4F6FA] text-[#0B192C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B3966E] font-bold">Mais de um século de história</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#0B192C] mt-2 mb-4">
            Uma Trajetória de <span className="font-semibold italic text-[#B3966E]">Confiança e Discrição</span>
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto mt-4" />
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* History Narrative */}
          <div className="space-y-6 text-black leading-relaxed font-light">
            <p className="text-lg font-serif italic text-[#0B192C]">
              "A história do progresso do interior paulista cruza com a nossa assinatura."
            </p>
            <p>
              Tudo começou em <strong>1908</strong>, quando o pioneiro <strong>Luiz Delfino</strong> iniciou os primeiros negócios imobiliários rurais e urbanos na região central de São Paulo, estabelecendo as bases de credibilidade que regeriam as futuras gerações.
            </p>
            <p>
              Posteriormente, seu filho <strong>Eduardo Delfino</strong> expandiu os negócios familiares, consolidando a marca como referência na intermediação de fazendas de café e cana-de-açúcar, além de desenhar os primeiros loteamentos nobres da região, como a tradicional Vila Harmonia.
            </p>
            <p>
              Hoje, sob a liderança dos <strong>Netos de Eduardo Delfino</strong>, a empresa alia a solidez jurídica tradicional de assessoramento exclusivo — liderada por Silvio Delfino — ao dinamismo do mercado imobiliário moderno de galpões logísticos e incorporações corporativas de alta complexidade.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex gap-3">
                <div className="p-2 bg-[#C5A880]/10 rounded h-10 w-10 flex items-center justify-center flex-shrink-0 text-[#B3966E]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-sm text-[#0B192C]">118 Anos</h4>
                  <p className="text-xs text-black">De atuação ininterrupta no mercado.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-[#C5A880]/10 rounded h-10 w-10 flex items-center justify-center flex-shrink-0 text-[#B3966E]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-sm text-[#0B192C]">Gestão Familiar</h4>
                  <p className="text-xs text-black">Passada de geração a geração.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphical/Image display */}
          <div className="relative">
            {/* Main visual showing corporate building / historic look */}
            <div className="aspect-[4/3] rounded bg-gray-300 overflow-hidden shadow-2xl border-4 border-white relative">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                alt="História da Imobiliária"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#0B192C]/30 mix-blend-multiply" />
            </div>

            {/* Overlap Badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#0B192C] text-white p-6 rounded shadow-xl max-w-xs border-l-4 border-[#C5A880] hidden sm:block">
              <History className="w-6 h-6 text-[#C5A880] mb-2" />
              <h5 className="font-serif font-bold text-base mb-1">Fundada em 1908</h5>
              <p className="text-xs text-gray-400 font-light">
                Mais de um século intermediando grandes transações com o máximo sigilo e assessoria jurídica integrada.
              </p>
            </div>
          </div>
        </div>

        {/* Corporate Partners */}
        <div className="border-t border-gray-300/80 pt-16">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-widest text-[#B3966E] font-bold">Parcerias Corporativas de Peso</span>
            <h3 className="text-xl font-serif text-[#0B192C] font-normal mt-1">
              Grandes Empresas que Confiam na Nossa Assessoria
            </h3>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="bg-white hover:bg-white/80 p-6 rounded border border-gray-200/80 hover:border-[#C5A880]/30 transition-all duration-300 text-center flex flex-col justify-center items-center shadow-sm hover:shadow-md group"
              >
                {/* Simulated Logo (Textual & Elegant Icon placeholder) */}
                <div className="w-12 h-12 rounded-full bg-[#0B192C]/5 flex items-center justify-center mb-3 group-hover:bg-[#C5A880]/15 transition-all">
                  <span className="text-[#0B192C] group-hover:text-[#B3966E] font-serif font-bold text-lg">
                    {partner.name.charAt(0)}
                  </span>
                </div>
                
                <h4 className="font-serif font-bold text-base text-[#0B192C] tracking-wide mb-1">
                  {partner.name}
                </h4>
                <p className="text-[11px] text-black leading-normal max-w-[180px]">
                  {partner.role}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
