import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  User as UserIcon,
  X
} from 'lucide-react';
import { useMarketplace } from '../contexts/MarketplaceContext';
import {
  BOOTSTRAPPED_ADMIN_EMAIL,
  db,
  FirebaseUser,
  formatFirebaseAuthError,
  registerWithEmail,
  sanitizeForFirestore,
  sendPasswordReset,
  serverTimestamp,
  signInWithApplePopup,
  signInWithEmail,
  signInWithGooglePopup
} from '../lib/firebase';
import { User, UserRole } from '../types';
import { Logo } from './Logo';

export const AuthDemoModal: React.FC = () => {
  const {
    t,
    authModalMode,
    setAuthModalMode,
    currentUser,
    updateCurrentUser,
    setActiveRole,
    authorizedAdminEmails,
    firebaseUser,
    signOutFirebase,
    language,
    currency,
    favorites,
    showToast
  } = useMarketplace();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(
    authModalMode === 'register' ? 'register' : 'login'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (authModalMode) {
      setTab(authModalMode === 'register' ? 'register' : 'login');
      setAuthError(null);
      setResetSuccessMessage(null);
    }
  }, [authModalMode]);

  if (!authModalMode) return null;

  const navigateForRole = (role: UserRole) => {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'owner' || role === 'agent') {
      navigate('/dashboard/owner');
    } else {
      navigate('/dashboard/customer');
    }
  };

  /**
   * Synchronizes the authenticated Firebase user with Cloud Firestore (/users/{uid})
   * and resolves their verified role (Buyer/Renter, Owner, Agent, or Admin).
   */
  const finalizeAuthenticatedSession = async (
    fbUser: FirebaseUser,
    preferredRole: UserRole,
    isNewRegistration: boolean
  ) => {
    const cleanEmail = (fbUser.email || email).trim().toLowerCase();
    let isAuthorizedAdmin =
      cleanEmail === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase() ||
      authorizedAdminEmails.includes(cleanEmail);

    try {
      const adminSnap = await getDoc(doc(db, 'admins', fbUser.uid));
      if (adminSnap.exists()) {
        isAuthorizedAdmin = true;
      }
    } catch {
      // Ignore read check if not admin
    }

    // If user explicitly selected Admin role in Log In or Create Account, verify they are an authorized Admin
    if (preferredRole === 'admin' && !isAuthorizedAdmin) {
      await signOutFirebase();
      setAuthError(
        `Access denied: "${cleanEmail}" is not an authorized Website Administrator. Please log in with an authorized Admin email or select Buyer / Renter, Owner, or Agent.`
      );
      return;
    }

    const userRef = doc(db, 'users', fbUser.uid);
    let finalRole: UserRole = isAuthorizedAdmin
      ? preferredRole === 'admin' || !isNewRegistration
        ? 'admin'
        : preferredRole
      : preferredRole === 'admin'
        ? 'customer'
        : preferredRole;

    let finalName = (
      name.trim() ||
      fbUser.displayName ||
      cleanEmail.split('@')[0] ||
      'Verified Member'
    ).slice(0, 120);
    let finalPhone = (phone.trim() || currentUser.phone || '').slice(0, 40);

    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const existingData = userSnap.data() as Partial<User>;
        const storedRole = (existingData.role as UserRole) || 'customer';
        if (isAuthorizedAdmin) {
          finalRole =
            preferredRole === 'admin'
              ? 'admin'
              : preferredRole !== 'customer'
                ? preferredRole
                : 'admin';
        } else {
          finalRole =
            preferredRole !== 'admin'
              ? preferredRole
              : storedRole === 'admin'
                ? 'customer'
                : storedRole;
        }
        finalName = (name.trim() || existingData.name || finalName).slice(0, 120);
        finalPhone = (phone.trim() || existingData.phone || finalPhone).slice(0, 40);
      }

      await setDoc(
        userRef,
        sanitizeForFirestore({
          id: fbUser.uid,
          name: finalName,
          email: cleanEmail.slice(0, 254),
          phone: finalPhone,
          role: finalRole,
          preferredLanguage: language,
          preferredCurrency: currency,
          favorites: favorites.slice(0, 100),
          joinedDate: new Date().toISOString().split('T')[0],
          verified: true,
          updatedAt: serverTimestamp()
        }),
        { merge: true }
      );
    } catch {
      // MarketplaceContext onAuthStateChanged also syncs user profile
    }

    updateCurrentUser({
      id: fbUser.uid,
      name: finalName,
      email: cleanEmail.slice(0, 254),
      phone: finalPhone,
      role: finalRole,
      verified: true
    });
    setActiveRole(finalRole);
    setAuthModalMode(null);
    showToast(
      finalRole === 'admin'
        ? `Signed in as Administrator (${finalName}). Opening Website Control Center...`
        : isNewRegistration
          ? `Account created! Welcome, ${finalName}.`
          : `Welcome back, ${finalName}!`
    );
    navigateForRole(finalRole);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setResetSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setAuthError('Please enter both your email address and password.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    // Pre-check if user selected Admin with an unauthorized email before submitting
    if (
      selectedRole === 'admin' &&
      cleanEmail !== BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase() &&
      !authorizedAdminEmails.includes(cleanEmail)
    ) {
      setAuthError(
        `Access denied: "${cleanEmail}" is not registered as an authorized Website Administrator.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (tab === 'register') {
        const resolvedName =
          name.trim() || cleanEmail.split('@')[0] || 'Verified Member';
        const fbUser = await registerWithEmail(cleanEmail, password, resolvedName);
        await finalizeAuthenticatedSession(fbUser, selectedRole, true);
      } else {
        const fbUser = await signInWithEmail(cleanEmail, password);
        await finalizeAuthenticatedSession(fbUser, selectedRole, false);
      }
    } catch (error) {
      setAuthError(formatFirebaseAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setResetSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter the email address associated with your account.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordReset(cleanEmail);
      setResetSuccessMessage(
        `A password reset link has been sent to ${cleanEmail}. Check your inbox (and spam folder) to set a new password.`
      );
      showToast(`Password reset email sent to ${cleanEmail}`);
    } catch (error) {
      setAuthError(formatFirebaseAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleQuickAccess = async () => {
    setAuthError(null);
    setResetSuccessMessage(null);
    setIsSubmitting(true);
    try {
      const fbUser = await signInWithGooglePopup();
      await finalizeAuthenticatedSession(
        fbUser,
        selectedRole,
        tab === 'register'
      );
    } catch (error) {
      setAuthError(formatFirebaseAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppleQuickAccess = async () => {
    setAuthError(null);
    setResetSuccessMessage(null);
    setIsSubmitting(true);
    try {
      const fbUser = await signInWithApplePopup();
      await finalizeAuthenticatedSession(
        fbUser,
        selectedRole,
        tab === 'register'
      );
    } catch (error) {
      setAuthError(formatFirebaseAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={
          tab === 'login'
            ? 'Log In'
            : tab === 'register'
              ? 'Create Account'
              : 'Reset Password'
        }
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <Logo variant="mobile" />
          <button
            type="button"
            onClick={() => setAuthModalMode(null)}
            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Title & Subtitle */}
          <div className="text-center">
            <h2 className="font-display text-2xl text-[#0D0D0D]">
              {tab === 'login'
                ? 'Welcome Back'
                : tab === 'register'
                  ? 'Create Your Account'
                  : 'Reset Your Password'}
            </h2>
            <p className="mt-1 font-body text-xs text-[#737373]">
              {tab === 'forgot'
                ? 'Enter your email address and we will send you a secure link to reset your password.'
                : 'Log in with your email and password or use quick access below.'}
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-body flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-ui font-bold text-rose-900">Sign-In Error</p>
                <p>{authError}</p>
              </div>
            </div>
          )}

          {/* Password Reset Success Banner */}
          {resetSuccessMessage && (
            <div
              role="status"
              className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-body flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-ui font-bold text-emerald-950">Reset Email Sent</p>
                <p>{resetSuccessMessage}</p>
              </div>
            </div>
          )}

          {tab === 'forgot' ? (
            /* FORGOT PASSWORD VIEW */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  {t.modals.email}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    maxLength={254}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-neutral-200 text-sm font-body focus:outline-none focus:border-[#1150EF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] disabled:opacity-60 text-white font-ui text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Reset Link...' : 'Send Password Reset Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setAuthError(null);
                  setResetSuccessMessage(null);
                }}
                className="w-full h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#161616] font-ui text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Log In</span>
              </button>
            </form>
          ) : (
            /* LOG IN & REGISTER VIEWS */
            <>
              {/* Log In / Register Mode Switcher */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setAuthError(null);
                    setResetSuccessMessage(null);
                  }}
                  className={`py-2 rounded-lg font-ui text-xs font-bold transition-all cursor-pointer ${
                    tab === 'login'
                      ? 'bg-white text-[#0D0D0D] shadow-xs'
                      : 'text-[#737373] hover:text-[#0D0D0D]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setAuthError(null);
                    setResetSuccessMessage(null);
                  }}
                  className={`py-2 rounded-lg font-ui text-xs font-bold transition-all cursor-pointer ${
                    tab === 'register'
                      ? 'bg-white text-[#0D0D0D] shadow-xs'
                      : 'text-[#737373] hover:text-[#0D0D0D]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Account Role / Portal Selector (Visible in both Log In and Create Account) */}
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1.5">
                  {tab === 'login' ? 'Sign In As (Account Type)' : 'Select Account Type'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'customer', label: 'Buyer / Renter' },
                      { id: 'owner', label: 'Property Owner' },
                      { id: 'agent', label: 'Real Estate Agent' },
                      { id: 'admin', label: 'Admin (Website Editor)' }
                    ] as { id: UserRole; label: string }[]
                  ).map((roleOption) => {
                    const isAdminOption = roleOption.id === 'admin';
                    const isSelected = selectedRole === roleOption.id;
                    return (
                      <button
                        key={roleOption.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(roleOption.id);
                          setAuthError(null);
                        }}
                        className={`py-2.5 px-2.5 rounded-xl font-ui text-xs font-bold border cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? isAdminOption
                              ? 'bg-[#0D0D0D] text-white border-[#0D0D0D]'
                              : 'bg-[#1150EF] text-white border-[#1150EF]'
                            : isAdminOption
                              ? 'bg-amber-50/80 text-amber-950 border-amber-200 hover:bg-amber-100/80'
                              : 'bg-neutral-50 text-[#161616] border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {isAdminOption && <ShieldCheck className="w-3.5 h-3.5 shrink-0" />}
                        <span className="truncate">{roleOption.label}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedRole === 'admin' && (
                  <p className="mt-1.5 text-[11px] font-ui text-[#737373] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1150EF] shrink-0" />
                    <span>
                      Admin sign-in verifies your authorized email and opens the Website Control Center (<strong>/admin</strong>).
                    </span>
                  </p>
                )}
              </div>

              {/* Quick Access Buttons: Google & Apple */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-ui font-semibold uppercase tracking-wider text-[#737373] text-center">
                  Quick Access
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleGoogleQuickAccess}
                    className="h-11 px-4 rounded-xl bg-white hover:bg-neutral-50 disabled:opacity-60 text-[#161616] border border-neutral-200 font-ui text-xs font-bold inline-flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleAppleQuickAccess}
                    className="h-11 px-4 rounded-xl bg-[#0D0D0D] hover:bg-neutral-800 disabled:opacity-60 text-white font-ui text-xs font-bold inline-flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-neutral-200" />
                <span className="shrink-0 px-3 text-[11px] font-ui uppercase tracking-wider text-[#737373]">
                  Or continue with email
                </span>
                <div className="flex-grow border-t border-neutral-200" />
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3.5">
                {tab === 'register' && (
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.modals.fullName}
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        maxLength={120}
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-neutral-200 text-sm font-body focus:outline-none focus:border-[#1150EF]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    {t.modals.email}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      maxLength={254}
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-neutral-200 text-sm font-body focus:outline-none focus:border-[#1150EF]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-ui text-xs font-semibold text-[#161616]">
                      Password
                    </label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setTab('forgot');
                          setAuthError(null);
                          setResetSuccessMessage(null);
                        }}
                        className="font-ui text-xs font-bold text-[#1150EF] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder={
                        tab === 'register'
                          ? 'Create a password (min. 6 characters)'
                          : 'Enter your password'
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-10 pr-10 rounded-xl border border-neutral-200 text-sm font-body focus:outline-none focus:border-[#1150EF]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#0D0D0D] cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {tab === 'register' && (
                  <div>
                    <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                      {t.modals.phoneOptional}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        maxLength={40}
                        placeholder="+1 (809) 555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-neutral-200 text-sm font-body focus:outline-none focus:border-[#1150EF]"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full h-11 rounded-xl disabled:opacity-60 text-white font-ui text-sm font-bold cursor-pointer transition-colors shadow-xs ${
                    selectedRole === 'admin'
                      ? 'bg-[#0D0D0D] hover:bg-neutral-800'
                      : 'bg-[#1150EF] hover:bg-[#135AF3]'
                  }`}
                >
                  {isSubmitting
                    ? tab === 'login'
                      ? 'Verifying Credentials...'
                      : 'Creating Account...'
                    : tab === 'login'
                      ? selectedRole === 'admin'
                        ? 'Log In to Admin Website Editor'
                        : 'Log In'
                      : selectedRole === 'admin'
                        ? 'Create Admin Account'
                        : 'Create Account'}
                </button>
              </form>
            </>
          )}

          {/* Active Session Indicator */}
          {firebaseUser && (
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 text-xs font-ui">
              <span className="text-[#737373] truncate inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">
                  Signed in as <strong className="text-[#0D0D0D]">{firebaseUser.email}</strong>
                </span>
              </span>
              <button
                type="button"
                onClick={signOutFirebase}
                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
