import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const DOC_ID = 'main';
const COLLECTION = 'storeSettings';

export const defaultStoreSettings = {
  shopName: 'Dakshayani Shopping Mall',
  shopNameTelugu: 'దాక్షాయణి షాపింగ్ మాల్',
  type: 'Clothing Store',
  address: 'Opp. ANURAG HOTEL, near Dakshayani Silks, VRC Centre, Nellore, Andhra Pradesh 524003',
  phone: '63005 35105',
  whatsapp: '916300535105',
  email: '',
  openingHours: 'Monday–Sunday: 10:00 AM – 9:00 PM',
  googleMapsUrl: 'https://www.google.com/maps/search/Dakshayani+Shopping+Mall+Nellore',
  rating: '4.2',
  reviews: '437',
  services: {
    delivery: true,
    inStoreShopping: true,
    inStorePickup: true,
    sameDayDelivery: false,
  },
  parking: {
    bikeParking: true,
    carParking: false,
  },
  accessibility: {
    wheelchairAccessible: false,
    familyFriendly: true,
    lgbtqFriendly: true,
    restroom: false,
    changingRoom: true,
    airConditioned: true,
  },
  payments: {
    cash: true,
    upi: true,
    creditCard: false,
    debitCard: false,
    digitalPayments: true,
  },
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
  },
};

export const getStoreSettings = async () => {
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  if (snap.exists()) return snap.data();
  return defaultStoreSettings;
};

export const updateStoreSettings = async (data) => {
  return await setDoc(doc(db, COLLECTION, DOC_ID), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const subscribeToStoreSettings = (callback) => {
  return onSnapshot(doc(db, COLLECTION, DOC_ID), (snap) => {
    if (snap.exists()) callback(snap.data());
    else callback(defaultStoreSettings);
  });
};
