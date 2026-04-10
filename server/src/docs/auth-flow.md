# Authentication Flow

## Overview

UrbanKey uses Clerk for authentication. The authentication flow is as follows:

## Frontend Authentication

1. **Sign Up**: User signs up via Clerk's SignUp component
2. **Sign In**: User signs in via Clerk's SignIn component
3. **Session Management**: Clerk manages sessions and JWT tokens

## Backend Authentication

1. **JWT Verification**: The `requireAuth` middleware verifies the JWT token
2. **User Context**: Verified user ID is attached to `req.auth.userId`
3. **Role Extraction**: User role is extracted from database or Clerk metadata

## Webhook Sync

Clerk sends webhook events to keep your database in sync:

Without RAG: AI guesses based on general knowledge
With RAG: AI searches your database → Finds relevant properties → Answers based on actual data
