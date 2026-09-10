import { createInternalNeonAuth } from '@neondatabase/neon-js/auth';

const url = import.meta.env.VITE_NEON_AUTH_URL as string | undefined;
if (!url) console.warn('VITE_NEON_AUTH_URL is not configured. Authentication is unavailable.');
export const neonAuth = createInternalNeonAuth(url || 'http://localhost:3000/auth');

export async function api(path: string, init: RequestInit = {}) {
  const token = await neonAuth.getJWTToken();
  const response = await fetch(path, { ...init, headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...init.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Request failed.');
  return body;
}
