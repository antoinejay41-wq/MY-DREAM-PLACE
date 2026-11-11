import { getApps, initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  OAuthProvider,
  User as FirebaseUser,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
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
import firebaseAppletConfig from '../../firebase-applet-config.json';

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};

export const resolvedFirebaseConfig = {
  apiKey: (env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey || '').trim(),
  authDomain: (env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || '').trim(),
  projectId: (env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || '').trim(),
  storageBucket: (
    env.VITE_FIREBASE_STORAGE_BUCKET ||
    firebaseAppletConfig.storageBucket ||
    ''
  ).trim(),
  messagingSenderId: (
    env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    firebaseAppletConfig.messagingSenderId ||
    ''
  ).trim(),
  appId: (env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId || '').trim(),
  firestoreDatabaseId: (
    env.VITE_FIREBASE_DATABASE_ID ||
    firebaseAppletConfig.firestoreDatabaseId ||
    '(default)'
  ).trim()
};

const app =
  getApps().length > 0 ? getApps()[0] : initializeApp(resolvedFirebaseConfig);

export const db = getFirestore(app, resolvedFirebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Ensure auth state persists across page reloads and OAuth redirects in production
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase Auth persistence warning:', err);
});

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
    tenantId?: boolean | string | null;
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

export function extractFirebaseErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const rawCode = String((error as { code?: unknown }).code || '');
    if (rawCode) return rawCode;
  }
  const message = error instanceof Error ? error.message : String(error);
  const match = message.match(/\((auth\/[^)]+)\)/);
  if (match && match[1]) {
    return match[1];
  }
  if (message.includes('API_KEY_HTTP_REFERRER_BLOCKED') || message.includes('requests-from-referer')) {
    return 'auth/requests-from-referer-blocked';
  }
  if (message.includes('CONFIGURATION_NOT_FOUND')) {
    return 'auth/configuration-not-found';
  }
  return 'auth/unknown-error';
}

export async function signInWithGooglePopup(): Promise<FirebaseUser> {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
  } catch (error) {
    const code = extractFirebaseErrorCode(error);
    if (code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, googleProvider);
      throw new Error('Redirecting to Google Sign-In... (auth/popup-blocked)');
    }
    throw error;
  }
}

export async function signInWithApplePopup(): Promise<FirebaseUser> {
  try {
    const credential = await signInWithPopup(auth, appleProvider);
    return credential.user;
  } catch (error) {
    const code = extractFirebaseErrorCode(error);
    if (code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, appleProvider);
      throw new Error('Redirecting to Apple Sign-In... (auth/popup-blocked)');
    }
    throw error;
  }
}

export async function checkRedirectSignInResult(): Promise<FirebaseUser | null> {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.error('[Firebase Redirect Auth Error]', error);
    return null;
  }
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
  const code = extractFirebaseErrorCode(error);
  const message = error instanceof Error ? error.message : String(error);
  const currentHost =
    typeof window !== 'undefined' ? window.location.hostname : 'your Vercel domain';

  console.error('[Firebase Auth Diagnostic]', {
    code,
    message,
    host: currentHost,
    projectId: resolvedFirebaseConfig.projectId,
    authDomain: resolvedFirebaseConfig.authDomain
  });

  if (code === 'auth/unauthorized-domain' || message.includes('auth/unauthorized-domain')) {
    return `Domain not authorized in Firebase (${currentHost}). Add "${currentHost}" in Firebase Console → Authentication → Settings → Authorized domains. [Code: ${code}]`;
  }
  if (
    code === 'auth/requests-from-referer-blocked' ||
    message.includes('API_KEY_HTTP_REFERRER_BLOCKED') ||
    message.includes('requests-from-referer')
  ) {
    return `Firebase API Key HTTP Referrer restriction blocked "${currentHost}". Allow "https://${currentHost}/*" in Google Cloud Console → APIs & Services → Credentials. [Code: ${code}]`;
  }
  if (
    code === 'auth/api-key-not-valid' ||
    code === 'auth/invalid-api-key' ||
    message.includes('api-key-not-valid')
  ) {
    return `Invalid or missing Firebase API Key in production environment variables. Check VITE_FIREBASE_API_KEY in Vercel. [Code: ${code}]`;
  }
  if (
    code === 'auth/operation-not-allowed' ||
    code === 'auth/configuration-not-found' ||
    message.includes('auth/operation-not-allowed') ||
    message.includes('CONFIGURATION_NOT_FOUND')
  ) {
    return `This sign-in provider is not enabled yet in Firebase Console. Enable both "Google" and "Email/Password" in Firebase Console → Authentication → Sign-in method. [Code: ${code}]`;
  }
  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found' ||
    message.includes('auth/invalid-credential') ||
    message.includes('auth/wrong-password')
  ) {
    return `Incorrect email or password (or this email has not set a password yet). Use "Create Account" if registering for the first time, click "Forgot password?" to set a password, or sign in with Google. [Code: ${code}]`;
  }
  if (code === 'auth/email-already-in-use' || message.includes('auth/email-already-in-use')) {
    return `An account with this email already exists. Switch to "Log In" or click "Forgot password?" to reset your password. [Code: ${code}]`;
  }
  if (code === 'auth/weak-password' || message.includes('auth/weak-password')) {
    return `Password is too weak. Please enter at least 6 characters. [Code: ${code}]`;
  }
  if (code === 'auth/invalid-email' || message.includes('auth/invalid-email')) {
    return `Please enter a valid email address. [Code: ${code}]`;
  }
  if (code === 'auth/too-many-requests' || message.includes('auth/too-many-requests')) {
    return `Too many failed attempts. Please wait a moment or reset your password. [Code: ${code}]`;
  }
  if (
    code === 'auth/popup-closed-by-user' ||
    code === 'auth/cancelled-popup-request' ||
    message.includes('auth/popup-closed-by-user')
  ) {
    return `Sign-in popup window was closed before completing authentication. [Code: ${code}]`;
  }
  if (code === 'auth/popup-blocked' || message.includes('auth/popup-blocked')) {
    return `Popup was blocked by your browser. Redirecting to sign-in page... [Code: ${code}]`;
  }
  if (code === 'auth/network-request-failed' || message.includes('auth/network-request-failed')) {
    return `Network request to Firebase Auth failed from "${currentHost}". Verify your internet connection, ad-blocker settings, and API Key referrer restrictions. [Code: ${code}]`;
  }

  return `Authentication failed: ${message} [Code: ${code}]`;
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
