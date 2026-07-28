# Hotel Bee — Frontend Integration Guide

> How to build a frontend (React/Next.js) that consumes this API.

---

## 1. Project Setup

```bash
npx create-next-app@latest hotel-bee-frontend --ts --app --tailwind
cd hotel-bee-frontend
npm install axios js-cookie
```

---

## 2. API Client (axios instance)

Create `lib/api.ts` — this is the single entry point for all HTTP calls:

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,  // CRITICAL: sends HTTP-only cookie with every request
  headers: { 'Content-Type': 'application/json' },
});

// Global error interceptor
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export default api;
```

> **Why `withCredentials: true`?**
> The JWT lives in an HTTP-only cookie. Without this flag, the browser won't send the cookie cross-origin and every admin request will get a 401.

---

## 3. Environment

Create `.env.local` in your frontend project:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
```

---

## 4. Authentication Flow

### 4.1 Login

```ts
// services/auth.service.ts
import api from '@/lib/api';

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const logout = () => api.post('/auth/logout');

export const getMe = () => api.get('/auth/me');
```

### 4.2 Auth Context (React)

```tsx
// context/AuthContext.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getMe } from '@/services/auth.service';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res: any) => setAdmin(res.data.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ admin, setAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 4.3 Login Page

```tsx
// app/admin/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAdmin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res: any = await login(email, password);
      setAdmin(res.data.admin);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### 4.4 Protected Route Middleware

```ts
// middleware.ts (Next.js root)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get('hotel_bee_token'); // must match COOKIE_NAME in .env
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute && !cookie) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
```

---

## 5. Public Pages

### 5.1 Home Page

```ts
// services/home.service.ts
import api from '@/lib/api';

export const getHome = () => api.get('/home');
export const getAbout = () => api.get('/about');
export const getContact = () => api.get('/contact');
export const getSettings = () => api.get('/settings');
```

