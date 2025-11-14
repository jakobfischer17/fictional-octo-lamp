/**
 * PKCE (Proof Key for Code Exchange) utilities for OAuth 2.0 authentication
 * Reference: https://tools.ietf.org/html/rfc7636
 */

/**
 * Generate a random code verifier string
 * @returns {string} A random string between 43-128 characters
 */
export function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/**
 * Generate a code challenge from a code verifier
 * @param {string} verifier - The code verifier string
 * @returns {Promise<string>} The SHA-256 hashed and base64url encoded challenge
 */
export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(hash));
}

/**
 * Base64 URL encode an array buffer
 * @param {Uint8Array} buffer - The buffer to encode
 * @returns {string} Base64 URL encoded string
 */
function base64UrlEncode(buffer) {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Store PKCE state and verifier in session storage
 * @param {string} state - Random state string for CSRF protection
 * @param {string} verifier - Code verifier string
 */
export function storePKCEState(state, verifier) {
  sessionStorage.setItem('pkce_state', state);
  sessionStorage.setItem('pkce_code_verifier', verifier);
}

/**
 * Retrieve and clear PKCE state from session storage
 * @returns {{state: string | null, verifier: string | null}}
 */
export function retrieveAndClearPKCEState() {
  const state = sessionStorage.getItem('pkce_state');
  const verifier = sessionStorage.getItem('pkce_code_verifier');
  
  sessionStorage.removeItem('pkce_state');
  sessionStorage.removeItem('pkce_code_verifier');
  
  return { state, verifier };
}

/**
 * Generate a random state string for CSRF protection
 * @returns {string} Random state string
 */
export function generateState() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}
