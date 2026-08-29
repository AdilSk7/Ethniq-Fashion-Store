import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  where,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION = 'enquiries';

export const addEnquiry = async (data) => {
  return await addDoc(collection(db, COLLECTION), {
    ...data,
    isRead: false,
    isResponded: false,
    createdAt: serverTimestamp(),
  });
};

export const getEnquiries = async () => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateEnquiry = async (id, data) => {
  return await updateDoc(doc(db, COLLECTION, id), data);
};

export const deleteEnquiry = async (id) => {
  return await deleteDoc(doc(db, COLLECTION, id));
};

export const subscribeToEnquiries = (callback) => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const subscribeToUserEnquiries = (userId, callback) => {
  if (!userId) return () => {};
  const q = query(collection(db, COLLECTION), where('userId', '==', userId));
  return onSnapshot(q, (snap) => {
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Sort cleanly in javascript to avoid requiring a Firebase composite index for every user
    docs.sort((a, b) => {
      const timeA = a.createdAt?.toMillis() || 0;
      const timeB = b.createdAt?.toMillis() || 0;
      return timeB - timeA;
    });
    callback(docs);
  }, (error) => {
    console.error("Error subscribing to user enquiries:", error);
  });
};
