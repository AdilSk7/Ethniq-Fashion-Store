import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION = 'categories';

export const addCategory = async (data) => {
  return await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const updateCategory = async (id, data) => {
  return await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteCategory = async (id) => {
  return await deleteDoc(doc(db, COLLECTION, id));
};

export const getCategories = async () => {
  const q = query(collection(db, COLLECTION), orderBy('name'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const subscribeToCategories = (callback) => {
  const q = query(collection(db, COLLECTION), orderBy('name'));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    },
    (error) => {
      console.error('Category subscription error:', error);
      callback([]);
    }
  );
};
