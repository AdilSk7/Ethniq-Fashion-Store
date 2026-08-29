import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION = 'products';

export const addProduct = async (data) => {
  return await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateProduct = async (id, data) => {
  const ref = doc(db, COLLECTION, id);
  return await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
};

export const deleteProduct = async (id) => {
  return await deleteDoc(doc(db, COLLECTION, id));
};

export const getProduct = async (id) => {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getProducts = async (filters = {}) => {
  const constraints = [];

  if (filters.categoryId) constraints.push(where('categoryId', '==', filters.categoryId));
  if (filters.isNewArrival) constraints.push(where('isNewArrival', '==', true));
  if (filters.isFeatured) constraints.push(where('isFeatured', '==', true));
  if (filters.isOffer) constraints.push(where('isOffer', '==', true));
  if (filters.inStock !== undefined) constraints.push(where('inStock', '==', filters.inStock));

  // To avoid requiring users to manually generate complex Firebase Composite Indexes for every 
  // possible combination of filters alongside 'createdAt', we only query the filters in Firestore, 
  // and handle the chronological sorting and limiting locally on the client array.
  const q = query(collection(db, COLLECTION), ...constraints);
  
  try {
    const snap = await getDocs(q);
    let results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Sort locally by createdAt desc
    results.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    });

    // Apply limit locally
    if (filters.limitCount) {
      results = results.slice(0, filters.limitCount);
    }

    return results;
  } catch (err) {
    console.error('getProducts failed:', err);
    return [];
  }
};

export const subscribeToProducts = (callback, filters = {}) => {
  const constraints = [orderBy('createdAt', 'desc')];
  if (filters.limitCount) constraints.push(limit(filters.limitCount));

  const q = query(collection(db, COLLECTION), ...constraints);
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
    (error) => {
      console.error('Products subscription error:', error);
      callback([]);
    }
  );
};
