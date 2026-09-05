import { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, CheckCircle2, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import LandingPage from './LandingPage';
import AssessmentFlow from './AssessmentFlow';
import ResultsDashboard from './ResultsDashboard';
import AdminDashboard from './AdminDashboard';

export type Answers = Record<number, number>;
export type Role = 'USER' | 'ADMIN';
export type AssessmentRecord = { id: string; userId: string; completedAt: string; responses: Answers };
export type Member = { id: string; name: string; email: string; password: string; role: Role; createdAt: string };
const KEYS = { members: 'mindmap-members-v2', assessments: 'mindmap-assessments-v2', session: 'mindmap-session-v2' };
const starterMembers: Member[] = [
  { id: 'admin-1', name: 'MindMap Admin', email: 'admin@mindmap.consulting', password: 'MindMap2026!', role: 'ADMIN', createdAt: '2026-08-01' },
  { id: 'sample-1', name: 'Avery Morgan', email: 'avery@example.com', password: 'demo', role: 'USER', createdAt: '2026-08-04' },
  { id: 'sample-2', name: 'Jordan Patel', email: 'jordan@example.com', password: 'demo', role: 'USER', createdAt: '2026-08-10' },
];
const sampleAnswers = (shift: number): Answers => Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 1, ((i * 3 + shift) % 5) + 1]));
const starterAssessments: AssessmentRecord[] = [
  { id: 'sample-a1', userId: 'sample-1', completedAt: '2026-08-15T09:30:00Z', responses: sampleAnswers(2) }, { id: 'sample-a2', userId: 'sample-1', completedAt: '2026-09-01T11:30:00Z', responses: sampleAnswers(4) }, { id: 'sample-b1', userId: 'sample-2', completedAt: '2026-08-28T14:30:00Z', responses: sampleAnswers(1) },
];
function read<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return fallback; } }
function AuthPanel({ admin, onSuccess, onBack }: { admin?: boolean; onSuccess: (member: Member) => void; onBack: () => void }) {
  const [signup, setSignup] = useState(false); const [name, setName] = useState(''); const [email, setEmail] = useState(admin ? 'admin@mindmap.consulting' : ''); const [password, setPassword] = useState(admin ? 'MindMap2026!' : ''); const [error, setError] = useState('');
  const submit = (e: React.FormEvent) => { e.preventDefault(); setError(''); const members = read<Member[]>(KEYS.members, starterMembers); const normalized = email.toLowerCase().trim();
    if (signup) { if (!name.trim() || !normalized || password.length < 6) return setError('Enter your name, email, and a password with at least 6 characters.'); if (members.some(m => m.email === normalized)) return setError('An account with this email already exists.'); const member: Member = { id: crypto.randomUUID(), name: name.trim(), email: normalized, password, role: 'USER', createdAt: new Date().toISOString() }; localStorage.setItem(KEYS.members, JSON.stringify([...members, member])); return onSuccess(member); }
    const member = members.find(m => m.email === normalized && m.password === password && (!admin || m.role === 'ADMIN')); if (!member) return setError(admin ? 'This is not a valid administrator account.' : 'We could not find an account with those details.'); onSuccess(member);
  };
  return <main className="auth-shell"><button className="brand-button" onClick={onBack}>MindMap <span>Consulting</span></button><section className="auth-card glass-card"><div className="auth-icon">{admin ? <ShieldCheck size={26}/> : <UserRound size={26}/>}</div><p className="eyebrow">{admin ? 'Consulting team access' : signup ? 'Create your private account' : 'Welcome back'}</p><h1>{admin ? 'Admin sign in' : signup ? 'Know your working style.' : 'Your report is waiting.'}</h1><p className="muted">{admin ? 'Use the credentials seeded for the MindMap team.' : 'Your assessment history stays connected to your account.'}</p><form onSubmit={submit}>{signup && <label>Full name<input value={name} onChange={e => setName(e.target.value)} placeholder="Alex Morgan" /></label>}<label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></label>{error && <p className="form-error">{error}</p>}<button className="action-button" type="submit">{signup ? 'Create account' : 'Sign in'} <ArrowRight size={17}/></button></form>{!admin && <button className="text-button" onClick={() => setSignup(!signup)}>{signup ? 'Already have an account? Sign in' : 'New to MindMap? Create an account'}</button>}{admin && <p className="demo-note"><LockKeyhole size={13}/> Demo admin: admin@mindmap.consulting</p>}</section></main>;
}
function App() {
  const [view, setView] = useState<'landing'|'login'|'adminLogin'|'assessment'|'dashboard'|'admin'>('landing'); const [member, setMember] = useState<Member | null>(null); const [records, setRecords] = useState<AssessmentRecord[]>([]);
  useEffect(() => { if (!localStorage.getItem(KEYS.members)) localStorage.setItem(KEYS.members, JSON.stringify(starterMembers)); if (!localStorage.getItem(KEYS.assessments)) localStorage.setItem(KEYS.assessments, JSON.stringify(starterAssessments)); setRecords(read(KEYS.assessments, starterAssessments)); const saved = read<Member | null>(KEYS.session, null); if (saved) { setMember(saved); setView(saved.role === 'ADMIN' ? 'admin' : 'dashboard'); } }, []);
  const login = (next: Member) => { setMember(next); localStorage.setItem(KEYS.session, JSON.stringify(next)); setView(next.role === 'ADMIN' ? 'admin' : 'dashboard'); }; const logout = () => { localStorage.removeItem(KEYS.session); setMember(null); setView('landing'); };
  const complete = (responses: Answers) => { if (!member) return setView('login'); const next = [...records, { id: crypto.randomUUID(), userId: member.id, completedAt: new Date().toISOString(), responses }]; setRecords(next); localStorage.setItem(KEYS.assessments, JSON.stringify(next)); setView('dashboard'); };
  const own = member ? records.filter(r => r.userId === member.id).sort((a,b) => +new Date(b.completedAt) - +new Date(a.completedAt)) : [];
  if (view === 'login') return <AuthPanel onSuccess={login} onBack={() => setView('landing')} />; if (view === 'adminLogin') return <AuthPanel admin onSuccess={login} onBack={() => setView('landing')} />; if (view === 'assessment') return <AssessmentFlow onComplete={complete} onExit={() => setView('dashboard')} />;
  if (view === 'dashboard' && member) return own[0] ? <><AppHeader member={member} onLogout={logout} onRetake={() => setView('assessment')} /><ResultsDashboard answers={own[0].responses} previousAnswers={own[1]?.responses} history={own} completedAt={own[0].completedAt} memberName={member.name} onRetake={() => setView('assessment')} /></> : <EmptyDashboard member={member} onStart={() => setView('assessment')} onLogout={logout} />;
  if (view === 'admin' && member) return <AdminDashboard members={read<Member[]>(KEYS.members, starterMembers)} records={records} onLogout={logout} />;
  return <LandingPage onStart={() => setView('login')} onLogin={() => setView('login')} onAdmin={() => setView('adminLogin')} />;
}
function AppHeader({ member, onLogout, onRetake }: { member: Member; onLogout: () => void; onRetake: () => void }) { return <header className="app-header"><button className="brand-button" onClick={onRetake}>MindMap <span>Consulting</span></button><div><span className="header-name">{member.name}</span><button className="header-link" onClick={onLogout}>Sign out</button></div></header>; }
function EmptyDashboard({ member, onStart, onLogout }: { member: Member; onStart: () => void; onLogout: () => void }) { return <main className="empty-dashboard"><AppHeader member={member} onLogout={onLogout} onRetake={onStart}/><section className="empty-card glass-card"><div className="auth-icon"><BarChart3/></div><p className="eyebrow">Your private workspace</p><h1>Let’s create your first report.</h1><p>Twenty reflective prompts. Five minutes of focused attention. A dashboard you can revisit whenever you need perspective.</p><button className="action-button" onClick={onStart}>Begin assessment <ArrowRight size={17}/></button><div className="privacy-line"><CheckCircle2 size={15}/> Your responses remain attached to your private account.</div></section></main>; }
export default App;
