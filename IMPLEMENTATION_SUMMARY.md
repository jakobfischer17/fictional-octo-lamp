# PKCE Authentication Implementation Summary

## Overview

This document provides a technical summary of the PKCE-based OAuth 2.0 authentication implementation with Microsoft EntraID (Azure Active Directory).

## What Was Implemented

### 1. PKCE Utility Module (`src/auth/pkce.js`)

Provides core PKCE functionality:
- **`generateCodeVerifier()`**: Creates a cryptographically secure random string (43-128 chars)
- **`generateCodeChallenge(verifier)`**: Generates SHA-256 hash of the verifier
- **`generateState()`**: Creates random state string for CSRF protection
- **`storePKCEState(state, verifier)`**: Stores PKCE data in session storage
- **`retrieveAndClearPKCEState()`**: Retrieves and clears stored PKCE data

### 2. Authentication Service (`src/auth/authService.js`)

Handles the complete OAuth 2.0 flow:
- **`buildAuthorizationUrl()`**: Constructs the authorization URL with PKCE parameters
- **`handleCallback(callbackUrl)`**: Processes OAuth callback and exchanges code for tokens
- **`parseIdToken(idToken)`**: Extracts user information from JWT
- **`storeTokens(tokenData)`**: Securely stores tokens in session storage
- **`getStoredTokens()`**: Retrieves stored tokens
- **`clearTokens()`**: Clears all stored tokens
- **`isAuthenticated()`**: Checks if user is authenticated and token is valid
- **`getUserInfo()`**: Gets user information from stored ID token
- **`login()`**: Initiates the login flow
- **`logout(withEntraLogout)`**: Logs out user and optionally from EntraID

### 3. React Authentication Context (`src/auth/AuthContext.jsx`)

Provides React integration:
- **`AuthProvider`**: Context provider component that wraps the app
- **`useAuth()`**: Custom hook to access authentication state
- Automatically handles OAuth callbacks on app load
- Manages authentication state (user, loading, error)
- Provides login/logout functions to components

### 4. Updated Application Components

**`src/main.jsx`**:
- Wrapped the App component with `AuthProvider`

**`src/App.jsx`**:
- Integrated authentication using `useAuth()` hook
- Added login screen for unauthenticated users
- Added user profile display in header
- Added logout button
- Protected greeting functionality behind authentication

**`src/App.css`**:
- Added styles for login screen
- Added styles for user profile display
- Added styles for authentication buttons
- Added error message styling
- Made header responsive

## Configuration

### Environment Variables

The application uses Vite's environment variable system (prefixed with `VITE_`):

- **`VITE_ENTRA_CLIENT_ID`** (Required): Application (client) ID from Azure Portal
- **`VITE_ENTRA_TENANT_ID`** (Optional, default: 'common'): Tenant ID or 'common'/'organizations'/'consumers'
- **`VITE_ENTRA_REDIRECT_URI`** (Optional, default: window.location.origin): Redirect URI after authentication
- **`VITE_ENTRA_SCOPES`** (Optional, default: 'openid profile email User.Read'): Space-separated OAuth scopes

### Files Created

- **`.env.example`**: Template for environment configuration
- **`ENTRAID_SETUP.md`**: Comprehensive setup guide (10+ pages)
- **`src/auth/pkce.js`**: PKCE utilities (70 lines)
- **`src/auth/authService.js`**: Authentication service (200+ lines)
- **`src/auth/AuthContext.jsx`**: React context provider (90 lines)

## OAuth 2.0 PKCE Flow

### Step-by-Step Process

1. **User Initiates Login**
   - User clicks "Sign in with Microsoft"
   - `login()` function is called

2. **Generate PKCE Parameters**
   - Generate random `code_verifier` (43 chars, cryptographically secure)
   - Generate `code_challenge` = SHA256(code_verifier)
   - Generate random `state` for CSRF protection
   - Store `state` and `code_verifier` in session storage

3. **Redirect to Authorization Endpoint**
   - Build authorization URL: `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize`
   - Include parameters:
     - `client_id`: Application ID
     - `response_type=code`: Authorization code flow
     - `redirect_uri`: Where to redirect after login
     - `scope`: Requested permissions
     - `state`: CSRF token
     - `code_challenge`: SHA-256 hash
     - `code_challenge_method=S256`: Hash algorithm

4. **User Authenticates**
   - User enters Microsoft credentials
   - User consents to requested permissions
   - EntraID validates and redirects back with `code` and `state`

5. **Handle Callback**
   - App receives callback with authorization code
   - Validate `state` matches stored value (CSRF protection)
   - Retrieve stored `code_verifier`

6. **Exchange Code for Tokens**
   - POST to token endpoint: `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token`
   - Include:
     - `client_id`: Application ID
     - `grant_type=authorization_code`
     - `code`: Authorization code
     - `redirect_uri`: Must match original
     - `code_verifier`: Original verifier (proves we initiated the request)
   - EntraID validates:
     - Code is valid
     - code_verifier matches code_challenge
     - redirect_uri matches
   - Returns `access_token`, `id_token`, and optionally `refresh_token`

