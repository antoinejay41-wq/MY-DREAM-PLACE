import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  OAuthProvider,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  FieldValue,
  Timestamp,
  doc,
  getDocFromServer,
  getFirestore,
  serverTimestamp
} from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes
} from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const appleProvider = new OAuthProvider('apple.com');

export const BOOTSTRAPPED_ADMIN_EMAIL = 'antoinejay41@gmail.com';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates connection to Cloud Firestore on initial boot.
 */
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    // A permission-denied response from the server still proves online reachability.
    return true;
  }
}

// Execute boot connection check immediately
testConnection();

export async function signInWithGooglePopup(): Promise<FirebaseUser> {
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

export async function signInWithApplePopup(): Promise<FirebaseUser> {
  const credential = await signInWithPopup(auth, appleProvider);
  return credential.user;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<FirebaseUser> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<FirebaseUser> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName && credential.user) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }
  return credential.user;
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export function formatFirebaseAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code)
      : '';
  const message = error instanceof Error ? error.message : String(error);

  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found' ||
    message.includes('auth/invalid-credential') ||
    message.includes('auth/wrong-password')
  ) {
    return 'Incorrect email or password. Please verify your password, use "Forgot password?" to reset it, or click Google above if your account uses Google Sign-In.';
  }
  if (code === 'auth/email-already-in-use' || message.includes('auth/email-already-in-use')) {
    return 'An account with this email already exists. Please log in with your password or click "Forgot password?" to reset it.';
  }
  if (code === 'auth/weak-password' || message.includes('auth/weak-password')) {
    return 'Password is too weak. Please enter at least 6 characters.';
  }
  if (code === 'auth/invalid-email' || message.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/too-many-requests' || message.includes('auth/too-many-requests')) {
    return 'Too many failed attempts. Please wait a moment or reset your password.';
  }
  if (code === 'auth/operation-not-allowed' || message.includes('auth/operation-not-allowed')) {
    return 'Email & Password sign-in is not enabled for this provider yet, or your account uses Google Sign-In. Please click the Google button above to sign in securely.';
  }
  if (code === 'auth/popup-closed-by-user' || message.includes('auth/popup-closed-by-user')) {
    return 'Sign-in window was closed before completing authentication.';
  }
  return 'Authentication failed. Please check your credentials and try again.';
}

export async function signOutFromFirebase(): Promise<void> {
  await signOut(auth);
}

/**
 * Recursively strips `undefined` values from an object before writing to Firestore
 * while preserving Firestore FieldValue sentinels (e.g., serverTimestamp()) and Timestamps.
 */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date || obj instanceof FieldValue || obj instanceof Timestamp) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (
    typeof obj === 'object' &&
    Object.prototype.toString.call(obj) === '[object Object]' &&
    (obj as { constructor?: unknown }).constructor === Object &&
    !('_methodName' in (obj as Record<string, unknown>))
  ) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value !== undefined) {
        result[key] = sanitizeForFirestore(value);
      }
    }
    return result as T;
  }
  return obj;
}

/**
 * Uploads a media File to Firebase Cloud Storage when authenticated.
 */
export async function uploadFileToFirebaseStorage(
  file: File,
  folderPath: string
): Promise<string> {
  const uid = auth.currentUser?.uid || 'anonymous';
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fullPath = `${folderPath}/${uid}/${Date.now()}_${safeName}`;
  const fileRef = storageRef(storage, fullPath);
  await uploadBytes(fileRef, file, { contentType: file.type });
  return getDownloadURL(fileRef);
}

export { onAuthStateChanged, serverTimestamp };
export type { FirebaseUser };
