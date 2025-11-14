# EntraID Authentication Setup Guide

This guide will walk you through setting up PKCE-based OAuth 2.0 authentication with Microsoft EntraID (Azure Active Directory) for this application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [EntraID App Registration](#entraid-app-registration)
- [Configure the Application](#configure-the-application)
- [Understanding PKCE Flow](#understanding-pkce-flow)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- A Microsoft Azure account (free tier is sufficient)
- Node.js (version 14 or higher)
- Basic understanding of OAuth 2.0

## EntraID App Registration

### Step 1: Create a New App Registration

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** (or **Microsoft Entra ID**)
3. Click on **App registrations** in the left sidebar
4. Click **+ New registration**

### Step 2: Configure Basic Settings

1. **Name**: Enter a name for your application (e.g., "Multi-Language Greeting App")
2. **Supported account types**: Choose one of the following:
   - **Accounts in any organizational directory and personal Microsoft accounts** (most common for public apps)
   - **Accounts in this organizational directory only** (single tenant)
   - **Accounts in any organizational directory** (multi-tenant, no personal accounts)
   - **Personal Microsoft accounts only**
3. **Redirect URI**: 
   - Select **Single-page application (SPA)** from the dropdown
   - Enter your redirect URI (e.g., `http://localhost:5173` for development)
4. Click **Register**

### Step 3: Note Your Client ID and Tenant ID

After registration, you'll be taken to the app's Overview page:

1. **Application (client) ID**: Copy this value - you'll need it for `VITE_ENTRA_CLIENT_ID`
2. **Directory (tenant) ID**: Copy this value - you'll need it for `VITE_ENTRA_TENANT_ID` (optional, defaults to 'common')

### Step 4: Configure Authentication Settings

1. In your app registration, click **Authentication** in the left sidebar
2. Under **Platform configurations**, find your SPA configuration
3. Ensure the following settings are configured:
   - **Redirect URIs**: Add all URIs where your app will be hosted (development, staging, production)
     - Example: `http://localhost:5173`, `https://yourapp.com`
   - **Front-channel logout URL**: (Optional) Add if you want to specify a logout redirect
4. Under **Implicit grant and hybrid flows**, ensure these are **NOT** checked (PKCE doesn't use implicit flow):
   - ❌ Access tokens
   - ❌ ID tokens
5. Click **Save**

### Step 5: Configure API Permissions (Optional)

By default, the app has `User.Read` permission. To add more:

1. Click **API permissions** in the left sidebar
2. Click **+ Add a permission**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Choose the permissions you need (e.g., `User.Read`, `profile`, `email`, `openid`)
6. Click **Add permissions**

**Note**: For basic authentication, the default permissions are sufficient.

## Configure the Application

### Step 1: Create Environment File

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your values:
   ```env
   VITE_ENTRA_CLIENT_ID=your-application-client-id
   VITE_ENTRA_TENANT_ID=common
   VITE_ENTRA_REDIRECT_URI=http://localhost:5173
   VITE_ENTRA_SCOPES=openid profile email User.Read
   ```

### Step 2: Configuration Options Explained

- **VITE_ENTRA_CLIENT_ID** (Required)
  - Your Application (client) ID from Azure Portal
  - Example: `12345678-1234-1234-1234-123456789abc`

- **VITE_ENTRA_TENANT_ID** (Optional, defaults to 'common')
  - `common`: Multi-tenant app, supports both work/school and personal accounts
  - `organizations`: Only work and school accounts
  - `consumers`: Only personal Microsoft accounts
  - `{tenant-id}`: Specific tenant ID for single-tenant apps

- **VITE_ENTRA_REDIRECT_URI** (Optional, defaults to current origin)
  - Must exactly match one of the redirect URIs configured in Azure Portal
  - Development: `http://localhost:5173`
  - Production: `https://yourdomain.com`

- **VITE_ENTRA_SCOPES** (Optional, defaults to 'openid profile email User.Read')
  - Space-separated list of OAuth scopes
  - Common scopes:
    - `openid`: Get ID token
    - `profile`: Get user's profile information
    - `email`: Get user's email address
    - `User.Read`: Read user's profile from Microsoft Graph

### Step 3: Install Dependencies and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Understanding PKCE Flow

PKCE (Proof Key for Code Exchange) is an OAuth 2.0 extension that provides additional security for public clients (like SPAs) that can't securely store client secrets.

### How PKCE Works

1. **User clicks "Sign in"**
   - App generates a random `code_verifier` (43-128 character string)
   - App creates a `code_challenge` by SHA-256 hashing the verifier
   - App stores the verifier in session storage

2. **Redirect to EntraID**
   - User is redirected to Microsoft login page
   - URL includes: client_id, redirect_uri, scopes, code_challenge, and state

3. **User authenticates**
   - User enters credentials and consents to permissions
   - EntraID validates and redirects back with an authorization code

4. **Exchange code for tokens**
   - App sends authorization code + original code_verifier to EntraID
   - EntraID verifies the code_verifier matches the code_challenge
   - EntraID returns access_token and id_token

5. **User is authenticated**
   - Tokens are stored in session storage
   - App extracts user info from id_token
   - User can access protected features

### Why PKCE?

- **No client secret**: Safe for public clients (browser, mobile apps)
- **Prevents authorization code interception**: Even if code is stolen, attacker can't use it without the code_verifier
- **Industry standard**: Recommended by OAuth 2.0 security best practices

## Security Best Practices

### ✅ Implemented Security Features

1. **PKCE Flow**: Protects against authorization code interception
2. **State Parameter**: Prevents CSRF attacks
3. **Session Storage**: Tokens stored in session storage (cleared on browser close)
4. **Token Validation**: ID token is parsed and validated
5. **Token Expiration**: Access tokens are checked for expiration
6. **HTTPS in Production**: Always use HTTPS in production environments

### 🔒 Additional Recommendations

1. **Use HTTPS Always**
   - Never use HTTP in production
   - Configure your hosting platform for HTTPS

2. **Validate Redirect URIs**
   - Only register exact URIs you control
   - Be specific (avoid wildcards)

3. **Minimize Scope Requests**
   - Only request permissions you need
   - Users are more likely to consent to minimal scopes

4. **Token Storage**
   - Tokens are stored in `sessionStorage` (cleared on tab close)
   - Consider using `localStorage` only if you need persistent login
   - Never store tokens in cookies without HttpOnly and Secure flags

5. **Regular Updates**
   - Keep dependencies up to date
   - Monitor security advisories

6. **Content Security Policy**
   - Implement CSP headers to prevent XSS attacks
   - Example: `Content-Security-Policy: default-src 'self'; connect-src 'self' https://login.microsoftonline.com`

## Troubleshooting

### Common Issues

#### 1. "Client ID is not configured" Error

**Problem**: `VITE_ENTRA_CLIENT_ID` is not set or not loaded properly.

**Solution**: 
- Ensure `.env` file exists in project root
- Verify environment variable name starts with `VITE_`
- Restart dev server after changing `.env`

#### 2. "Redirect URI mismatch" Error

**Problem**: The redirect URI in your app doesn't match what's registered in Azure.

**Solution**:
- Check Azure Portal > App registrations > Authentication
- Ensure redirect URI exactly matches (including protocol, domain, port, and path)
- Remember to add URIs for both development and production

#### 3. "State mismatch" Error

**Problem**: State parameter doesn't match, possible CSRF attack or browser cache issue.

**Solution**:
- Clear browser cache and session storage
- Try again in incognito/private browsing mode
- Ensure cookies are enabled

#### 4. Infinite Redirect Loop

**Problem**: App keeps redirecting between your site and Microsoft login.

**Solution**:
- Check browser console for errors
- Verify token storage is working (check session storage)
- Ensure redirect URI is correctly configured

#### 5. "AADSTS50011: The reply URL specified in the request does not match"

**Problem**: Exact redirect URI mismatch.

**Solution**:
- Verify `VITE_ENTRA_REDIRECT_URI` matches exactly
- Check for trailing slashes, case sensitivity
- Wait a few minutes after changing settings in Azure (propagation delay)

### Debugging Tips

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for error messages in Console tab

2. **Inspect Network Tab**
   - Check OAuth requests and responses
   - Verify authorization and token endpoints are called correctly

3. **Verify Session Storage**
   - Open Developer Tools > Application > Session Storage
   - Check for `pkce_state`, `pkce_code_verifier`, `access_token`, etc.

4. **Enable Verbose Logging**
   - Add console.log statements in auth modules
   - Check what's being sent and received

### Getting Help

If you encounter issues not covered here:

1. Check the [Microsoft Identity Platform documentation](https://learn.microsoft.com/en-us/entra/identity-platform/)
2. Review [Azure AD OAuth error codes](https://learn.microsoft.com/en-us/entra/identity-platform/reference-error-codes)
3. Search [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-active-directory) with the error code

## References

- [Microsoft Entra ID Documentation](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)
- [RFC 7636: PKCE Specification](https://tools.ietf.org/html/rfc7636)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [Microsoft Authentication Library (MSAL) - Alternative Implementation](https://github.com/AzureAD/microsoft-authentication-library-for-js)

## License

This implementation is provided as-is for educational and production use. Always review and test thoroughly before deploying to production.
