import { createRemoteJWKSet, jwtVerify } from 'jose';
import { ensureSchema, sql, type Role } from './db.js';

type Identity = { id: string; email: string; name: string; role: Role };
const jwks = () => createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!));

export async function requireIdentity(request: Request, admin = false): Promise<Identity> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new Response(JSON.stringify({ error: 'Authentication required.' }), { status: 401 });
  try {
    const { payload } = await jwtVerify(token, jwks());
    const id = String(payload.sub || '');
    if (!id) throw new Error('No subject');
    await ensureSchema();
    const roles = await sql`SELECT role FROM user_roles WHERE user_id = ${id}`;
    const role = (roles[0]?.role || 'USER') as Role;
    if (admin && role !== 'ADMIN') throw new Response(JSON.stringify({ error: 'Administrator access required.' }), { status: 403 });
    return { id, role, email: String(payload.email || ''), name: String(payload.name || payload.email || 'MindMap member') };
  } catch (error) {
    if (error instanceof Response) throw error;
    throw new Response(JSON.stringify({ error: 'Your session is invalid or expired.' }), { status: 401 });
  }
}
export const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
