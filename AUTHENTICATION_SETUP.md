# Azure EntraID PKCE Authentication Setup Guide

This guide walks you through setting up Azure EntraID authentication with PKCE flow for the Multi-Language Greeting App.

## Prerequisites

- Azure subscription with access to create app registrations
- Azure CLI installed and authenticated (`az login`)
- Node.js and npm installed

## Quick Setup (Automated)

Run the PowerShell setup script to automatically configure Azure:

```powershell
.\azure-setup.ps1
```

This script will:
1. Create an Azure AD app registration named "fictional-octo-lamp-spa"
2. Configure the SPA platform with redirect URI
3. Add Microsoft Graph User.Read API permissions
4. Grant admin consent (if you have admin privileges)
5. Display your Client ID and Tenant ID
6. Optionally update your .env file automatically

## Manual Setup

If you prefer to set up manually or need to customize the configuration:

### Step 1: Create Azure AD App Registration

```powershell
# Create the app registration
$clientId = az ad app create --display-name "fictional-octo-lamp-spa" --query appId --output tsv
Write-Host "Client ID: $clientId"
```

### Step 2: Configure SPA Platform

```powershell
# Set the redirect URI for SPA
az ad app update --id $clientId --spa-redirect-uris "http://localhost:5173"
```

### Step 3: Add API Permissions

```powershell
# Add Microsoft Graph User.Read permission
# Microsoft Graph API ID: 00000003-0000-0000-c000-000000000000
# User.Read permission ID: e1fe6dd8-ba31-4d61-89e7-88639da4683d
az ad app permission add --id $clientId --api 00000003-0000-0000-c000-000000000000 --api-permissions e1fe6dd8-ba31-4d61-89e7-88639da4683d=Scope
```

### Step 4: Grant Admin Consent

```powershell
# Grant admin consent (requires admin privileges)
az ad app permission admin-consent --id $clientId
```

### Step 5: Get Tenant ID

```powershell
# Get your tenant ID
$tenantId = az account show --query tenantId --output tsv
Write-Host "Tenant ID: $tenantId"
```

### Step 6: Update Environment Variables

Copy `.env.template` to `.env` and update with your values:

```powershell
Copy-Item .env.template .env
```

Edit `.env` and replace the placeholders:

```
VITE_AZURE_CLIENT_ID=<your-client-id-from-step-1>
VITE_AZURE_TENANT_ID=<your-tenant-id-from-step-5>
VITE_AZURE_REDIRECT_URI=http://localhost:5173
```

## Running the Application

1. Start the development server:

```powershell
npm run dev
```

2. Open your browser to http://localhost:5173

3. Click "Sign In with Microsoft" to authenticate

4. After signing in, your name will appear in the greeting automatically

## Production Setup

For production deployment:

1. Update the redirect URI in Azure Portal:
   - Go to Azure Portal → Entra ID → App registrations
   - Select your app
   - Add your production URL to the redirect URIs

2. Update `.env` for production:

```
VITE_AZURE_REDIRECT_URI=https://your-production-domain.com
```

3. Ensure `.env` is in `.gitignore` (already configured)

## PKCE Flow Details

PKCE (Proof Key for Code Exchange) is automatically handled by MSAL:
- No client secret required (secure for SPAs)
- Code verifier and code challenge generated automatically
- Tokens stored securely in browser session storage
- Automatic token refresh

## Troubleshooting

### "AADSTS700016: Application not found in the directory"
- Verify your Client ID is correct in `.env`
- Ensure you're signed into the correct Azure tenant

### "AADSTS50011: Redirect URI mismatch"
- Check that the redirect URI in Azure matches exactly: `http://localhost:5173`
- No trailing slash should be present

### "Consent required" error
- Run admin consent: `az ad app permission admin-consent --id $clientId`
- Or grant consent manually in Azure Portal

### Changes not reflected
- Restart the dev server after modifying `.env`
- Clear browser cache and cookies

## API Permissions

The app requests the following Microsoft Graph permissions:
- **User.Read** (Delegated): Read the signed-in user's profile

## Security Best Practices

✅ **Implemented:**
- PKCE flow for secure authentication
- Session storage for tokens (cleared on browser close)
- `.env` excluded from version control
- SPA platform configuration (no client secret)

⚠️ **Additional Recommendations:**
- Use HTTPS in production
- Implement Content Security Policy (CSP)
- Enable Conditional Access policies in Azure
- Monitor sign-in logs in Azure Portal

## Learn More

- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Azure AD Authentication Flows](https://docs.microsoft.com/azure/active-directory/develop/authentication-flows-app-scenarios)
- [PKCE in OAuth 2.0](https://oauth.net/2/pkce/)
