# UrbanKey - AI-Powered Rental Platform

## 📋 Overview

UrbanKey is India's first **AI-powered, broker-free rental platform** connecting verified tenants directly with verified landlords. The platform leverages cutting-edge AI technology (RAG - Retrieval Augmented Generation) to provide intelligent property search, digital agreements, and seamless communication.

#### 📄 _For complete project documentation, please refer to the Synopsis._

[Synopsis](./Synopsis.docx)

## ✨ Key Features

### 🔍 AI-Powered Search

- **Semantic Search:** Natural language property discovery using RAG.
- **Vector Embeddings:** pgvector for intelligent property matching.
- **Smart Recommendations:** Personalized property suggestions.

### 📄 Digital Agreements

- **Instant PDF Generation:** Auto-generated rent agreements.
- **E-Signature Support:** Legally binding digital signatures.
- **Document Templates:** Customizable terms and conditions.

### 🏠 Property Management

- **Zero Brokerage:** Direct owner listings.
- **Aadhar Verification:** Secure KYC for all users.
- **Metro Distance Calculator:** Location-based search.

### 💬 Communication

- **WhatsApp Integration:** Direct chat with property owners.
- **Visit Scheduling:** Book property tours online.
- **Real-time Notifications:** Instant updates.

### 📊 Analytics & Tracking

- **Property Analytics:** Views, leads, and visit tracking.
- **Payment Management:** Rent and deposit tracking.
- **Dashboard Insights:** Data-driven decisions.

---

## 🏗️ Architecture

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** Redux Toolkit
- **Authentication:** Clerk

### Backend

- **Runtime:** Node.js 20
- **Framework:** Express.js 5
- **ORM:** Prisma 7
- **Database:** PostgreSQL 15 + pgvector
- **Authentication:** Clerk JWT
- **AI Integration:** Google Gemini API

### Infrastructure

- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** Supabase
- **Storage:** Supabase Storage
- **Email:** Resend

---

## 📁 Project Structure

```text
UrbanKey/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and API clients
│   │   └── state/         # Redux store
│   └── public/            # Static assets
│
├── server/                # Express backend application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   ├── validations/   # Input validation
│   │   └── docs/          # OpenAPI documentation
│   └── prisma/            # Database schema
│
└── docs/                  # Documentation
```

## 🚀 Live URLs

| Environment              | URL                                         | Status   |
| ------------------------ | ------------------------------------------- | -------- |
| Frontend (Production)    | https://urbankey.vercel.app                 | 🟢 Live  |
| Backend API (Production) | https://urbankey-hod8.onrender.com          | 🟢 Live  |
| API Documentation        | https://urbankey-hod8.onrender.com/api/docs | 🟢 Live  |
| Development              | http://localhost:3000                       | 🔵 Local |
| Backend Dev              | http://localhost:5000                       | 🔵 Local |

## 🛠️ Tech Stack Details

### Frontend Technologies

| Technology      | Version | Purpose                  |
| --------------- | ------- | ------------------------ |
| Next.js         | 14      | React framework with SSR |
| TypeScript      | 5.0     | Type safety              |
| Tailwind CSS    | 3.4     | Styling                  |
| Shadcn UI       | Latest  | UI components            |
| Clerk           | Latest  | Authentication           |
| Framer Motion   | 10.16   | Animations               |
| Redux Toolkit   | 1.9     | State management         |
| React Hook Form | 7.45    | Form handling            |
| Zod             | 3.22    | Validation               |

### Backend Technologies

| Technology    | Version | Purpose          |
| ------------- | ------- | ---------------- |
| Node.js       | 20      | Runtime          |
| Express       | 5.0     | Web framework    |
| TypeScript    | 5.0     | Type safety      |
| Prisma        | 7.0     | ORM              |
| PostgreSQL    | 15      | Database         |
| pgvector      | Latest  | Vector search    |
| Google Gemini | Latest  | AI embeddings    |
| Clerk         | Latest  | JWT verification |
| Supabase      | Latest  | Storage          |
| Resend        | Latest  | Email            |

## 🔐 Security Features

- **JWT Authentication**: Clerk-powered secure authentication
- **Role-Based Access Control**: Tenant, Landlord, Admin roles
- **Rate Limiting**: Prevents DDoS and brute force
- **Helmet.js**: Security headers
- **CORS Protection**: Configured allowed origins
- **Input Validation**: express-validator
- **SQL Injection Prevention**: Prisma ORM
- **XSS Protection**: Input sanitization
- **HSTS**: HTTPS enforcement