7. **Store Tokens and User Info**
   - Store tokens in session storage
   - Parse ID token (JWT) to extract user information
   - Update React state with user information

8. **User is Authenticated**
   - User can now access protected features
   - Access token can be used for API calls
   - Session persists until browser tab is closed or logout

## Security Considerations

### Implemented Security Measures

1. **PKCE (Proof Key for Code Exchange)**
   - Prevents authorization code interception attacks
   - Safe for public clients (no client secret)
   - Code verifier is never transmitted, only the challenge

2. **State Parameter**
   - Prevents CSRF (Cross-Site Request Forgery) attacks
   - Random value generated for each authorization request
   - Validated on callback

3. **Session Storage**
   - Tokens stored in `sessionStorage` (cleared on tab close)
   - Not accessible across tabs
   - Cleared on logout

4. **Token Expiration**
   - Access tokens have expiration time
   - App checks token validity before use
   - Expired tokens automatically invalidate authentication

5. **Secure Communication**
   - All communication with EntraID over HTTPS
   - No sensitive data in client code
   - No client secrets (not needed with PKCE)

6. **Input Validation**
   - State validation prevents CSRF
   - Token format validation
   - Error handling for invalid responses

### Best Practices Followed

- ✅ Use PKCE for public clients
- ✅ Validate state parameter
- ✅ Use session storage (not local storage)
- ✅ Check token expiration
- ✅ Clear tokens on logout
- ✅ Handle errors gracefully
- ✅ Use HTTPS in production
- ✅ Minimal scope requests
- ✅ No sensitive data in code
- ✅ Follow Microsoft recommendations

## Token Structure

### Access Token
- Used to authenticate API requests
- Opaque string (not meant to be parsed by client)
- Has expiration time
- Stored in session storage

### ID Token
- JWT (JSON Web Token)
- Contains user information
- Structure: `header.payload.signature`
- Payload includes:
  - `name`: User's display name
  - `email` or `preferred_username`: Email address
  - `oid` or `sub`: User ID
  - `exp`: Expiration timestamp
  - Other claims

### Refresh Token (Optional)
- Used to get new access tokens
- Long-lived
- Only returned if offline_access scope is requested

## API Endpoints Used

### Authorization Endpoint
```
GET https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize
```
Parameters: client_id, response_type, redirect_uri, scope, state, code_challenge, code_challenge_method

### Token Endpoint
```
POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
```
Body: client_id, grant_type, code, redirect_uri, code_verifier

### Logout Endpoint
```
GET https://login.microsoftonline.com/{tenant}/oauth2/v2.0/logout
```
Parameters: post_logout_redirect_uri

## Error Handling

### Authorization Errors
- Captured from callback URL parameters
- Displayed to user with description
- Common errors: user cancellation, consent denied

### Token Exchange Errors
- Network errors
- Invalid code
- Code verifier mismatch
- Displayed with helpful message

### State Validation Errors
- CSRF protection triggered
- Clears session and shows error
- Suggests clearing cache

## Testing Checklist

To fully test the implementation:

1. ✅ Application builds without errors
2. ✅ Dev server starts successfully
3. ✅ Login screen displays correctly
4. ⏹️ Click login redirects to Microsoft (requires EntraID setup)
5. ⏹️ After authentication, redirects back correctly
6. ⏹️ User information displays in header
7. ⏹️ Greeting functionality works when authenticated
8. ⏹️ Logout clears session and redirects to login
9. ⏹️ Tokens expire correctly
10. ⏹️ Error handling works for various scenarios

Note: Steps 4-10 require actual EntraID configuration and cannot be tested without valid credentials.

## Dependencies

No additional dependencies were added. The implementation uses:
- Native browser APIs (crypto, fetch, sessionStorage)
- React 18 (already in project)
- Standard JavaScript

## Performance

- Minimal overhead: ~10KB additional JavaScript
- No external libraries for OAuth
- Session storage is fast and synchronous
- Token validation is lightweight

## Maintenance

### Future Enhancements

Potential improvements:
- Token refresh implementation
- Remember user preference (local storage option)
- Multiple identity provider support
- Token caching for better performance
- Silent token renewal

### Monitoring

Consider monitoring:
- Authentication success rate
- Token expiration events
- Error types and frequencies
- User logout patterns

## Resources

- [Microsoft Entra ID Docs](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)
- [RFC 7636: PKCE](https://tools.ietf.org/html/rfc7636)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

## Support

For issues with:
- **Setup**: See `ENTRAID_SETUP.md`
- **Configuration**: Check environment variables in `.env`
- **Troubleshooting**: See troubleshooting section in `ENTRAID_SETUP.md`
- **Azure Portal**: See Microsoft documentation

## License

This implementation follows industry standards and best practices. Feel free to use and modify for your needs.
