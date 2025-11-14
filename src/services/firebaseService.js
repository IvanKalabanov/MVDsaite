import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// 📝 УНИВЕРСАЛЬНЫЕ ФУНКЦИИ ДЛЯ ЛЮБЫХ КОЛЛЕКЦИЙ

// Получить все документы из коллекции
export const getCollection = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Добавить документ
export const addDocument = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return { id: docRef.id, ...data };
};

// Обновить документ
export const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
  return { id: docId, ...data };
};

// Удалить документ
export const deleteDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

// Получить документ по ID
export const getDocument = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

// 📊 СПЕЦИАЛЬНЫЕ ФУНКЦИИ ДЛЯ КОНКРЕТНЫХ КОЛЛЕКЦИЙ

// Для заявлений
export const getApplications = async (filters = {}) => {
  let q = collection(db, 'applications');
  
  if (filters.author_login) {
    q = query(q, where('author_login', '==', filters.author_login));
  }
  if (filters.status && filters.status !== 'all') {
    q = query(q, where('status', '==', filters.status));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Для ответов на заявления
export const addApplicationResponse = async (applicationId, responseData) => {
  return addDocument('application_responses', {
    applicationId,
    ...responseData
  });
};

// Получить ответы для заявления
export const getApplicationResponses = async (applicationId) => {
  const q = query(
    collection(db, 'application_responses'),
    where('applicationId', '==', applicationId),
    orderBy('createdAt', 'asc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};