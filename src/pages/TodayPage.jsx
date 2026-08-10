import React from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { scoreCheckin } from '../utils/checkin.js';

const moods = [
  { label: 'rough', value: 1, emoji: '🫠' },
  { label: 'meh', value: 2, emoji: '😐' },
  { label: 'okay', value: 3, emoji: '🙂' },
  { label: 'good', value: 4, emoji: '✨' },
  { label: 'great', value: 5, emoji: '🪩' },
];

export default function TodayPage({ authFetch }) {
  const [mood, setMood] = React.useState(null);
  const [feeling, setFeeling] = React.useState('');
  const [energy, setEnergy] = React.useState('');
  const [stressors, setStressors] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const submit = async () => {
    if (!mood) return setMessage('Pick a vibe first. No overthinking it.');
    setSaving(true);
    setMessage('');
    try {
      const checkin = scoreCheckin({ feeling, energy, stressors });
      const date = new Date().toISOString().slice(0, 10);
      const moodRes = await authFetch('/api/moods', { method: 'POST', body: JSON.stringify({ date, mood: moods[mood - 1].label, value: mood }) });
      if (!moodRes.ok) throw new Error('Could not save your mood.');
      const checkinRes = await authFetch('/api/checkins', { method: 'POST', body: JSON.stringify({ feeling, energy, stressors, score: checkin.score, keywords: checkin.keywords, explanation: checkin.explanation }) });
      if (!checkinRes.ok) throw new Error('Could not save your check-in.');
      setResult(checkin);
      setMessage('Filed. Future-you can look back at this.');
    } catch (error) {
      setMessage(error.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="lucidly-page lucidly-narrow-page">
      <div className="lucidly-page-kicker"><Sparkles size={14} /> TODAY / FIELD NOTE 01</div>
      <div className="lucidly-page-title">
        <h1>How does today<br /><em>feel from the inside?</em></h1>
        <p>Pick the closest answer. It doesn't have to be accurate. This is a snapshot, not a verdict.</p>
      </div>

      <section className="lucidly-mood-picker">
        {moods.map((item) => (
          <button key={item.value} className={`lucidly-mood ${mood === item.value ? 'selected' : ''}`} onClick={() => setMood(item.value)}>
            <span>{item.emoji}</span><small>{item.label}</small>
          </button>
        ))}
      </section>

      <section className="lucidly-form-card">
        <label>01 / what is taking up space?</label>
        <textarea value={feeling} onChange={(e) => setFeeling(e.target.value)} placeholder="one sentence is enough..." rows={3} />
        <label>02 / where is your energy?</label>
        <textarea value={energy} onChange={(e) => setEnergy(e.target.value)} placeholder="wired, sleepy, locked in, empty..." rows={2} />
        <label>03 / anything you want to leave here?</label>
        <textarea value={stressors} onChange={(e) => setStressors(e.target.value)} placeholder="optional. you can leave this blank." rows={2} />
        <button className="lucidly-primary-button lucidly-full-button" onClick={submit} disabled={saving}>
          {saving ? 'filing...' : <>File today's note <ArrowRight size={17} /></>}
        </button>
        {message && <p className="lucidly-form-message">{message}</p>}
      </section>

      {result && (
        <section className="lucidly-result-card">
          <div className="lucidly-result-score"><span>reflection signal</span><strong>{result.score}</strong><small>/ 100</small></div>
          <div><span className="lucidly-result-label">a small interpretation</span><h2>{result.title}</h2><p>{result.explanation}</p></div>
          <div className="lucidly-result-list">{result.recommendations.map((item) => <div key={item}><Check size={15} /> {item}</div>)}</div>
          <p className="lucidly-disclaimer">A reflection aid, not a medical or mental-health diagnosis.</p>
        </section>
      )}
    </div>
  );
}
