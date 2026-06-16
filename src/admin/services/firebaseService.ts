import { db, auth } from '../../firebase';
import {
  collection, addDoc, updateDoc, deleteDoc, getDocs,
  doc, serverTimestamp, getCountFromServer, query, where,
} from 'firebase/firestore';

export async function getAll(collectionName: string): Promise<any[]> {
  const snap = await getDocs(collection(db, collectionName));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getWhere(
  collectionName: string,
  field: string,
  value: any,
): Promise<any[]> {
  const q = query(collection(db, collectionName), where(field, '==', value));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addDocument(collectionName: string, data: Record<string, any>): Promise<string> {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await logAudit('CREATE', collectionName, ref.id);
  return ref.id;
}

export async function updateDocument(collectionName: string, id: string, data: Record<string, any>): Promise<void> {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
  await logAudit('UPDATE', collectionName, id);
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(db, collectionName, id));
  await logAudit('DELETE', collectionName, id);
}

export async function getCount(collectionName: string): Promise<number> {
  try {
    const snap = await getCountFromServer(collection(db, collectionName));
    return snap.data().count;
  } catch {
    return 0;
  }
}

export async function getCountWhere(collectionName: string, field: string, value: any): Promise<number> {
  try {
    const q = query(collection(db, collectionName), where(field, '==', value));
    const snap = await getCountFromServer(q);
    return snap.data().count;
  } catch {
    return 0;
  }
}

export async function getTodayCount(collectionName: string, dateField: string): Promise<number> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const q = query(collection(db, collectionName), where(dateField, '==', today));
    const snap = await getCountFromServer(q);
    return snap.data().count;
  } catch {
    return 0;
  }
}

export async function getSumWhere(
  collectionName: string,
  whereField: string,
  whereValue: any,
  sumField: string,
): Promise<number> {
  try {
    const q = query(collection(db, collectionName), where(whereField, '==', whereValue));
    const snap = await getDocs(q);
    return snap.docs.reduce((total, d) => total + (Number(d.data()[sumField]) || 0), 0);
  } catch {
    return 0;
  }
}

async function logAudit(action: string, collectionName: string, docId: string) {
  try {
    await addDoc(collection(db, 'auditLogs'), {
      action,
      collection: collectionName,
      docId,
      userEmail: auth.currentUser?.email ?? 'unknown',
      timestamp: serverTimestamp(),
    });
  } catch {
    // silently fail — audit logging must never break main flow
  }
}

export function formatTimestamp(value: any): string {
  if (!value) return '—';
  if (value?.toDate) return value.toDate().toLocaleDateString('en-IN');
  if (typeof value === 'string') return value;
  return String(value);
}
