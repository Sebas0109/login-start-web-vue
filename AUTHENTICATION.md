# Authentication Module Documentation

## Overview
This module implements JWT-based authentication connecting the frontend to backend endpoints.

## Components Created

### 1. API Client (`src/lib/apiClient.ts`)
- Base URL configured via `src/config/api.ts` (default: `http://localhost:8081`)
- Automatic JWT token injection in `Authorization: Bearer <token>` header
- Response interceptor handles 401 errors (clears auth state, redirects to login)
- Supports GET, POST, PUT, DELETE methods
- Handles both JSON and text responses

### 2. Auth Service (`src/services/authService.ts`)
API wrapper for authentication endpoints:
- `login(email, password)` → POST `/api/auth/login`
- `forgotPassword(email)` → POST `/api/auth/forgot-password`
- `recoverPassword(token, password)` → POST `/api/auth/recover-password?token=...`

### 3. Auth Context (`src/contexts/AuthContext.tsx`)
Global authentication state management:
- State: `{ token, userId, profile, isAuthenticated }`
- Actions: `setAuth()`, `clearAuth()`, `isTokenExpired()`
- Persistence: localStorage (`auth.token`, `auth.userId`, `auth.profile`, `auth.expiresAt`)
- JWT expiry checking using `jwt-decode`
- Auto-loads auth state on app mount

### 4. Protected Route (`src/components/ProtectedRoute.tsx`)
Route guard component:
- Checks authentication status
- Validates JWT expiry
- Redirects to `/login` if unauthorized
- Preserves intended route for post-login redirect

## Updated Components

### Login Page (`src/components/Login.tsx`)
- Integrated with `authService.login()`
- Stores auth data via `setAuth()`
- Shows error messages via toast
- Redirects to intended route or `/events`
- Auto-redirects if already authenticated
- Client-side validation (email format, required fields)

### Forgot Password (`src/components/ForgotPassword.tsx`)
- Integrated with `authService.forgotPassword()`
- Displays success/error messages
- Shows backend response text on success

### Recover Password (`src/components/RecoverPassword.tsx`)
- Integrated with `authService.recoverPassword()`
- Token from URL params (`/recover-password/:recover_token`)
- Password validation (min 8 chars, uppercase, lowercase, number)
- Password confirmation matching
- Redirects to login on success
- Displays success message before redirect

### Navigation (`src/components/Navigation.tsx`)
- Uses `useAuth()` hook for user data
- Displays user profile and ID
- Logout clears auth state via `clearAuth()`

### App Routes (`src/App.tsx`)
- Wrapped in `<AuthProvider>`
- Protected routes wrapped in `<ProtectedRoute>`
- Root `/` redirects to `/login`
- Public routes: `/login`, `/forgot-password`, `/recover-password/:token`
- Protected routes: `/events`, `/catalogs`, `/users`, `/calendar`

## Configuration

### API Base URL
Edit `src/config/api.ts`:
```typescript
export const API_CONFIG = {
  baseURL: "http://localhost:8081", // Change to your backend URL
} as const;
```

## API Contracts

### Login
**Endpoint:** `POST /api/auth/login`  
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "id": 1,
  "token": "JWT_TOKEN_STRING",
  "profile": "ADMIN"
}
```

### Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`  
**Request:**
```json
{
  "email": "user@example.com"
}
```
**Response:** `"Mail has been sent to the email provided"` (text)

### Recover Password
**Endpoint:** `POST /api/auth/recover-password?token=RECOVERY_TOKEN`  
**Request:**
```json
{
  "password": "newPassword123"
}
```
**Response:** `"Password has been reset"` (text)

## Features

### Security
- JWT stored in localStorage
- Token expiry validation on app load and route changes
- Automatic logout on 401 responses
- Request interceptor adds Bearer token automatically
- Password validation rules enforced

### User Experience
- Loading states during API calls
- Toast notifications for success/error
- Inline error messages on forms
- Auto-redirect after successful login
- Preserves intended route for post-login redirect
- Disabled form inputs during loading

### Persistence
- Auth state persists across page refreshes
- JWT expiry checked from decoded token
- Automatic cleanup on logout or token expiry

## Error Handling
- Network errors shown via toast
- 401 responses trigger auto-logout
- Backend errors displayed to users
- Form validation errors shown inline
- Missing token in login response handled gracefully

## Testing Checklist
- ✅ Login with valid credentials → authenticated and redirected
- ✅ Login with invalid credentials → error shown
- ✅ Page refresh while authenticated → still authenticated
- ✅ Token expiry → auto-logout on next request
- ✅ 401 response → redirects to login
- ✅ Forgot password → success message shown
- ✅ Recover password → redirects to login on success
- ✅ Protected routes → redirect to login if not authenticated
- ✅ Already authenticated user visits `/login` → redirects to `/events`
- ✅ Logout → clears state and redirects to login

## Dependencies Added
- `jwt-decode` - For decoding and validating JWT tokens
