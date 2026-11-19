# ANALISIS DAMPAK PERUBAHAN KEAMANAN

**Tanggal:** 20 November 2026  
**Reviewer:** Senior Fullstack Developer  
**Repositori Terkait:**
- `admin.kkpus.id` (Frontend Admin) — ✅ Current repo
- `api.kkpus.id` (Backend API) — ⚠️ Perlu koordinasi
- `kkpus.id` (Frontend Public) — ℹ️ Perlu dicek

---

## 1. Ringkasan Eksekutif

| Repositori | Dampak | Status | Aksi Diperlukan |
|------------|:------:|:------:|-----------------|
| **admin.kkpus.id** (Frontend Admin) | 🟡 Sedang | ✅ Sudah diperbaiki | Lanjut testing |
| **api.kkpus.id** (Backend API) | 🔴 Tinggi | ❌ Belum | Implementasi JWT + Cookie |
| **kkpus.id** (Frontend Public) | 🟡 Sedang | ⬜ Belum dicek | Audit serupa |

---

## 2. Perubahan yang Sudah Dilakukan (admin.kkpus.id)

### ✅ Frontend-Only Fixes (Tidak Butuh Backend)

| # | Perubahan | File | Dampak ke Backend |
|---|-----------|------|-------------------|
| 1 | Sanitasi `document.write()` | `TransactionDetailModal.jsx` | ❌ Tidak ada |
| 2 | ErrorBoundary component | `App.jsx`, `ErrorBoundary.jsx` | ❌ Tidak ada |
| 3 | Constants extraction | `constants/app.js` | ❌ Tidak ada |
| 4 | JSON.parse try-catch | 5 approval modals | ❌ Tidak ada |

**Kesimpulan:** Perubahan di atas **TIDAK** mempengaruhi backend API.

---

## 3. Perubahan yang Memerlukan Backend (api.kkpus.id)

### 🔴 KRITIS — JWT Signature

**Masalah:**
```javascript
// src/utils/helpers/index.js:19
const header = { alg: "none", typ: "JWT", ver: "1.0" };
return `${encode(header)}.${encode(data)}.`;
```

**Dampak ke Backend:**
- Backend saat ini **MUNGKIN** menerima token tanpa signature
- Tidak ada verifikasi integritas token
- Risk: Token dapat dipalsukan

**Konteks Penting:**
```javascript
// Token ini digunakan untuk ROUTING, bukan AUTH
// Contoh: "/authLogin" -> "/eyJwYWdlIjoiYXV0aExvZ2luIn0."
// Token auth sebenarnya ada di localStorage.getItem("token")
```

**Verifikasi yang Diperlukan di Backend:**

1. **Cek middleware auth** di `api.kkpus.id`:
```javascript
// Apakah backend sudah verify JWT signature?
// Atau hanya decode payload tanpa verify?
```

2. **Cek endpoint login**:
```javascript
// Apakah backend generate JWT dengan signature?
// Atau frontend yang generate token sendiri?
```

**Perubahan yang Diperlukan di Backend:**

**Opsi A — Backend Generate JWT (Recommended):**
```javascript
// Backend: middleware/auth.js
const jwt = require('jsonwebtoken');

// Generate token saat login
app.post('/api/auth/login', async (req, res) => {
  // ... validate credentials ...
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token, userData });
});

// Verify token di middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

**Opsi B — Frontend Generate JWT dengan Signature:**
```javascript
// Frontend: src/utils/helpers/index.js
import { SignJWT } from 'jose';

