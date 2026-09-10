import { neon } from '@neondatabase/serverless';
const email = process.argv[2];
if (!email) throw new Error('Usage: node --env-file=.env.local scripts/make-admin.mjs admin@example.com');
const sql = neon(process.env.DATABASE_URL);
const users = await sql`SELECT id FROM neon_auth."user" WHERE email = ${email}`;
if (!users[0]) throw new Error(`No Neon Auth account exists for ${email}. Sign up with that email first.`);
await sql`INSERT INTO user_roles (user_id, role) VALUES (${users[0].id}, 'ADMIN') ON CONFLICT (user_id) DO UPDATE SET role = 'ADMIN'`;
console.log(`${email} is now an ADMIN.`);
