import { useEffect, useRef, useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend
} from 'recharts';
import { calculateScores, getLevel, getPersonalityType, getActionPlan } from './scoring';

interface Props {
  answers: Record<number, number>;
  previousAnswers?: Record<number, number>;
  history?: { responses: Record<number, number>; completedAt: string }[];
  completedAt?: string;
  memberName?: string;
  onRetake: () => void;
}

const TRAIT_DESCRIPTIONS: Record<string, { low: string; high: string }> = {
  Openness: {
    high: 'You are imaginative and curious, drawn to unconventional ideas and creative exploration. You process the world through a wide lens and thrive where originality is valued.',
    low:  'You favour practical, proven methods over novelty. Consistency and reliability are your defaults — you build trust by delivering on what you know works.',
  },
  Conscientiousness: {
    high: 'You are highly organized and dependable. You set clear objectives, plan before acting, and follow through on your commitments — making you a natural anchor for any team.',
    low:  'You operate with flexibility and spontaneity. Structure can feel constraining; you prefer to respond to situations as they unfold rather than lock into a plan.',
  },
  Extraversion: {
    high: 'You draw energy from social interaction and naturally step into visible roles. Collaboration invigorates you, and you are often the person who gets things moving.',
    low:  'You are reflective and deliberate. Depth over breadth — you do your best thinking outside the crowd and build strong 1-on-1 relationships over broad networks.',
  },
  Agreeableness: {
    high: 'You lead with empathy and are skilled at building consensus. You create psychologically safe environments and are often the reason teams stay cohesive under pressure.',
    low:  'You are analytically independent and comfortable with friction. You will challenge a bad idea regardless of social cost — which is often exactly what a team needs.',
  },
  Adjustment: {
    high: 'You remain composed and steady under pressure. Your emotional regulation makes you a grounding presence during crises, and you recover quickly from setbacks.',
    low:  'You are emotionally attuned and sensitive to environmental signals. While stressors can affect your output, your awareness also makes you perceptive in ways others miss.',
  },
};

const INSIGHT_GROUPS = [
  {
    heading: 'Personality & Strengths',
    sections: ['Overall Personality Profile', 'Major Strengths'],
  },
  {
    heading: 'Professional Style',
    sections: ['Leadership Potential', 'Communication Style', 'Decision-Making Style'],
  },
  {
    heading: 'Career & Growth',
    sections: ['Career Suitability', 'Learning Style', 'Motivational Drivers'],
  },
  {
    heading: 'Wellbeing',
    sections: ['Stress & Coping Tendencies'],
  },
];