export const jwtEncode = async (payload, options = {}) => {
  const secret = new TextEncoder().encode(process.env.VITE_JWT_SECRET);
  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
  return jwt;
};
```

**⚠️ WARNING:** Opsi B **TIDAK AMAN** — secret akan terekspos di client!

**Rekomendasi:**
- Gunakan **Opsi A** (backend generate JWT)
- Frontend hanya attach token di headers
- Backend verify signature di setiap request

---

### 🔴 KRITIS — HttpOnly Cookie

**Masalah Saat Ini:**
```javascript
// src/utils/api/common.js:18
const token = localStorage.getItem("token");
```

**Dampak ke Backend:**
- Token disimpan di localStorage (rentan XSS)
- Frontend attach token di `Authorization: Bearer` header
- Tidak ada CSRF protection

**Perubahan yang Diperlukan di Backend:**

**1. Setup HttpOnly Cookie:**
```javascript
// Backend: middleware/auth.js
app.post('/api/auth/login', async (req, res) => {
  // ... validate credentials ...
  
  res.cookie('token', token, {
    httpOnly: true,      // Tidak bisa diakses JavaScript
    secure: true,        // HTTPS only
    sameSite: 'strict',  // CSRF protection
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  res.json({ success: true });
});
```

**2. Read Token dari Cookie:**
```javascript
// Backend: middleware/auth.js
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Dari cookie, bukan header
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  // ... verify token ...
};
```

**3. CSRF Token:**
```javascript
// Backend: middleware/csrf.js
const csrfProtection = csrf({ cookie: true });

app.post('/api/protected-endpoint', csrfProtection, (req, res) => {
  // ... handle request ...
});
```

**Perubahan di Frontend:**
```javascript
// Frontend: src/utils/api/common.js
// Hapus manual token attachment
api.interceptors.request.use((config) => {
  // Token otomatis dikirim via cookie
  // withCredentials: true sudah di-set
  return config;
});
```

---

## 4. Dampak ke kkpus.id (Frontend Public)

### Analisis Awal

**Frontend public (`kkpus.id`) kemungkinan:**
- Menggunakan auth pattern yang sama
- Menyimpan token di localStorage
- Menggunakan `jwtEncode` untuk routing

**File yang Perlu Dicek di `kkpus.id`:**

```bash
# Cek pola serupa
grep -r "localStorage.getItem.*token" src/
grep -r "jwtEncode\|jwtDecode" src/
grep -r "Authorization.*Bearer" src/
```

**Kemungkinan Dampak:**

| Area | Dampak | Perubahan Diperlukan |
|------|--------|---------------------|
| Auth flow | 🟡 Sedang | Update ke cookie-based auth |
| Routing | 🟢 Rendah | Token routing tidak berubah |
| API calls | 🟡 Sedang | Remove manual token attachment |

---

## 5. Matriks Dampak Lengkap

### Frontend Admin (admin.kkpus.id)

| Komponen | Status | Perubahan | Dampak |
|----------|:------:|-----------|--------|
| `TransactionDetailModal` | ✅ Fixed | Sanitized print | Tidak ada ke backend |
| `ErrorBoundary` | ✅ Fixed | New component | Tidak ada ke backend |
| `constants/app.js` | ✅ Fixed | Extract constants | Tidak ada ke backend |
| `jwtEncode` (routing) | ⚠️ Pending | alg: none | Backend harus verify |
| `localStorage` token | ⚠️ Pending | Insecure storage | Backend harus support cookie |
| API interceptor | ⚠️ Pending | Bearer token | Backend harus accept cookie |

### Backend API (api.kkpus.id)

| Komponen | Status | Perubahan Diperlukan | Prioritas |
|----------|:------:|---------------------|-----------|
| JWT generation | ⬜ Belum | Generate signed JWT | 🔴 Kritis |
| JWT verification | ⬜ Belum | Verify signature | 🔴 Kritis |
| Cookie auth | ⬜ Belum | HttpOnly cookie | 🔴 Kritis |
| CSRF protection | ⬜ Belum | CSRF middleware | 🟡 Tinggi |
| Session management | ⬜ Belum | Secure session handling | 🟡 Tinggi |

### Frontend Public (kkpus.id)

| Komponen | Status | Perubahan Diperlukan | Prioritas |
|----------|:------:|---------------------|-----------|
| Auth pattern | ⬜ Belum dicek | Audit serupa admin | 🟡 Tinggi |
| Token storage | ⬜ Belum dicek | Migrate to cookie | 🔴 Kritis |
| API calls | ⬜ Belum dicek | Remove manual token | 🟡 Tinggi |

---

## 6. Rencana Koordinasi

### Fase 1 — Backend Implementation (api.kkpus.id)

**Week 1:**
- [ ] Implement JWT signature (HS256 minimum)
- [ ] Setup HttpOnly cookie middleware
- [ ] Add CSRF protection
- [ ] Update login endpoint
- [ ] Update auth middleware

**Week 2:**
- [ ] Test JWT flow end-to-end
- [ ] Security audit backend
- [ ] Update API documentation
- [ ] Deploy to staging

### Fase 2 — Frontend Updates (admin.kkpus.id)

**Week 3:**
- [ ] Remove `localStorage` token usage
- [ ] Update API interceptor (cookie-based)
- [ ] Add CSRF token handling
- [ ] Test auth flow

**Week 4:**
- [ ] Security testing
- [ ] Penetration testing
- [ ] Deploy to production

### Fase 3 — Frontend Public (kkpus.id)

**Week 5:**
- [ ] Audit auth pattern
- [ ] Implement cookie-based auth
- [ ] Test end-to-end
- [ ] Deploy

---

## 7. Breaking Changes

### Yang Akan Berubah (Setelah Backend Update)

**1. Login Flow:**
```javascript
// BEFORE (current)
const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('userData', JSON.stringify(res.data.userData));
};

