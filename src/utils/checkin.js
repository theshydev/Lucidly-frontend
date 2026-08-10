const NEGATIVE = new Set(['terrible','awful','horrible','bad','sad','anxious','stressed','overwhelmed','miserable','angry','frustrated','upset','down','exhausted','drained','burnt','burned','panic','hopeless','worried','fearful','nervous','tense','irritable','lonely','lost','empty','numb']);
const POSITIVE = new Set(['great','good','happy','excellent','amazing','wonderful','fantastic','awesome','energised','energized','motivated','calm','peaceful','relaxed','fine','okay','alright','positive','hopeful','grateful','content','cheerful','rested']);

function textScore(text, max) {
  const words = text.toLowerCase().split(/\s+/);
  let negative = 0;
  let positive = 0;
  for (const word of words) {
    if (NEGATIVE.has(word)) negative += 1;
    if (POSITIVE.has(word)) positive += 1;
  }
  if (!negative && !positive) return Math.round(max / 2);
  return Math.round((negative / (negative + positive)) * max);
}

export function scoreCheckin({ feeling = '', energy = '', stressors = '' }) {
  const score = Math.min(100, Math.max(0, textScore(feeling, 40) + textScore(energy, 30) + (stressors.trim() ? 25 : 5)));
  const words = `${feeling} ${energy} ${stressors}`.toLowerCase().match(/[a-z]{4,}/g) || [];
  const keywords = [...new Set(words)].slice(0, 6);

  let title = 'A little signal, not a diagnosis.';
  let explanation = 'Your answers give you something to notice, not a label. Take what feels useful and leave the rest.';
  if (score < 30) title = 'You seem to have some room to breathe.';
  else if (score < 55) title = 'There is a little weight here.';
  else if (score < 75) title = 'You might be carrying more than usual.';
  else title = 'Today looks heavy.';

  const recommendations = score < 55
    ? ['Keep one small thing easy today.', 'Notice what is helping, even if it feels minor.', 'Come back later if your mood changes.']
    : ['Give yourself a lower-pressure hour if you can.', 'Put one worry into words instead of carrying it silently.', 'Reach out to someone you trust if you want company.'];

  return { score, keywords, title, explanation, recommendations };
}
