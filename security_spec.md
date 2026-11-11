# MY DREAM PLACE — Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Default-Deny Catch-All:** Any collection or document path not explicitly matched is unconditionally denied (`allow read, write: if false;`).
2. **Verified Identity:** Every write operation requires an authenticated user with `request.auth != null && request.auth.token.email_verified == true`.
3. **Admin Trust Anchor:** Admin privileges are granted ONLY if `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` or the verified bootstrapped admin email (`request.auth.token.email == 'antoinejay41@gmail.com' && request.auth.token.email_verified == true`).
4. **PII Isolation (`/users/{userId}`, `/inquiries/{inquiryId}`, `/viewing_requests/{requestId}`):**
   - `/users/{userId}` can ONLY be read or updated by `request.auth.uid == userId` or `isAdmin()`. Users cannot self-assign `role: 'admin'` or mutate their `role` on update.
   - `/inquiries/{inquiryId}` and `/viewing_requests/{requestId}` contain customer PII (`customerEmail`, `customerPhone`) and can ONLY be read/listed when `resource.data.customerId == request.auth.uid || resource.data.ownerId == request.auth.uid || isAdmin()`.
5. **Property Moderation & Ownership Integrity (`/properties/{propertyId}`):**
   - Public visitors can only read/list properties where `resource.data.approvalStatus == 'approved' && resource.data.availabilityStatus != 'hidden'`.
   - Non-admin property creators MUST set `ownerId == request.auth.uid`, `approvalStatus == 'pending'`, and `featured == false`.
   - During updates by the property owner, `ownerId` and `id` are immutable, `approvalStatus` must transition to `'pending'`, and `featured` cannot be self-enabled.
6. **Strict Timestamp Integrity:** Every write operation validates `updatedAt == request.time` (and `createdAt == request.time` where applicable).

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Shadow Field Injection on Property:** `{ ...validProperty, isSuperFeatured: true }` -> Rejected by `data.keys().hasOnly(...)`.
2. **Self-Assigned Admin Role on User Creation:** `{ id: uid, role: 'admin', ... }` -> Rejected because non-admins can only create profiles with `role in ['customer', 'owner']`.
3. **Role Escalation on User Update:** Updating `role` from `'customer'` to `'admin'` -> Rejected by `incoming().role == existing().role`.
4. **Email Spoofing Attack:** `request.auth.token.email == 'antoinejay41@gmail.com'` with `email_verified: false` -> Rejected by `isSignedIn()` requiring `email_verified == true`.
5. **Owner Spoofing on Property Create:** Non-admin creating a property with `ownerId: 'someone-else'` -> Rejected by `incoming().ownerId == request.auth.uid`.
6. **Self-Approved Property Create:** Non-admin creating a property with `approvalStatus: 'approved'` -> Rejected by `incoming().approvalStatus == 'pending'`.
7. **Self-Featured Property Update:** Non-admin owner updating `featured: true` -> Rejected by `incoming().featured == existing().featured`.
8. **PII Blanket Scrape on `/users`:** Authenticated user attempting `list` on `/users` -> Rejected (`allow list: if isAdmin()`).
9. **Unauthorized Inquiry Read:** User C reading an inquiry between Customer A and Owner B -> Rejected (`existing().customerId == request.auth.uid || existing().ownerId == request.auth.uid || isAdmin()`).
10. **ID Poisoning Attack:** Creating a property with a 1,500-character document ID -> Rejected by `isValidId(id)`.
11. **Denial-of-Wallet Oversized String:** Submitting a 100 KB `description` or `initialMessage` -> Rejected by `.size() <= 5000` / `.size() <= 2000`.
12. **Unauthorized CMS Publish:** Non-admin writing to `/cms_config/published` -> Rejected (`allow write: if isAdmin()`).
