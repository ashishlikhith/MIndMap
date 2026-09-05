import { useEffect, useRef } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

// Static sample data for the hero radar preview
const SAMPLE_RADAR = [
  { subject: 'Openness',           A: 78 },
  { subject: 'Conscientiousness',  A: 62 },
  { subject: 'Extraversion',       A: 44 },
  { subject: 'Agreeableness',      A: 71 },
  { subject: 'Adjustment',         A: 55 },
];

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  onAdmin: () => void;
}

export default function LandingPage({ onStart, onLogin, onAdmin }: LandingPageProps) {
  const radarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = radarRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('radar-animate'); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav style={{
        background: '#18212B',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem clamp(1.5rem,6vw,5rem)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          color: '#F7F5F2', fontSize: '1.1rem', letterSpacing: '-0.01em'
        }}>
          MindMap Consulting
        </span>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="nav-login" onClick={onLogin}>Sign in</button>
          <button className="btn-ghost" onClick={onStart}>Begin Assessment</button>
        </div>
      </nav>

      {/* ── HERO (Asymmetric: text left / live radar right) ──────── */}
      <section style={{
        background: '#18212B',
        padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem)',
      }}>
        <div className="inner-max" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }}>
          {/* Left: Copy */}
          <div>
            <p className="t-label" style={{ color: '#5C7F7B', marginBottom: '1.25rem' }}>
              Big Five (OCEAN) Personality Assessment
            </p>
            <h1 className="t-display" style={{ color: '#F7F5F2', marginBottom: '1.5rem' }}>
              Understand yourself the way top companies understand their best people.
            </h1>
            <p className="t-body" style={{ color: 'rgba(247,245,242,0.6)', marginBottom: '2.5rem', fontSize: '1rem' }}>
              A 20-question diagnostic that maps your personality across five scientifically validated dimensions — then translates the data into a professional report covering leadership potential, communication style, career fit, and stress patterns.
            </p>
            <button className="btn-primary" onClick={onStart} style={{
              background: '#F7F5F2', color: '#18212B', fontSize: '0.9375rem', padding: '0.875rem 2rem'
            }}>
              Start My Assessment — 10 min
            </button>
            <p style={{ color: 'rgba(247,245,242,0.3)', fontSize: '0.75rem', marginTop: '1rem' }}>
              Private account · Return to your report anytime.
            </p>
          </div>

          {/* Right: Live radar preview */}
          <div
            ref={radarRef}
            style={{
              background: '#2A3441',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '2rem',
              opacity: 0,
            }}
          >
            <p className="t-label" style={{ color: '#5C7F7B', marginBottom: '0.5rem' }}>Sample profile</p>
            <p style={{ fontFamily: 'var(--font-serif)', color: '#C6A86B', fontSize: '1.1rem', marginBottom: '1rem' }}>
              The Steady Collaborator
            </p>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={SAMPLE_RADAR} cx="50%" cy="50%" outerRadius="72%">
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(247,245,242,0.5)', fontSize: 11, fontFamily: 'Inter' }} />
                  <Radar dataKey="A" stroke="#56718F" fill="#56718F" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {/* Mini trait bars */}
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {SAMPLE_RADAR.sort((a,b) => b.A - a.A).map((d, i) => (
                <div key={d.subject} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '9rem', fontSize: '0.72rem', color: 'rgba(247,245,242,0.5)', fontFamily: 'Inter' }}>
                    {d.subject}
                  </span>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                    <div style={{
                      width: `${d.A}%`, height: '100%', borderRadius: 2,
                      background: i === 0 ? '#C6A86B' : '#56718F',
                    }} />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(247,245,242,0.35)', width: '2rem', textAlign: 'right' }}>{d.A}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ─────────────────────────────────────── */}
      <section style={{ background: '#E8EFED', padding: 'clamp(3.5rem,6vw,5.5rem) clamp(1.5rem,6vw,5rem)' }}>
        <div className="inner-max">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', alignItems: 'end', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div><p className="t-label">Inside your dashboard</p><h2 className="t-h1" style={{ marginTop: '.6rem', maxWidth: '35rem' }}>Clarity that stays useful after the first read.</h2></div>
            <p className="t-body" style={{ maxWidth: '22rem', margin: 0 }}>Your private report pairs an overall pattern with practical signals for leadership, work style, and resilience.</p>
          </div>
          <div className="dashboard-preview">
            <div className="preview-side"><p className="t-label">Your report</p><h3>The Steady<br/>Collaborator</h3><div className="preview-rings"><span>78<small>Openness</small></span><span>71<small>Empathy</small></span></div></div>
            <div className="preview-main"><div className="preview-stat"><span>Leadership potential</span><b>82<span>%</span></b><small>↑ 8 pts from your baseline</small></div><div className="preview-stat"><span>Emotional adjustment</span><b>74<span>%</span></b><small>Steady under pressure</small></div><div className="preview-advice"><p className="t-label">Coaching prompt</p><strong>Turn preparation into influence.</strong><span>Your high conscientiousness means people trust your follow-through. Make your point earlier in the room.</span></div></div>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET: Spec-list layout (not icon cards) ──────── */}
      <section style={{ background: '#FCFBF8', padding: 'clamp(3.5rem,6vw,5rem) clamp(1.5rem,6vw,5rem)' }}>
        <div className="inner-max">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }}>
            <div>
              <p className="t-label">What you receive</p>
              <h2 className="t-h2" style={{ marginTop: '0.75rem' }}>
                A report worth printing. Not a score screen.
              </h2>
            </div>
            <div style={{ borderTop: '1px solid #d6d0c8' }}>
              {[
                ['Personality Profile',     'A plain-language overview of your core trait structure across all five OCEAN dimensions.'],
                ['Leadership Potential',     'Scored assessment of your natural disposition toward leading, influencing, and making decisions.'],
                ['Communication Style',      'How you receive and transmit information — and how to adapt for different contexts.'],
                ['Decision-Making Pattern',  'Whether you favour intuition, analysis, collaboration, or speed when resolving uncertainty.'],
                ['Career Suitability',       '3–5 specific roles and environments calibrated to your trait profile — not a generic list.'],
                ['Stress & Coping Analysis', 'Identification of your stress triggers and the coping tendencies that help or harm you.'],
                ['Action Plan',              '3–5 specific, achievable steps derived from your actual highest and lowest trait scores.'],
              ].map(([title, desc]) => (
                <div key={title} style={{
                  display: 'grid', gridTemplateColumns: '13rem 1fr',
                  gap: '1.25rem', padding: '1rem 0',
                  borderBottom: '1px solid #d6d0c8',
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#18212B', paddingTop: '0.05rem' }}>{title}</span>
                  <span className="t-body" style={{ color: '#4a5a68' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS: Wide sequential steps (not cards) ──────── */}
      <section style={{ background: '#F7F5F2', padding: 'clamp(3.5rem,6vw,5rem) clamp(1.5rem,6vw,5rem)' }}>
        <div className="inner-max">
          <p className="t-label" style={{ marginBottom: '2.5rem' }}>The process</p>
          {[
            ['01', 'Answer 20 reflective statements', 'Rated on a five-point scale. Takes 8–10 minutes. No trait labels shown during the assessment — only after.'],
            ['02', 'Receive your instant OCEAN profile', 'Scores computed in the browser the moment you finish. No account, no wait, no data sent anywhere.'],
            ['03', 'Walk away with your action plan',    'A shareable report with personalized recommendations grounded in your actual profile, not generic advice.'],
          ].map(([num, title, desc], i, arr) => (
            <div key={num}>
              <div style={{ display: 'grid', gridTemplateColumns: '4rem 1fr', gap: '2rem', padding: '2.25rem 0', alignItems: 'start' }}>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.5rem', color: '#d6d0c8', lineHeight: 1,
                }}>{num}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.5rem', color: '#18212B' }}>{title}</h3>
                  <p className="t-body" style={{ maxWidth: '38rem' }}>{desc}</p>
                </div>
              </div>
              {i < arr.length - 1 && <hr className="rule" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── CREDIBILITY STRIP ─────────────────────────────────────── */}
      <section style={{
        background: '#2A3441', color: 'rgba(247,245,242,0.55)',
        padding: '1.5rem clamp(1.5rem,6vw,5rem)',
        fontSize: '0.8125rem', letterSpacing: '0.01em',
        display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span>Based on the <strong style={{ color: 'rgba(247,245,242,0.8)' }}>Big Five (OCEAN)</strong> model — the most empirically supported personality framework in psychological research.</span>
        <span style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '3rem' }}>Used across HR, clinical, and organizational psychology for 40+ years.</span>
      </section>

      <section style={{ background: '#FCFBF8', padding: '2rem clamp(1.5rem,6vw,5rem)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#2A3441', margin: 0 }}>&ldquo;The report gave me language for strengths I had felt but never articulated.&rdquo;</p>
        <p className="t-label" style={{ marginTop: '.5rem' }}>People &amp; culture leader · technology sector</p>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────────── */}
      <section style={{ background: '#18212B', padding: 'clamp(4rem,7vw,6rem) clamp(1.5rem,6vw,5rem)' }}>
        <div className="inner-max" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <p className="t-label" style={{ color: '#5C7F7B', marginBottom: '0.75rem' }}>Ready to begin?</p>
            <h2 className="t-h1" style={{ color: '#F7F5F2', maxWidth: '28rem' }}>
              Your profile is 10 minutes away.
            </h2>
          </div>
          <button className="btn-primary" onClick={onStart} style={{
            background: '#F7F5F2', color: '#18212B', fontSize: '0.9375rem', padding: '0.875rem 2rem', flexShrink: 0
          }}>
            Start My Assessment
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{
        background: '#18212B',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '1.25rem clamp(1.5rem,6vw,5rem)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem'
      }}>
        <span style={{ fontFamily: 'var(--font-serif)', color: 'rgba(247,245,242,0.4)', fontSize: '0.875rem' }}>MindMap Consulting</span>
        <span style={{ color: 'rgba(247,245,242,0.25)', fontSize: '0.75rem' }}>
          <button className="admin-link" onClick={onAdmin}>Consulting team sign in</button> · © {new Date().getFullYear()} · Industrial Psychology Division
        </span>
      </footer>

    </div>
  );
}