const generateInsights = (scores: ReturnType<typeof calculateScores>) => {
  const O = scores.Openness;
  const C = scores.Conscientiousness;
  const E = scores.Extraversion;
  const A = scores.Agreeableness;
  const N = scores.Adjustment;

  return {
    'Overall Personality Profile': `Your profile is anchored by ${C > 60 ? 'a strong sense of personal organization and follow-through' : 'an adaptable, situational approach to structure'}, combined with ${A > 60 ? 'a deeply collaborative working style' : 'a capacity for independent, critical analysis'}. You read situations through a ${O > 60 ? 'broad, exploratory lens' : 'pragmatic, evidence-focused lens'}, which shapes how you engage with new challenges and unfamiliar environments.`,

    'Major Strengths': `${C > 60 ? 'Your ability to plan, prioritize, and execute consistently is a rare and valuable asset in complex environments. ' : ''}${A > 60 ? 'Your empathy and cooperative instinct make you a natural relationship builder who others want on their team. ' : ''}${N > 60 ? 'Your emotional stability under pressure gives your team a steady reference point during uncertainty. ' : ''}${O > 60 ? 'Your intellectual curiosity means you spot opportunities and connections that others overlook. ' : ''}${E > 60 ? 'Your social energy and ability to mobilize others gives you a natural edge in leadership and sales contexts.' : 'Your depth of focus and preference for quality over visibility means your best work often carries more weight than it appears to on the surface.'}`,

    'Leadership Potential': E > 55
      ? `You lead by presence — visible, energizing, and effective at rallying groups around a direction. Your natural assertiveness and social ease mean you step into leadership roles fluidly. To deepen your impact, invest in the discipline of listening before directing, particularly in high-stakes decisions where other perspectives carry critical information.`
      : `You lead by example and credibility rather than charisma. People follow you because they trust your judgment and consistency. You are most effective in contexts where the work itself matters more than the performance of leadership — which describes most serious professional environments. Develop comfort with claiming the room when you have the strongest view in it.`,

    'Communication Style': A > 55
      ? `Diplomatic and integrative. You ensure all perspectives are surfaced before conclusions are reached, which makes you a valued voice in group settings. Watch for the tendency to soften direct feedback to the point where the message loses its force — effective communication sometimes requires uncomfortable clarity.`
      : `Direct and evidence-driven. You communicate with efficiency and are comfortable delivering assessments others might avoid. This is a genuine professional strength in environments that value candor. The growth edge is in calibrating tone to context — the same directness that works in a board room can land poorly in a 1-on-1 with someone in a vulnerable moment.`,

    'Decision-Making Style': O > 55
      ? `Exploratory and integrative. You gather diverse inputs, consider non-obvious options, and resist premature closure — a profile that produces strong strategic decisions. The risk is analysis paralysis in time-sensitive contexts. Practice committing to a direction with 70% information rather than waiting for certainty that rarely arrives.`
      : `Pragmatic and precedent-anchored. You make decisions on the basis of what has worked before, which produces reliable outcomes in stable environments. The growth area is in recognizing when a situation is genuinely novel — and that the right answer might not exist in your existing playbook.`,

    'Career Suitability': (() => {
      const roles: string[] = [];
      if (C > 60) roles.push('Project Management', 'Operations', 'Financial Analysis');
      if (O > 60) roles.push('Strategy Consulting', 'Product Design', 'Research');
      if (E > 60) roles.push('Sales Leadership', 'Business Development', 'Training & Facilitation');
      if (A > 60) roles.push('HR / People Operations', 'Counselling', 'Customer Success');
      if (N > 60) roles.push('Crisis Management', 'Executive Roles', 'High-Stakes Negotiation');
      const top = [...new Set(roles)].slice(0, 5);
      return `Based on your trait profile, environments that reward ${O > 55 ? 'intellectual autonomy and problem-solving' : 'execution and reliability'} will bring out your best work. Roles to consider: ${top.join(', ')}. You are likely to underperform in environments that require constant context-switching without depth, or that reward social performance over substance.`;
    })(),

    'Learning Style': O > 55
      ? `Conceptual and cross-disciplinary. You learn best when you can see the system behind the skill — understanding why something works before optimizing how. You are drawn to frameworks, theories, and the edges of your existing knowledge. Structured, compliance-style training will feel slow; self-directed exploration is your accelerator.`
      : `Applied and sequential. You absorb best through doing and through well-structured instruction that builds progressively on established foundations. Abstract frameworks without clear application feel like friction. Give yourself concrete problems to solve and you will develop faster than almost anyone in a structured program.`,

    'Stress & Coping Tendencies': N > 55
      ? `Your threshold for stress is high and your recovery is fast. Under pressure you tend to narrow your focus and work the problem rather than the feeling — a reliable pattern that others depend on. Watch for the risk of underestimating the stress signals of those around you: not everyone shares your regulation capacity, and assuming they do can create a leadership blind spot.`
      : `You are emotionally responsive to your environment, which means stressors register early and visibly. The upside is that you rarely ignore warning signs. The growth edge is in building structural buffers — pre-committed routines, clear boundaries, and deliberate recovery time — so that acute pressure doesn't cascade into performance degradation. Your sensitivity is a feature, not a flaw, when managed intentionally.`,

    'Motivational Drivers': `You are driven by ${C > 60 ? 'a need for competence and measurable progress — you want to see the work moving forward and your contribution clearly reflected in the outcome' : 'autonomy and variety — you engage most deeply when you have room to figure things out in your own way'}. ${A > 60 ? 'Knowing your work genuinely helps others is a significant intrinsic motivator.' : 'External validation matters less to you than the internal standard you hold yourself to.'} ${E > 60 ? 'Social recognition and visible impact keep your energy high.' : 'Quiet, focused progress on meaningful work is more sustaining than recognition.'} Understanding these drivers helps you structure your environment to sustain high performance rather than waiting for motivation to appear on its own.`,
  };
};

