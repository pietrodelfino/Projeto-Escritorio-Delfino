import type { Property } from '../types/property';
import { Maximize2, BedDouble, Bath, Car, ArrowUpToLine, ShieldCheck } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

export default function PropertyCard({ property, onSelect }: PropertyCardProps) {
  // Format price to Brazilian Real
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="group bg-[#0D1F38] border border-[#C5A880]/10 rounded-lg overflow-hidden hover:border-[#C5A880]/40 transition-all duration-300 flex flex-col h-full shadow-md hover:shadow-xl hover:-translate-y-1">
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-950">
        <img
          src={property.photos[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Compliance Gold Badge */}
        {property.complianceVerified && (
          <div className="absolute top-3 left-3 bg-[#C5A880] text-[#0B192C] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            Segurança Jurídica Auditada
          </div>
        )}

        {/* Virtual Tour Badge */}
        {property.hasVirtualTour && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded border border-white/20">
            Tour Virtual 360°
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category & Type */}
        <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold mb-1">
          {property.category === 'corporativo' ? 'Corporativo / Industrial' : property.category === 'residencial' ? 'Residencial de Luxo' : 'Rural / Agronegócio'} • {property.type}
        </span>

        {/* Title */}
        <h3 className="text-lg font-serif text-white font-normal group-hover:text-[#C5A880] transition-colors duration-200 line-clamp-1 mb-2">
          {property.title}
        </h3>

        {/* Location */}
        <p className="text-gray-400 text-xs flex items-center gap-1.5 mb-4 line-clamp-1">
          <span className="w-1 h-1 rounded-full bg-[#C5A880]" />
          {property.location}
        </p>

        {/* Technical features grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-800/80 text-gray-300 text-xs mb-4">
          <div className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-[#C5A880]/70" />
            <span>{property.area} m²</span>
          </div>

          {property.category === 'residencial' && property.bedrooms && (
            <div className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5 text-[#C5A880]/70" />
              <span>{property.bedrooms} Qts</span>
            </div>
          )}

          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-[#C5A880]/70" />
              <span>{property.bathrooms} Ban</span>
            </div>
          )}

          {property.parking && (
            <div className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-[#C5A880]/70" />
              <span>{property.parking} Vagas</span>
            </div>
          )}

          {property.ceilingHeight && (
            <div className="flex items-center gap-1 col-span-2">
              <ArrowUpToLine className="w-3.5 h-3.5 text-[#C5A880]/70" />
              <span>Pé-Direito: {property.ceilingHeight}m</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {property.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#0B192C] text-gray-400 text-[10px] px-2 py-0.5 rounded border border-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price and Action Button */}
        <div className="mt-auto pt-4 border-t border-gray-800/50 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 tracking-wider font-semibold">Valor Sob Consulta</span>
            <span className="text-lg font-bold text-white tracking-tight">{formatPrice(property.price)}</span>
          </div>
          <button
            onClick={() => onSelect(property)}
            className="bg-transparent hover:bg-[#C5A880] text-[#C5A880] hover:text-[#0B192C] border border-[#C5A880]/40 hover:border-[#C5A880] text-xs uppercase tracking-wider font-bold px-4 py-2 rounded transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
