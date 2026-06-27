import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebaseConfig';
import type { Property } from '../types/property';

// ─────────────────────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
//  Firestore collection reference
// ─────────────────────────────────────────────────────────────────────────────

const PROPERTIES_COLLECTION = 'properties';
const CONTACTS_COLLECTION = 'contacts';

// ─────────────────────────────────────────────────────────────────────────────
//  Read helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a Firestore document snapshot into a typed Property object.
 */
function docToProperty(docSnap: import('firebase/firestore').QueryDocumentSnapshot): Property {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title ?? '',
    description: data.description ?? '',
    type: data.type ?? '',
    category: data.category ?? 'corporativo',
    price: data.price ?? 0,
    location: data.location ?? '',
    area: data.area ?? 0,
    lotArea: data.lotArea,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    parking: data.parking,
    ceilingHeight: data.ceilingHeight,
    hasVirtualTour: data.hasVirtualTour ?? false,
    photos: data.photos ?? [],
    tags: data.tags ?? [],
    complianceVerified: data.complianceVerified ?? false,
  };
}

/**
 * Fetches properties from Firestore with optional dynamic filtering.
 *
 * Firestore compound queries are limited, so we apply category filtering
 * server-side and handle the remaining filters client-side for flexibility.
 */
export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  const colRef = collection(db, PROPERTIES_COLLECTION);

  // Build Firestore query — only the category equality filter is applied
  // server-side because it's the most selective and avoids composite index issues.
  let q;
  if (filters?.category) {
    q = query(colRef, where('category', '==', filters.category), orderBy('price', 'desc'));
  } else {
    q = query(colRef, orderBy('price', 'desc'));
  }

  const snapshot = await getDocs(q);
  let results = snapshot.docs.map(docToProperty);

  // Client-side filtering for remaining criteria
  if (filters) {
    const { type, minPrice, maxPrice, minArea, maxArea, bedrooms, location, search } = filters;

    if (type && type !== 'Todos') {
      results = results.filter(p => p.type.toLowerCase().includes(type.toLowerCase()));
    }
    if (minPrice !== undefined) {
      results = results.filter(p => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      results = results.filter(p => p.price <= maxPrice);
    }
    if (minArea !== undefined) {
      results = results.filter(p => p.area >= minArea);
    }
    if (maxArea !== undefined) {
      results = results.filter(p => p.area <= maxArea);
    }
    if (bedrooms !== undefined && bedrooms > 0) {
      results = results.filter(p => p.bedrooms !== undefined && p.bedrooms >= bedrooms);
    }
    if (location) {
      results = results.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.location.toLowerCase().includes(s) ||
        p.type.toLowerCase().includes(s)
      );
    }
  }

  return results;
}

/**
 * Fetches a single property document by ID.
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    id: snap.id,
    title: data.title ?? '',
    description: data.description ?? '',
    type: data.type ?? '',
    category: data.category ?? 'corporativo',
    price: data.price ?? 0,
    location: data.location ?? '',
    area: data.area ?? 0,
    lotArea: data.lotArea,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    parking: data.parking,
    ceilingHeight: data.ceilingHeight,
    hasVirtualTour: data.hasVirtualTour ?? false,
    photos: data.photos ?? [],
    tags: data.tags ?? [],
    complianceVerified: data.complianceVerified ?? false,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Contact form
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Submits contact form data to the "contacts" Firestore collection.
 */
export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    await addDoc(collection(db, CONTACTS_COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return {
      success: true,
      message: 'Formulário enviado com sucesso! Entraremos em contato em breve.',
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message: 'Erro ao enviar o formulário. Tente novamente mais tarde.',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Admin CRUD — Real Firestore implementation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new property document in Firestore.
 */
export async function createProperty(data: Omit<Property, 'id'>): Promise<Property> {
  const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), {
    ...data,
    createdAt: new Date().toISOString(),
  });

  return {
    ...data,
    id: docRef.id,
  };
}

/**
 * Updates an existing property document in Firestore by ID.
 */
export async function updateProperty(id: string, data: Partial<Omit<Property, 'id'>>): Promise<Property | null> {
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return null;

  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });

  const updated = await getDoc(docRef);
  const updatedData = updated.data()!;

  return {
    id: updated.id,
    title: updatedData.title ?? '',
    description: updatedData.description ?? '',
    type: updatedData.type ?? '',
    category: updatedData.category ?? 'corporativo',
    price: updatedData.price ?? 0,
    location: updatedData.location ?? '',
    area: updatedData.area ?? 0,
    lotArea: updatedData.lotArea,
    bedrooms: updatedData.bedrooms,
    bathrooms: updatedData.bathrooms,
    parking: updatedData.parking,
    ceilingHeight: updatedData.ceilingHeight,
    hasVirtualTour: updatedData.hasVirtualTour ?? false,
    photos: updatedData.photos ?? [],
    tags: updatedData.tags ?? [],
    complianceVerified: updatedData.complianceVerified ?? false,
  };
}

/**
 * Deletes a property document and its associated photos from Storage.
 */
export async function deleteProperty(id: string): Promise<{ success: boolean }> {
  try {
    // Optionally delete photos from Storage
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      const photos: string[] = data.photos ?? [];

      // Delete photos that are stored in Firebase Storage (contain firebasestorage.googleapis.com)
      for (const url of photos) {
        if (url.includes('firebasestorage.googleapis.com')) {
          try {
            const photoRef = ref(storage, url);
            await deleteObject(photoRef);
          } catch {
            // Photo may already be deleted; continue silently
          }
        }
      }

      await deleteDoc(docRef);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { success: false };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Firebase Storage — Photo Upload
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Uploads a single image file to Firebase Storage and returns the download URL.
 * Files are stored under properties/{propertyId}/{timestamp}_{filename}
 */
export async function uploadPropertyPhoto(file: File, propertyId?: string): Promise<string> {
  const folder = propertyId || 'new';
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `properties/${folder}/${timestamp}_${safeName}`;

  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}
