export interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  category: 'corporativo' | 'residencial' | 'rural';
  price: number;
  location: string;
  area: number; // in m²
  lotArea?: number; // in m²
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  ceilingHeight?: number; // in meters (for industrial/commercial)
  hasVirtualTour: boolean;
  photos: string[];
  tags: string[];
  complianceVerified: boolean;
}
