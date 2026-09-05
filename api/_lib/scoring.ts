const questions = [
  ['Openness',false],['Openness',false],['Openness',true],['Openness',false],['Conscientiousness',false],['Conscientiousness',false],['Conscientiousness',true],['Conscientiousness',false],['Extraversion',false],['Extraversion',false],['Extraversion',true],['Extraversion',false],['Agreeableness',false],['Agreeableness',false],['Agreeableness',true],['Agreeableness',false],['Neuroticism',false],['Neuroticism',false],['Neuroticism',true],['Neuroticism',false],
] as const;
export function calculateScores(answers: Record<number, number>) {
 const sums: Record<string,{total:number;count:number}> = Object.fromEntries(['Openness','Conscientiousness','Extraversion','Agreeableness','Neuroticism'].map(t=>[t,{total:0,count:0}]));
 questions.forEach(([trait,reverse], index) => { const answer=answers[index+1]; if (!Number.isInteger(answer)||answer<1||answer>5) throw new Error('All 20 answers must be values from 1 through 5.'); const value=reverse?6-answer:answer; sums[trait].total+=value;sums[trait].count++; });
 const normalized=(value:number)=>Math.round(((value-1)/4)*100); const average=(trait:string)=>sums[trait].total/sums[trait].count;
 return { Openness:normalized(average('Openness')), Conscientiousness:normalized(average('Conscientiousness')), Extraversion:normalized(average('Extraversion')), Agreeableness:normalized(average('Agreeableness')), Adjustment:normalized(6-average('Neuroticism')) };
}
