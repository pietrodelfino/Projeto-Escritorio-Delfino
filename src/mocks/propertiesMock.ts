import type { Property } from '../types/property';

export const propertiesMock: Property[] = [
  {
    id: 'prop-01',
    title: 'Galpão Industrial Washington Luís',
    description: 'Galpão industrial estratégico de altíssimo padrão, localizado na Rodovia Washington Luís. Excelente logística, pé-direito duplo de 12 metros, piso industrial reforçado para alta tonelagem, docas cobertas e amplo pátio de manobras. Portaria blindada com controle de acesso.',
    type: 'Galpão Industrial',
    category: 'corporativo',
    price: 15000000,
    location: 'Jardim Paulistano (Marginal Washington Luís), Araraquara - SP',
    area: 5200,
    lotArea: 10000,
    bathrooms: 8,
    parking: 25,
    ceilingHeight: 12,
    hasVirtualTour: true,
    photos: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Logística', 'Rodovia', 'Pé-direito 12m', 'Piso de alta tonelagem', 'Docas'],
    complianceVerified: true
  },
  {
    id: 'prop-02',
    title: 'Prédio Comercial Corporativo Centro',
    description: 'Sede corporativa imponente no coração de Araraquara. Prédio moderno com fachada em vidro reflexivo, recepção luxuosa com controle de acesso, andares em vão livre com ar-condicionado central, banheiros adaptados, copa, elevador panorâmico e garagem subterrânea privativa.',
    type: 'Prédio Comercial',
    category: 'corporativo',
    price: 4800000,
    location: 'Centro, Araraquara - SP',
    area: 1200,
    lotArea: 800,
    bathrooms: 12,
    parking: 15,
    hasVirtualTour: false,
    photos: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Centro', 'Corporativo', 'Vidro Reflexivo', 'Estacionamento Subterrâneo'],
    complianceVerified: true
  },
  {
    id: 'prop-03',
    title: 'Mansão Contemporânea Vila Harmonia',
    description: 'Espetacular residência contemporânea em um dos condomínios mais prestigiados da Vila Harmonia. Projeto assinado com acabamentos premium de alto padrão, pé-direito duplo na sala integrada ao espaço gourmet, piscina com borda infinita aquecida e paisagismo integrado. 4 suítes luxuosas com closets.',
    type: 'Casa em Condomínio',
    category: 'residencial',
    price: 3200000,
    location: 'Vila Harmonia, Araraquara - SP',
    area: 450,
    lotArea: 600,
    bedrooms: 4,
    bathrooms: 6,
    parking: 4,
    hasVirtualTour: true,
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Vila Harmonia', 'Condomínio Fechado', 'Piscina Aquecida', 'Alto Padrão'],
    complianceVerified: true
  },
  {
    id: 'prop-04',
    title: 'Fazenda Histórica Região Central',
    description: 'Extraordinária fazenda produtiva de cana-de-açúcar e pecuária com terra roxa de altíssima fertilidade. Possui sede centenária restaurada com excelente área de lazer, piscina, capela histórica, curral completo, balança, barracões para maquinários e rica em água com nascentes e represas.',
    type: 'Fazenda',
    category: 'rural',
    price: 22000000,
    location: 'Região Central, Araraquara - SP',
    area: 2420000,
    lotArea: 2420000,
    bedrooms: 6,
    bathrooms: 8,
    parking: 10,
    hasVirtualTour: false,
    photos: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Terra Roxa', 'Cana-de-Açúcar', 'Rica em Água', 'Sede Histórica'],
    complianceVerified: true
  }
];
