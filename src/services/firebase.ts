import type { Property } from '../types/property';
import { propertiesMock } from '../mocks/propertiesMock';

export interface PropertyFilters {
  category?: 'corporativo' | 'residencial' | 'rural';
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  location?: string;
  search?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId?: string;
}

/**
 * Simulates fetching properties from Firebase Firestore with dynamic filtering.
 * Has a simulated network delay of 500ms.
 */
export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...propertiesMock];

      if (filters) {
        const { category, type, minPrice, maxPrice, minArea, maxArea, bedrooms, location, search } = filters;

        if (category) {
          filtered = filtered.filter(p => p.category === category);
        }

        if (type && type !== 'Todos') {
          filtered = filtered.filter(p => p.type.toLowerCase().includes(type.toLowerCase()));
        }

        if (minPrice !== undefined) {
          filtered = filtered.filter(p => p.price >= minPrice);
        }

        if (maxPrice !== undefined) {
          filtered = filtered.filter(p => p.price <= maxPrice);
        }

        if (minArea !== undefined) {
          filtered = filtered.filter(p => p.area >= minArea);
        }

        if (maxArea !== undefined) {
          filtered = filtered.filter(p => p.area <= maxArea);
        }

        if (bedrooms !== undefined && bedrooms > 0) {
          filtered = filtered.filter(p => p.bedrooms !== undefined && p.bedrooms >= bedrooms);
        }

        if (location) {
          filtered = filtered.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
        }

        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.location.toLowerCase().includes(searchLower) ||
            p.type.toLowerCase().includes(searchLower)
          );
        }
      }

      resolve(filtered);
    }, 500);
  });
}

/**
 * Simulates fetching a single property by ID from Firebase Firestore.
 * Has a simulated network delay of 500ms.
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const property = propertiesMock.find(p => p.id === id) || null;
      resolve(property);
    }, 500);
  });
}

/**
 * Simulates submitting contact form data to Firebase Firestore / Cloud Functions.
 * Has a simulated network delay of 500ms.
 */
export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Firebase mock: Form data submitted successfully:', data);
      resolve({
        success: true,
        message: 'Formulário enviado com sucesso! Entraremos em contato em breve.'
      });
    }, 500);
  });
}