export default function ResultsDashboard({ answers, onRetake, memberName, completedAt, history = [] }: Props) {
  const scores = calculateScores(answers);
  const personalityType = getPersonalityType(scores);
  const actionPlan = getActionPlan(scores);
  const insights = generateInsights(scores);
  const [barsVisible, setBarsVisible] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  // Sort traits descending to find top trait
  const traitEntries = (Object.entries(scores) as [string, number][]).sort((a, b) => b[1] - a[1]);
  const topTrait = traitEntries[0][0];

  const radarData = [
    { subject: 'Openness',          A: scores.Openness },
    { subject: 'Conscientiousness', A: scores.Conscientiousness },
    { subject: 'Extraversion',      A: scores.Extraversion },
    { subject: 'Agreeableness',     A: scores.Agreeableness },
    { subject: 'Adjustment',        A: scores.Adjustment },
  ];
  const barData = radarData.map(({ subject, A }) => ({ trait: subject === 'Conscientiousness' ? 'Conscientious' : subject, score: A }));
  const trendData = [...history].reverse().map((attempt, index) => ({ attempt: `Attempt ${index + 1}`, ...calculateScores(attempt.responses) }));

  useEffect(() => {
    const el = barsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setBarsVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F2', fontFamily: 'var(--font-sans)' }}>

      {/* ── ANCHOR PANEL: bold top section — the ONE bold moment ──── */}
      <div style={{ background: '#18212B', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,6vw,5rem)' }}>
        <div className="inner-max">

          {/* Toolbar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '2.5rem',
          }}>
            <span style={{ fontFamily: 'var(--font-serif)', color: 'rgba(247,245,242,0.4)', fontSize: '0.875rem' }}>
              {memberName ? `${memberName} · ` : ''}Personality Report{completedAt ? ` · Updated ${new Date(completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }} className="no-print">
              <button className="btn-ghost" onClick={onRetake}>Retake</button>
              <button className="btn-ghost" onClick={() => window.print()}>
                Save PDF
              </button>
            </div>
          </div>

          {/* Hero grid: archetype left / radar right */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
          }}>
            <div>
              <p className="t-label" style={{ color: '#5C7F7B', marginBottom: '1rem' }}>
                Your primary archetype
              </p>
              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                color: '#C6A86B', /* Gold: the ONE reserved use */
                lineHeight: 1.1, marginBottom: '1.5rem',
              }}>
                {personalityType}
              </h1>
              <p className="t-body" style={{ color: 'rgba(247,245,242,0.55)', maxWidth: '26rem' }}>
                Derived from your two highest-scoring OCEAN traits. 
                Read the trait breakdown and insight sections below for your full profile.
              </p>

              {/* Compact trait scores */}
              <div ref={barsRef} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {traitEntries.map(([trait, score]) => (
                  <div key={trait} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      width: '10rem', fontSize: '0.75rem', fontWeight: 500,
                      color: trait === topTrait ? '#C6A86B' : 'rgba(247,245,242,0.45)',
                    }}>
                      {trait === 'Adjustment' ? 'Emotional Adjustment' : trait}
                    </span>
                    <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
                      <div
                        className={`trait-bar-fill${trait === topTrait ? ' is-top' : ''}`}
                        style={{ width: barsVisible ? `${score}%` : '0%' }}
                      />
                    </div>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 600, width: '2.5rem', textAlign: 'right',
                      color: trait === topTrait ? '#C6A86B' : 'rgba(247,245,242,0.35)',
                    }}>
                      {score}
                      <span style={{ fontSize: '0.6rem', color: 'rgba(247,245,242,0.2)', marginLeft: 1 }}>/100</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar chart */}
            <div style={{ height: 320 }} className="radar-animate">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'rgba(247,245,242,0.45)', fontSize: 11, fontFamily: 'Inter', fontWeight: 500 }}
                  />
                  <Radar dataKey="A" stroke="#56718F" fill="#56718F" fillOpacity={0.2} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <section className="chart-suite inner-max">
        <div className="chart-suite-heading"><p className="t-label">Your data, interpreted</p><h2 className="t-h2">See the pattern from every angle.</h2></div>
        <div className="chart-tile glass-card"><div className="chart-tile-title"><h3>Trait score comparison</h3><span>0–100 scale</span></div><div className="detail-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={barData}><CartesianGrid vertical={false} stroke="#e1e6e3"/><XAxis dataKey="trait" axisLine={false} tickLine={false} fontSize={11}/><YAxis domain={[0,100]} axisLine={false} tickLine={false} fontSize={11}/><Tooltip/><Bar dataKey="score" radius={[6,6,0,0]} fill="#56718F"/></BarChart></ResponsiveContainer></div><p>Your strongest dimension is <b>{topTrait}</b> ({traitEntries[0][1]}), while {traitEntries[traitEntries.length - 1][0]} is your main development edge. This comparison shows where your natural energy is concentrated.</p></div>
        <div className="chart-tile glass-card"><div className="chart-tile-title"><h3>Growth over time</h3><span>{history.length > 1 ? `${history.length} saved attempts` : 'Your first baseline'}</span></div>{history.length > 1 ? <><div className="detail-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={trendData}><CartesianGrid stroke="#e1e6e3"/><XAxis dataKey="attempt" fontSize={11}/><YAxis domain={[0,100]} fontSize={11}/><Tooltip/><Legend/><Line type="monotone" dataKey="Openness" stroke="#56718F"/><Line type="monotone" dataKey="Conscientiousness" stroke="#5C7F7B"/><Line type="monotone" dataKey="Adjustment" stroke="#C6A86B"/></LineChart></ResponsiveContainer></div><p>This line view compares your saved attempts. Small shifts are normal; look for themes that persist as your clearest working-style signals.</p></> : <div className="trend-empty"><span>+</span><p>Retake the assessment to create a second data point. Your future report will show how your trait scores change over time.</p></div>}</div>
        <div className="gauge-tile glass-card"><div className="chart-tile-title"><h3>Five trait gauges</h3><span>Compact score summary</span></div><div className="gauge-row">{traitEntries.map(([trait, score]) => <Gauge key={trait} trait={trait} score={score}/>)}</div><p>Each ring shows your current score and level. Higher or lower scores are tendencies—not a measure of ability or worth.</p></div>
      </section>

      {/* ── REPORT BODY: rail + content ──────────────────────────── */}
      <div className="inner-max" style={{
        padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,6vw,5rem)',
        display: 'grid',
        gridTemplateColumns: '13rem 1fr',
        gap: '4rem',
        alignItems: 'start',
      }}>

        {/* Left rail: section labels (sticky) */}
        <div className="report-rail no-print" style={{ position: 'sticky', top: '2rem' }}>
          <p className="t-label" style={{ marginBottom: '1rem' }}>Report sections</p>
          {INSIGHT_GROUPS.map(({ heading, sections }) => (
            <div key={heading} style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#18212B', marginBottom: '0.35rem' }}>{heading}</p>
              {sections.map(s => (
                <a key={s} className="rail-item" href={`#${s.replace(/\s+/g, '-')}`}>{s}</a>
              ))}
            </div>
          ))}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #d6d0c8', paddingTop: '1.25rem' }}>
            <a className="rail-item" href="#action-plan">Action Plan</a>
          </div>
        </div>

        {/* Right: report content */}
        <div>

          {/* Trait breakdown — compact, not cards */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 className="t-h2" style={{ marginBottom: '0.35rem' }}>Trait Breakdown</h2>
            <p className="t-label" style={{ marginBottom: '2rem' }}>
              All scores normalized 0–100 · Gold = your dominant trait
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {traitEntries.map(([trait, score], i) => {
                const level = getLevel(score);
                const isTop = trait === topTrait;
                const desc = score >= 50
                  ? TRAIT_DESCRIPTIONS[trait]?.high
                  : TRAIT_DESCRIPTIONS[trait]?.low;
                return (
                  <div key={trait} style={{
                    padding: '1.5rem 0',
                    borderTop: i === 0 ? '1px solid #d6d0c8' : '1px solid #e8e3dc',
                    display: 'grid', gridTemplateColumns: '11rem 1fr',
                    gap: '2rem',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{
                          fontWeight: 600, fontSize: '0.875rem',
                          color: isTop ? '#C6A86B' : '#18212B',
                        }}>
                          {trait === 'Adjustment' ? 'Emot. Adjustment' : trait}
                        </span>
                        {isTop && (
                          <span style={{
                            fontSize: '0.6rem', fontWeight: 700,
                            background: 'rgba(198,168,107,0.12)',
                            color: '#C6A86B', padding: '1px 6px', borderRadius: 2,
                            letterSpacing: '0.06em', textTransform: 'uppercase',
                          }}>Top</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: 2, background: '#E8E3DC', borderRadius: 2, maxWidth: '7rem' }}>
                          <div style={{
                            height: '100%', borderRadius: 2,
                            width: `${score}%`,
                            background: isTop ? '#C6A86B' : '#56718F',
                            transition: 'width 0.8s ease',
                          }} />
                        </div>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 600, color: isTop ? '#C6A86B' : '#56718F'
                        }}>{score}</span>
                        <span style={{ fontSize: '0.7rem', color: '#8a97a4' }}>{level}</span>
                      </div>
                    </div>
                    <p className="t-body" style={{ fontSize: '0.875rem', margin: 0, color: '#4a5a68' }}>{desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <hr className="rule" style={{ marginBottom: '3rem' }} />

          {/* Insight sections — grouped, report-style, no big icon cards */}
          {INSIGHT_GROUPS.map(({ heading, sections }) => (
            <section key={heading} style={{ marginBottom: '3rem' }}>
              <h2 className="t-h2" style={{ marginBottom: '0.25rem' }}>{heading}</h2>
              <hr className="rule" style={{ marginBottom: '2rem' }} />
              {sections.map(section => (
                <div key={section} id={section.replace(/\s+/g, '-')} style={{
                  display: 'grid', gridTemplateColumns: '10rem 1fr',
                  gap: '2rem', marginBottom: '2rem',
                }}>
                  <div style={{ paddingTop: '0.1rem' }}>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 600, color: '#5C7F7B',
                      display: 'block', lineHeight: 1.4,
                    }}>
                      {section}
                    </span>
                  </div>
                  <p className="t-body" style={{ margin: 0, fontSize: '0.9375rem', color: '#2e3d4a', lineHeight: 1.7 }}>
                    {insights[section as keyof typeof insights]}
                  </p>
                </div>
              ))}
            </section>
          ))}

          <hr className="rule" style={{ marginBottom: '3rem' }} />

          {/* Action Plan */}
          <section id="action-plan" style={{ marginBottom: '3rem' }}>
            <h2 className="t-h2" style={{ marginBottom: '0.25rem' }}>Action Plan</h2>
            <p className="t-label" style={{ marginBottom: '2rem' }}>
              Derived from your highest and lowest trait scores
            </p>
            <div style={{ background: '#2A3441', padding: '2rem 2.25rem' }}>
              {actionPlan.map((step, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '2rem 1fr',
                  gap: '1.25rem', paddingBottom: i < actionPlan.length - 1 ? '1.5rem' : 0,
                  marginBottom: i < actionPlan.length - 1 ? '1.5rem' : 0,
                  borderBottom: i < actionPlan.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem', color: 'rgba(247,245,242,0.2)', lineHeight: 1,
                  }}>{i + 1}</span>
                  <p style={{
                    margin: 0, color: 'rgba(247,245,242,0.8)',
                    fontSize: '0.9375rem', lineHeight: 1.7,
                  }}>{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Closing line */}
          <div style={{
            padding: '2rem 0', borderTop: '1px solid #d6d0c8',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
          }}>
            <p style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: '1rem', color: '#8a97a4', margin: 0,
            }}>
              "This is a starting point, not a label — use it to grow."
            </p>
            <button className="btn-ghost no-print" style={{
              color: '#18212B', borderColor: '#d6d0c8'
            }} onClick={onRetake}>
              Retake Assessment
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function Gauge({ trait, score }: { trait: string; score: number }) { const radius = 36; const circumference = 2 * Math.PI * radius; return <div className="gauge"><svg viewBox="0 0 88 88"><circle cx="44" cy="44" r={radius} fill="none" stroke="#e2e7e4" strokeWidth="7"/><circle cx="44" cy="44" r={radius} fill="none" stroke={trait === 'Adjustment' ? '#C6A86B' : '#5C7F7B'} strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)} transform="rotate(-90 44 44)"/><text x="44" y="48" textAnchor="middle">{score}</text></svg><b>{trait === 'Conscientiousness' ? 'Conscientious' : trait}</b><span>{getLevel(score)}</span></div>; }
