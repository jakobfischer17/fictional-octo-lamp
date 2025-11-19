/**
 * EntraID (Azure AD) Authentication Service using PKCE
 * Reference: https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow
 */

import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  storePKCEState,
  retrieveAndClearPKCEState
} from './pkce.js';

// Configuration - These should be set via environment variables
const getConfig = () => {
  return {
    tenantId: import.meta.env.VITE_ENTRA_TENANT_ID || 'common',
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID || '',
    redirectUri: import.meta.env.VITE_ENTRA_REDIRECT_URI || window.location.origin,
    scopes: import.meta.env.VITE_ENTRA_SCOPES || 'openid profile email User.Read'
  };
};

/**
 * Build the authorization URL for EntraID
 * @returns {Promise<string>} The authorization URL
 */
export async function buildAuthorizationUrl() {
  const config = getConfig();
  
  if (!config.clientId) {
    throw new Error('EntraID Client ID is not configured. Please set VITE_ENTRA_CLIENT_ID environment variable.');
  }
  
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // Store state and verifier for later validation
  storePKCEState(state, codeVerifier);
  
  const authUrl = new URL(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/authorize`);
  authUrl.searchParams.set('client_id', config.clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', config.redirectUri);
  authUrl.searchParams.set('scope', config.scopes);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('response_mode', 'query');
  
  return authUrl.toString();
}

/**
 * Handle the OAuth callback and exchange code for tokens
 * @param {string} callbackUrl - The full callback URL with query parameters
 * @returns {Promise<Object>} The token response
 */
export async function handleCallback(callbackUrl) {
  const config = getConfig();
  const url = new URL(callbackUrl);
  
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');
  
  // Handle errors from authorization server
  if (error) {
    throw new Error(`Authorization error: ${error} - ${errorDescription || 'No description'}`);
  }
  
  if (!code) {
    throw new Error('No authorization code received');
  }
  
  // Validate state to prevent CSRF attacks
  const { state: storedState, verifier } = retrieveAndClearPKCEState();
  
  if (!storedState || storedState !== returnedState) {
    throw new Error('State mismatch. Possible CSRF attack detected.');
  }
  
  if (!verifier) {
    throw new Error('Code verifier not found in session storage');
  }
  
  // Exchange authorization code for tokens
  const tokenUrl = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;
  
  const body = new URLSearchParams({
    client_id: config.clientId,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: config.redirectUri,
    code_verifier: verifier
  });
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Token exchange failed: ${errorData.error_description || response.statusText}`);
  }
  
  const tokenData = await response.json();
  return tokenData;
}

/**
 * Parse JWT token to extract user information
 * @param {string} idToken - The ID token (JWT)
 * @returns {Object} Parsed user information
 */
export function parseIdToken(idToken) {
  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error parsing ID token:', error);
    throw new Error('Failed to parse ID token');
  }
}

/**
 * Store tokens securely
 * @param {Object} tokenData - Token response from authorization server
 */
export function storeTokens(tokenData) {
  if (tokenData.access_token) {
    sessionStorage.setItem('access_token', tokenData.access_token);
  }
  if (tokenData.id_token) {
    sessionStorage.setItem('id_token', tokenData.id_token);
  }
  if (tokenData.refresh_token) {
    sessionStorage.setItem('refresh_token', tokenData.refresh_token);
  }
  if (tokenData.expires_in) {
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    sessionStorage.setItem('token_expires_at', expiresAt.toString());
  }
}

/**
 * Retrieve stored tokens
 * @returns {Object} Stored tokens
 */
export function getStoredTokens() {
  return {
    accessToken: sessionStorage.getItem('access_token'),
    idToken: sessionStorage.getItem('id_token'),
    refreshToken: sessionStorage.getItem('refresh_token'),
    expiresAt: sessionStorage.getItem('token_expires_at')
  };
}

/**
 * Clear all stored tokens
 */
export function clearTokens() {
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('id_token');
  sessionStorage.removeItem('refresh_token');
  sessionStorage.removeItem('token_expires_at');
}

/**
 * Check if the current session is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export function isAuthenticated() {
  const { accessToken, expiresAt } = getStoredTokens();
  
  if (!accessToken) {
    return false;
  }
  
  if (expiresAt) {
    const now = Date.now();
    if (now >= parseInt(expiresAt, 10)) {
      clearTokens();
      return false;
    }
  }
  
  return true;
}

/**
 * Get user information from stored ID token
 * @returns {Object | null} User information or null if not authenticated
 */
export function getUserInfo() {
  const { idToken } = getStoredTokens();
  
  if (!idToken) {
    return null;
  }
  
  try {
    const userInfo = parseIdToken(idToken);
    return {
      name: userInfo.name || '',
      email: userInfo.email || userInfo.preferred_username || '',
      id: userInfo.oid || userInfo.sub || ''
    };
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
}

/**
 * Initiate the login flow
 */
export async function login() {
  const authUrl = await buildAuthorizationUrl();
  window.location.href = authUrl;
}

/**
 * Logout the user
 * @param {boolean} withEntraLogout - Whether to also logout from EntraID
 */
export function logout(withEntraLogout = true) {
  const config = getConfig();
  clearTokens();
  
  if (withEntraLogout && config.clientId) {
    const logoutUrl = new URL(`https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/logout`);
    logoutUrl.searchParams.set('post_logout_redirect_uri', config.redirectUri);
    window.location.href = logoutUrl.toString();
  } else {
    window.location.href = config.redirectUri;
  }
}