---

## 📊 Database Schema

### Core Models

| Model             | Description                            |
| ----------------- | -------------------------------------- |
| User              | Platform users (Tenant/Landlord/Admin) |
| Property          | Rental property listings               |
| PropertyImage     | Property images                        |
| Wishlist          | Saved properties                       |
| Lead              | Tenant enquiries                       |
| VisitSchedule     | Property visit bookings                |
| RentalAgreement   | Lease agreements                       |
| Payment           | Rent payment tracking                  |
| AnalyticsEvent    | Platform analytics                     |
| PropertyEmbedding | Vector embeddings for AI search        |
| ChatHistory       | AI chat conversations                  |

---

## 🔄 API Endpoints

### Public Routes

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| GET    | /health                  | Health check        |
| GET    | /api/properties          | List properties     |
| GET    | /api/properties/semantic | AI semantic search  |
| GET    | /api/properties/stats    | Platform statistics |
| GET    | /api/properties/:id      | Property details    |

### Protected Routes

| Method | Endpoint                  | Role     |
| ------ | ------------------------- | -------- |
| GET    | /api/users/me             | All      |
| PUT    | /api/users/me             | All      |
| POST   | /api/leads                | Tenant   |
| POST   | /api/visits               | Tenant   |
| POST   | /api/wishlist/:propertyId | Tenant   |
| POST   | /api/properties           | Landlord |
| PUT    | /api/properties/:id       | Landlord |
| GET    | /api/admin/\*             | Admin    |

📖 **Complete API documentation available at:** `/api/docs`

## 🧪 Testing

```Bash
Backend Testing
Bash
cd server
npm run test
Frontend Testing
Bash
cd client
npm run test
```

## 🚀 Deployment

```Bash
Frontend (Vercel)
Bash
cd client
npm run build
vercel --prod
Backend (Render)
Bash
cd server
npm run build
```

# Push to GitHub - Render auto-deploys

## ⚙️ Environment Variables

Frontend (.env.local)

```Code snippet
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
NEXT_PUBLIC_API_BASE_URL=[https://api.urbankey.com/api](https://api.urbankey.com/api)
NEXT_PUBLIC_MAPBOX_TOKEN=pk_xxx
NEXT_PUBLIC_SUPABASE_URL=[https://xxx.supabase.co](https://xxx.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

Backend (.env)

```Code snippet
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_xxx
GEMINI_API_KEY=xxx
SUPABASE_URL=[https://xxx.supabase.co](https://xxx.supabase.co)
SUPABASE_SERVICE_ROLE_KEY=xxx
RESEND_API_KEY=re_xxx
MAPBOX_TOKEN=pk_xxx
FRONTEND_URL=[https://urbankey.vercel.app](https://urbankey.vercel.app)
```

## 👥 User Roles

### Tenant

- Search and filter properties

- Save favorites to wishlist

- Schedule property visits

- Send enquiries to landlords

- Sign digital agreements

- Track rent payments

### Landlord

- List and manage properties

- View and manage leads

- Create rental agreements

- Track payments

- Schedule property visits

### Admin

- Verify user documents

- Manage properties

- Manage users

- Platform analytics

- AI insights dashboard

## 📈 Key Metrics

| Metric                | Current |
| --------------------- | ------- |
| Properties Listed     | 50+     |
| Registered Users      | 25+     |
| Successful Agreements | 5+      |
| API Response Time     | <500ms  |
| Uptime                | 99.9%   |

## 🤝 Contributing

1. Fork the repository

2. Create your feature branch (git checkout -b feature/AmazingFeature)

3. Commit your changes (git commit -m 'Add some AmazingFeature')

4. Push to the branch (git push origin feature/AmazingFeature)

5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Email: support@urbankey.com

Website: https://urban-key-one.vercel.app

GitHub: https://github.com/md-danishraza/urbankey

## 🙏 Acknowledgments

Clerk - Authentication

Supabase - Database & Storage

Google Gemini - AI & Embeddings

Mapbox - Maps & Geocoding

Resend - Email Service

Vercel - Frontend Hosting

Render - Backend Hosting

#### Built with ❤️ for the Indian Rental Market