```tsx
// app/page.tsx
import { getHome } from '@/services/home.service';

export default async function HomePage() {
  const res: any = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/home`,
    { next: { revalidate: 60 } } // ISR: refresh every 60 seconds
  );
  const { data } = await res.json();
  const home = data.home;

  return (
    <main>
      <h1>{home?.tagline}</h1>
      <p>{home?.subtitle}</p>
    </main>
  );
}
```

### 5.2 Restaurant Menu Page

```tsx
// app/menu/page.tsx
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/restaurant/categories').then((res: any) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set('categoryId', activeCategory);
    if (search) params.set('search', search);
    api.get(`/restaurant/menu?${params}`).then((res: any) => setItems(res.data.items));
  }, [activeCategory, search]);

  return (
    <div>
      <input
        placeholder="Search dishes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div>
        {categories.map((c: any) => (
          <button key={c._id} onClick={() => setActiveCategory(c._id)}>{c.name}</button>
        ))}
      </div>
      <div>
        {items.map((item: any) => (
          <div key={item._id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
            {item.veg && <span>🟢 Veg</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5.3 Event Registration

```tsx
// app/events/[id]/register/page.tsx
'use client';
import { useState } from 'react';
import api from '@/lib/api';

export default function RegisterPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', numberOfGuests: 1 });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const checkAvailability = async () => {
    const res: any = await api.get(`/events/${params.id}/availability`);
    return res.data.availability;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const avail = await checkAvailability();
      if (avail.isFull) { setError('This event is fully booked.'); return; }
      if (avail.deadlinePassed) { setError('Registration deadline has passed.'); return; }

      const res: any = await api.post(`/events/${params.id}/register`, form);
      setResult(res.data.registration);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (result) return (
    <div>
      <h2>✅ Registration Successful!</h2>
      <p>Reference: <strong>{result.referenceNumber}</strong></p>
      <p>Keep this number for future queries.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Your Name" onChange={e => setForm({...form, customerName: e.target.value})} required />
      <input placeholder="Phone" onChange={e => setForm({...form, phone: e.target.value})} required />
      <input placeholder="Email" type="email" onChange={e => setForm({...form, email: e.target.value})} required />
      <input type="number" min={1} value={form.numberOfGuests} onChange={e => setForm({...form, numberOfGuests: +e.target.value})} />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Register</button>
    </form>
  );
}
```

### 5.4 Banquet Booking Form

```tsx
'use client';
import { useState } from 'react';
import api from '@/lib/api';

export default function BookingForm({ hallId }: { hallId: string }) {
  const [form, setForm] = useState({
    customerName: '', phone: '', email: '',
    eventType: '', date: '', time: '', numberOfGuests: 1, notes: ''
  });
  const [ref, setRef] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await api.post('/banquet/book', { ...form, hall: hallId });
      setRef(res.data.booking.referenceNumber);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (ref) return <p>Booking submitted! Reference: <strong>{ref}</strong></p>;

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={e => setForm({...form, customerName: e.target.value})} required />
      <input placeholder="Phone" onChange={e => setForm({...form, phone: e.target.value})} required />
      <input placeholder="Email" type="email" onChange={e => setForm({...form, email: e.target.value})} required />
      <input placeholder="Event Type (e.g. Wedding)" onChange={e => setForm({...form, eventType: e.target.value})} required />
      <input type="date" onChange={e => setForm({...form, date: e.target.value})} required />
      <input placeholder="Time" onChange={e => setForm({...form, time: e.target.value})} required />
      <input type="number" min={1} placeholder="Guests" onChange={e => setForm({...form, numberOfGuests: +e.target.value})} />
      <textarea placeholder="Notes" onChange={e => setForm({...form, notes: e.target.value})} />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Submit Booking</button>
    </form>
  );
}
```

### 5.5 Contact Form

```tsx
'use client';
import { useState } from 'react';
import api from '@/lib/api';

export default function ContactForm() {
  const [form, setForm] = useState({ customerName: '', email: '', phone: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/contact/inquiry', form);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (success) return <p>✅ Message sent! We'll get back to you soon.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={e => setForm({...form, customerName: e.target.value})} required />
      <input placeholder="Email" type="email" onChange={e => setForm({...form, email: e.target.value})} required />
      <input placeholder="Phone (optional)" onChange={e => setForm({...form, phone: e.target.value})} />
      <input placeholder="Subject" onChange={e => setForm({...form, subject: e.target.value})} required />
      <textarea placeholder="Message" onChange={e => setForm({...form, message: e.target.value})} required />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Send Message</button>
    </form>
  );
}
```

---

## 6. File Uploads (Multipart)

For any endpoint that accepts images, use `FormData`:

```ts
// Upload a gallery image
const uploadGalleryItem = async (file: File, title: string, type: 'image' | 'video') => {
  const form = new FormData();
  form.append('media', file);
  form.append('type', type);
  form.append('title', title);

  return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, form, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
```

> When using `FormData`, do **not** set `Content-Type: application/json`. Let the browser set it automatically with the boundary string.

---

## 7. Admin Dashboard Page

```tsx
// app/admin/dashboard/page.tsx
import api from '@/lib/api';

async function getOverview() {
  const res: any = await api.get('/dashboard/overview');
  return res.data.overview;
}

export default async function DashboardPage() {
  const overview = await getOverview();

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Total Bookings" value={overview.totalBookings} />
      <StatCard label="Pending Bookings" value={overview.pendingBookings} />
      <StatCard label="Unread Messages" value={overview.unreadContactInquiries} />
      <StatCard label="Upcoming Events" value={overview.upcomingEvents} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
```

---

## 8. Suggested Frontend Page Map

| Page | Route | API Calls |
|---|---|---|
| Home | `/` | `GET /home`, `GET /settings` |
| About | `/about` | `GET /about` |
| Menu | `/menu` | `GET /restaurant/categories`, `GET /restaurant/menu` |
| Banquet Halls | `/banquet` | `GET /banquet/halls` |
| Banquet Booking | `/banquet/book` | `POST /banquet/book` |
| Catering | `/catering` | `GET /catering/packages` |
| Catering Inquiry | `/catering/inquiry` | `POST /catering/inquiry` |
| Gallery | `/gallery` | `GET /gallery` |
| Events | `/events` | `GET /events`, `GET /events/upcoming` |
| Event Detail | `/events/:id` | `GET /events/:id`, `GET /events/:id/availability` |
| Event Register | `/events/:id/register` | `POST /events/:id/register` |
| Reviews | `/reviews` | `GET /reviews?approved=true` |
| Contact | `/contact` | `GET /contact`, `POST /contact/inquiry` |
| Branches | `/branches` | `GET /branches?isActive=true` |
| Admin Login | `/admin/login` | `POST /auth/login` |
| Admin Dashboard | `/admin/dashboard` | `GET /dashboard/overview` |
| Admin Bookings | `/admin/bookings` | `GET /banquet/bookings` |
| Admin Inquiries | `/admin/inquiries` | `GET /contact/inquiries`, `GET /catering/inquiries` |
| Admin Events | `/admin/events` | Full CRUD on `/events` + `/events/registrations` |
| Admin Gallery | `/admin/gallery` | Full CRUD on `/gallery` |
| Admin Reviews | `/admin/reviews` | `GET /reviews?approved=false`, `PUT /reviews/:id/approve` |
| Admin Settings | `/admin/settings` | `GET/PUT /settings` |

---

## 9. CORS — Important

Your frontend origin must exactly match `CLIENT_URL` in the backend `.env`:

```env
# Backend .env
CLIENT_URL=http://localhost:3000   # development
CLIENT_URL=https://your-site.com   # production
```

If the origins don't match, the browser will block cookies and all requests will get 401.

---

## 10. Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| 401 on admin routes | Cookie not sent | Add `withCredentials: true` to axios |
| CORS error | `CLIENT_URL` mismatch | Match exactly, no trailing slash |
| 400 Validation | Wrong field names or types | Check Zod schemas in `/src/validators/` |
| 409 Conflict | Hall already booked | Show conflict message from `err.response.data.message` |
| Upload fails | Wrong Content-Type | Use `FormData`, don't set Content-Type manually |
| Login works but routes 401 | Cookie domain mismatch | In dev: both must be `localhost` |
