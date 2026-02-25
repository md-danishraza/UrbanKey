# UrbanKey Backend

Database Provider
Supabase PostgreSQL with pgvector
Schema Name: urbankey

Core Models
Model Description Key Fields
User Platform users id, email, role, isVerified
Property Rental listings landlordId, rent, bhk, amenities, metro distance
PropertyImage Property photos propertyId, imageUrl, isPrimary
Wishlist Saved properties tenantId, propertyId
VisitSchedule Property visits tenantId, propertyId, scheduledDate
Lead Tenant inquiries propertyId, tenantId, status
RentAgreement Generated agreements propertyId, tenantName, monthlyRent
AnalyticsEvent User tracking eventType, userId, propertyId
PropertyEmbedding Vector embeddings propertyId, content, embedding (vector)
Enums
Enum Values
Role TENANT, LANDLORD, ADMIN
BHKType ONE_BHK, TWO_BHK, THREE_BHK, FOUR_BHK_PLUS
FurnishingType UNFURNISHED, SEMI_FURNISHED, FULLY_FURNISHED
TenantType FAMILY, BACHELORS, BOTH
VisitStatus PENDING, CONFIRMED, CANCELLED, COMPLETED
ContactMethod WHATSAPP, PHONE, EMAIL
LeadStatus NEW, CONTACTED, CONVERTED, CLOSED
File Reference: /prisma/schema.prisma

5. Authentication System
   Provider: Clerk
   JWT Verification Middleware
   Verifies Bearer tokens from Authorization header, extracts userId and sessionId, and attaches auth data to request object.

File Reference: /src/middleware/auth.middleware.ts

typescript
// Usage in protected routes
router.post('/properties', requireAuth, createProperty);
Webhook Integration
Syncs Clerk users with local database. Handles user.created, user.updated, user.deleted events using Svix for signature verification.

File Reference: /src/controllers/auth.controller.ts
Endpoint: POST /api/auth/webhook

Test Token Generation (Development)
Generates JWT tokens for testing in development environment.

File Reference: /src/controllers/test.controller.ts
Endpoint: GET /api/test/get-token

6. API Endpoints
   Base URL
   text
   http://localhost:3000/api
   Public Endpoints
   Method Endpoint Description
   GET /health Server health check
   GET /properties Get all properties (with filters)
   GET /properties/search Search properties
   GET /properties/:id Get property by ID
   Protected Endpoints (require Bearer Token)
   Users
   Method Endpoint Description
   GET /users/me Get current user
   PUT /users/me Update current user
   DELETE /users/me Delete current user
   GET /users/:userId Get user by ID
   GET /users/:userId/properties Get user's properties
   GET /users/:userId/wishlist Get user's wishlist
   GET /users/:userId/visits Get user's visits
   GET /users/:userId/leads Get user's leads
   Properties
   Method Endpoint Description
   POST /properties Create new property
   PUT /properties/:id Update property
   DELETE /properties/:id Delete property
   PATCH /properties/:id/toggle Toggle property availability
   Development
   Method Endpoint Description
   GET /test/get-token Get test JWT token
   File Reference: /src/routes/

7. Implemented Features
   ✅ Completed (February 2026)
   Feature Description Files
   Project Setup Node.js + TypeScript + Express configuration package.json, tsconfig.json
   Database Setup Prisma ORM with Supabase PostgreSQL /prisma/schema.prisma, /src/config/database.ts
   Authentication Clerk JWT verification middleware /src/middleware/auth.middleware.ts
   Webhook Integration User sync from Clerk /src/controllers/auth.controller.ts
   User Management CRUD operations for users /src/controllers/user.controller.ts, /src/routes/user.routes.ts
   Property Management CRUD operations for properties /src/controllers/property.controller.ts, /src/routes/property.routes.ts
   Error Handling Global error middleware /src/middleware/error.middleware.ts
   Filtering & Pagination Property search with filters /src/controllers/property.controller.ts
   Development Tools Test token generation /src/controllers/test.controller.ts
8. Pending Features
   🔄 In Progress / Planned
   Feature Priority Description Target Files
   Wishlist Endpoints High Add/remove from wishlist /src/controllers/wishlist.controller.ts
   Visit Scheduling High Book/cancel property visits /src/controllers/visit.controller.ts
   Lead Management High Track tenant inquiries /src/controllers/lead.controller.ts
   Image Upload High AWS S3 integration for property images /src/services/upload.service.ts
   Metro Distance Medium Mapbox API integration /src/services/mapbox.service.ts
   Rent Agreement PDF Medium Generate rental agreements /src/services/pdf.service.ts
   WhatsApp Integration Medium Deep links for instant chat /src/services/whatsapp.service.ts
   AI Search (RAG) Low Gemini integration with pgvector /src/services/embedding.service.ts
   Admin Dashboard APIs Low User verification, analytics /src/controllers/admin.controller.ts
   Analytics Tracking Low Event logging and charts /src/services/analytics.service.ts
   Validation Middleware Medium Request validation with Zod /src/middleware/validation.middleware.ts
   Rate Limiting Medium Prevent API abuse /src/middleware/rate-limit.middleware.ts
   Logging Low Winston logger integration /src/utils/logger.ts
   Testing Medium Jest unit/integration tests /tests/
