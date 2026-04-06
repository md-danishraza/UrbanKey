import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "UrbanKey API",
      version: "1.0.0",
      description: `
        UrbanKey is a broker-free rental platform connecting tenants directly with verified landlords.
        
        ## Features
        - AI-powered semantic property search
        - Digital rent agreements with e-signatures
        - Aadhar verification for users
        - WhatsApp integration for direct chat
        - Payment tracking for rent and deposits
        
        ## Authentication
        This API uses Clerk JWT tokens for authentication.
        Include the token in the Authorization header:
        \`Authorization: Bearer <your_token>\`
      `,
      contact: {
        name: "UrbanKey Support",
        email: "support@urbankey.com",
        url: "https://urban-key-one.vercel.app",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development Server",
      },
      {
        url: "https://urbankey-hod8.onrender.com/api",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your Clerk JWT token",
        },
      },
      schemas: {
        // We'll add schemas here later
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: "Health", description: "Health check endpoints" },
      { name: "Authentication", description: "Auth webhook endpoints" },
      { name: "Users", description: "User management" },
      { name: "Properties", description: "Property CRUD and search" },
      { name: "Leads", description: "Tenant inquiries" },
      { name: "Visits", description: "Property visit scheduling" },
      { name: "Wishlist", description: "Saved properties" },
      { name: "Agreements", description: "Rental agreements" },
      { name: "Payments", description: "Rent payment tracking" },
      { name: "Admin", description: "Admin management (restricted)" },
      { name: "Chat", description: "AI-powered chat assistant" },
      { name: "Contact", description: "Contact form" },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Path to files with JSDoc annotations
};

export const swaggerSpec = swaggerJsdoc(options);