// AFTER (cookie-based)
const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  // Token otomatis di cookie (HttpOnly)
  // userData mungkin masih di localStorage untuk UI
};
```

**2. API Interceptor:**
```javascript
// BEFORE (current)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AFTER (cookie-based)
api.interceptors.request.use((config) => {
  // Token otomatis dikirim via cookie
  // withCredentials: true sudah di-set di axios create
  return config;
});
```

**3. Logout:**
```javascript
// BEFORE (current)
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  navigate('/login');
};

// AFTER (cookie-based)
const logout = async () => {
  await api.post('/auth/logout'); // Backend clear cookie
  localStorage.removeItem('userData'); // UI data only
  navigate('/login');
};
```

### Yang Tidak Berubah

**1. Token Routing (jwtEncode untuk navigasi):**
```javascript
// Tetap sama — ini bukan auth token
navigate(`/${jwtEncode({ page: 'dashboard' })}`);
```

**2. API Endpoints:**
```javascript
// Path endpoint tidak berubah
api.get('/savings/admin-summary');
api.post('/billing/create-voluntary-bill');
```

**3. Response Format:**
```javascript
// Structure response tidak berubah
{
  status: true,
  data: { ... },
  message: "..."
}
```

---

## 8. Rollback Plan

### Jika Backend Changes Bermasalah

**Scenario 1 — JWT Signature Bermasalah:**
```javascript
// Backend: Fallback ke alg: none (temporary)
// ROLLBACK: Revert ke previous commit
// Downtime: < 5 minutes
```

**Scenario 2 — Cookie Auth Bermasalah:**
```javascript
// Backend: Fallback ke header-based auth
// ROLLBACK: Revert auth middleware
// Downtime: < 10 minutes
```

**Scenario 3 — CSRF Protection Bermasalah:**
```javascript
// Backend: Disable CSRF (temporary)
// ROLLBACK: Remove CSRF middleware
// Downtime: < 5 minutes
```

### Frontend Rollback

```bash
# Revert frontend changes
git revert 8a7cf6d  # Security fixes commit
git push origin rollback/2026-11-02
```

---

## 9. Testing Checklist

### Backend Testing (api.kkpus.id)

**Unit Tests:**
- [ ] JWT sign & verify
- [ ] Cookie set & read
- [ ] CSRF token validation
- [ ] Auth middleware

**Integration Tests:**
- [ ] Login → cookie set
- [ ] Protected endpoint → cookie verify
- [ ] Logout → cookie clear
- [ ] CSRF token flow

**Security Tests:**
- [ ] XSS (token tidak accessible)
- [ ] CSRF (token required)
- [ ] JWT tampering (signature verify)

### Frontend Testing (admin.kkpus.id)

**Functional Tests:**
- [ ] Login success → redirect
- [ ] Protected page → auth required
- [ ] Logout → clear session
- [ ] API call → cookie sent

**Security Tests:**
- [ ] localStorage tidak ada token
- [ ] Document.cookie tidak ada token (HttpOnly)
- [ ] Print function → sanitized output

---

## 10. Kesimpulan

### Dampak Saat Ini

| Repositori | Dampak | Status |
|------------|:------:|:------:|
| **admin.kkpus.id** | 🟢 Rendah | ✅ Security fixes deployed (frontend-only) |
| **api.kkpus.id** | 🔴 Tinggi | ❌ Belum ada perubahan |
| **kkpus.id** | 🟡 Sedang | ⬜ Belum diaudit |

### Yang Sudah Aman (Tanpa Backend)

- ✅ XSS via print function — mitigated
- ✅ App crash — ErrorBoundary added
- ✅ JSON.parse crash — try-catch added
- ✅ Magic numbers — constants extracted

### Yang Masih Rentan (Butuh Backend)

- ❌ JWT tanpa signature — token dapat dipalsukan
- ❌ Token di localStorage — XSS dapat mencuri
- ❌ Tidak ada CSRF protection — CSRF attack possible

### Rekomendasi Immediate

1. **Audit `api.kkpus.id`** — Cek JWT & auth middleware
2. **Koordinasi backend team** — Plan JWT + cookie implementation
3. **Audit `kkpus.id`** — Cek auth pattern serupa
4. **Security testing** — Penetration test setelah backend update

---

**Disusun oleh:** Senior Fullstack Developer — Skill `/full`  
**Tanggal:** 20 November 2026  
**Next Action:** Audit `api.kkpus.id` untuk JWT & auth implementation