9. Environment Configuration
   File: .env
   env

10. Setup Instructions
    Prerequisites
    Node.js 18+

npm or yarn

Supabase account

Clerk account

Installation Steps
Clone the repository

bash
git clone <repository-url>
cd server
Install dependencies

bash
npm install
Set up environment variables

bash
cp .env.example .env

# Edit .env with your credentials

Initialize Prisma

bash

# Generate Prisma client

npx prisma generate

# Run migrations

npx prisma migrate dev --name init
Start development server

bash
npm run dev
Verify setup

bash
curl http://localhost:3000/health
Database Management Commands
bash

# Generate Prisma client after schema changes

npx prisma generate

# Create a migration

npx prisma migrate dev --name <migration-name>

# Reset database

npx prisma migrate reset

# Open Prisma Studio

npx prisma studio

# Push schema changes without migration

npx prisma db push 11. File Reference Index
Configuration Files
File Purpose
/package.json Dependencies and scripts
/tsconfig.json TypeScript configuration
/.env Environment variables
/.gitignore Git ignore rules
Prisma Files
File Purpose
/prisma/schema.prisma Database schema definition
/prisma/prisma.config.ts Prisma CLI configuration
/prisma/migrations/ Auto-generated migrations
/src/config/database.ts Prisma client singleton
Middleware
File Purpose
/src/middleware/auth.middleware.ts Clerk JWT verification
/src/middleware/error.middleware.ts Global error handler
Controllers
File Purpose
/src/controllers/auth.controller.ts Clerk webhook handlers
/src/controllers/user.controller.ts User CRUD operations
/src/controllers/property.controller.ts Property CRUD operations
/src/controllers/test.controller.ts Development token generation
Routes
File Purpose
/src/routes/auth.routes.ts Webhook endpoints
/src/routes/user.routes.ts User endpoints
/src/routes/property.routes.ts Property endpoints
/src/routes/test.routes.ts Development routes
Entry Point
File Purpose
/src/index.ts Express app initialization 12. API Testing Guide
Using Postman
Setup Collection Variables
Variable Value
baseUrl http://localhost:3000
token (get from test endpoint)
Get Test Token
http
GET {{baseUrl}}/api/test/get-token
Test Health Endpoint
http
GET {{baseUrl}}/health
Create a Property
http
POST {{baseUrl}}/api/properties
Authorization: Bearer {{token}}
Content-Type: application/json

{
"title": "Modern 2BHK in Whitefield",
"description": "Spacious apartment with modern amenities",
"bhk": "TWO_BHK",
"rent": 25000,
"furnishing": "SEMI_FURNISHED",
"tenantType": "FAMILY",
"addressLine1": "123, Oakwood Residency",
"city": "Bangalore",
"state": "Karnataka",
"pincode": "560066",
"hasWater247": true,
"hasPowerBackup": true,
"hasIglPipeline": false,
"nearestMetroStation": "Baiyappanahalli",
"distanceToMetroKm": 1.2,
"isBroker": false
}
Get All Properties with Filters
http
GET {{baseUrl}}/api/properties?city=Bangalore&minRent=10000&maxRent=50000&page=1&limit=10
Using cURL
Get Token
bash
curl -X GET http://localhost:3000/api/test/get-token
Create Property
bash
curl -X POST http://localhost:3000/api/properties \
 -H "Authorization: Bearer YOUR_TOKEN" \
 -H "Content-Type: application/json" \
 -d '{
"title": "Modern 2BHK",
"bhk": "TWO_BHK",
"rent": 25000,
"furnishing": "SEMI_FURNISHED",
"tenantType": "FAMILY",
"addressLine1": "123 Main St",
"city": "Bangalore",
"state": "Karnataka",
"pincode": "560066",
"hasWater247": true,
"hasPowerBackup": true
}'
Get Properties
bash
curl -X GET "http://localhost:3000/api/properties?city=Bangalore&minRent=10000"
Conclusion
The UrbanKey backend is now set up with a solid foundation including:

✅ TypeScript + Express configuration

✅ Prisma ORM with Supabase PostgreSQL

✅ pgvector support for future AI features

✅ Clerk authentication with JWT verification

✅ Webhook integration for user sync

✅ User and Property CRUD operations

✅ Error handling middleware

✅ Filtering and pagination for properties

The backend is ready for further development of pending features. The modular architecture ensures easy addition of new controllers, services, and middleware as the application grows.
