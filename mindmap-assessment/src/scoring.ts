import { questions } from './questions';
import type { Trait } from './questions';

export type OceanScores = {
  Openness: number;
  Conscientiousness: number;
  Extraversion: number;
  Agreeableness: number;
  Adjustment: number; // Inverted Neuroticism
};

export const calculateScores = (answers: Record<number, number>): OceanScores => {
  const sums: Record<Trait, { total: number; count: number }> = {
    Openness: { total: 0, count: 0 },
    Conscientiousness: { total: 0, count: 0 },
    Extraversion: { total: 0, count: 0 },
    Agreeableness: { total: 0, count: 0 },
    Neuroticism: { total: 0, count: 0 },
  };

  questions.forEach((q) => {
    let score = answers[q.id];
    if (!score) return;
    
    if (q.reverse) {
      score = 6 - score;
    }
    
    sums[q.trait].total += score;
    sums[q.trait].count += 1;
  });

  // Calculate averages (1-5)
  const averages = {
    Openness: sums.Openness.total / sums.Openness.count,
    Conscientiousness: sums.Conscientiousness.total / sums.Conscientiousness.count,
    Extraversion: sums.Extraversion.total / sums.Extraversion.count,
    Agreeableness: sums.Agreeableness.total / sums.Agreeableness.count,
    Neuroticism: sums.Neuroticism.total / sums.Neuroticism.count,
  };

  // Convert Neuroticism to Adjustment (higher is better)
  const adjustmentAverage = 6 - averages.Neuroticism;

  // Normalize to 0-100
  const normalize = (val: number) => Math.round(((val - 1) / 4) * 100);

  return {
    Openness: normalize(averages.Openness),
    Conscientiousness: normalize(averages.Conscientiousness),
    Extraversion: normalize(averages.Extraversion),
    Agreeableness: normalize(averages.Agreeableness),
    Adjustment: normalize(adjustmentAverage),
  };
};

export const getLevel = (score: number) => {
  if (score < 40) return 'Low';
  if (score < 70) return 'Moderate';
  return 'High';
};

export const getPersonalityType = (scores: OceanScores): string => {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top2 = [sorted[0][0], sorted[1][0]];
  
  if (top2.includes('Extraversion') && top2.includes('Agreeableness')) return 'The Charismatic Collaborator';
  if (top2.includes('Conscientiousness') && top2.includes('Adjustment')) return 'The Steady Executor';
  if (top2.includes('Openness') && top2.includes('Extraversion')) return 'The Visionary Pioneer';
  if (top2.includes('Conscientiousness') && top2.includes('Agreeableness')) return 'The Reliable Partner';
  if (top2.includes('Openness') && top2.includes('Adjustment')) return 'The Calm Innovator';
  
  return 'The Balanced Professional';
};

export const getActionPlan = (scores: OceanScores): string[] => {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const highest = sorted[0][0];
  const lowest = sorted[sorted.length - 1][0];
  
  const plans: string[] = [];
  
  // Highest trait strength
  if (highest === 'Extraversion') plans.push('Leverage your natural energy to lead cross-functional initiatives and build team morale.');
  else if (highest === 'Conscientiousness') plans.push('Use your organizational skills to streamline processes, but remember to leave room for flexibility.');
  else if (highest === 'Openness') plans.push('Pitch your creative ideas to leadership; your ability to see unconventional solutions is a major asset.');
  else if (highest === 'Agreeableness') plans.push('Continue fostering a collaborative environment, but ensure you also advocate for your own ideas.');
  else if (highest === 'Adjustment') plans.push('Act as an anchor during high-stress periods—your calmness can positively influence the whole team.');

  // Lowest trait development area
  if (lowest === 'Extraversion') plans.push('Identify one or two key stakeholders to build deep 1-on-1 relationships with, rather than trying to network broadly.');
  else if (lowest === 'Conscientiousness') plans.push('Implement a simple daily prioritization system (like the Rule of 3) to keep your focus sharp on key deliverables.');
  else if (lowest === 'Openness') plans.push('Challenge yourself to try one new methodology or tool this quarter that disrupts your usual routine.');
  else if (lowest === 'Agreeableness') plans.push('Before critiquing an idea, practice finding one positive aspect to build upon to improve team reception.');
  else if (lowest === 'Adjustment') plans.push('Build proactive buffers into your schedule to handle unexpected setbacks without derailing your momentum.');

  // General professional advice
  plans.push('Share these insights with your manager or team to establish a working style that brings out your best work.');
  
  return plans;
};
