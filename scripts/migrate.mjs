import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
await sql`CREATE TABLE IF NOT EXISTS user_roles (user_id TEXT PRIMARY KEY, role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER','ADMIN')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
await sql`CREATE TABLE IF NOT EXISTS assessments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id TEXT NOT NULL, scores JSONB NOT NULL, responses JSONB NOT NULL, completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
await sql`CREATE INDEX IF NOT EXISTS assessments_user_completed_idx ON assessments (user_id, completed_at DESC)`;
console.log('MindMap database schema is ready.');
