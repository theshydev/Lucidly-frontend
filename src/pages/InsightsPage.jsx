import React from 'react';
import { Activity, ArrowUpRight, Brain, CalendarDays, Flame, TrendingUp } from 'lucide-react';

export default function InsightsPage({ authFetch }) {
  const [moods, setMoods] = React.useState([]);
  const [checkins, setCheckins] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([authFetch('/api/moods'), authFetch('/api/checkins')])
      .then(async ([moodRes, checkinRes]) => {
        const moodData = await moodRes.json();
        const checkinData = await checkinRes.json();
        setMoods(moodData.logs || []);
        setCheckins(checkinData.checkins || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authFetch]);

  const average = moods.length ? (moods.reduce((sum, item) => sum + Number(item.value), 0) / moods.length).toFixed(1) : '—';
  const streak = (() => {
    if (!moods.length) return 0;
    const dates = new Set(moods.map((item) => item.date?.slice(0, 10)));
    let count = 0;
    const day = new Date();
    while (dates.has(day.toISOString().slice(0, 10))) { count += 1; day.setDate(day.getDate() - 1); }
    return count;
  })();
  const latest = moods.slice(0, 7).reverse();
  const bars = latest.map((item) => ({ ...item, height: Math.max(16, (Number(item.value) / 5) * 100) }));

  return (
    <div className="lucidly-page">
      <div className="lucidly-page-kicker"><Brain size={14} /> INSIGHTS / YOUR PATTERNS</div>
      <div className="lucidly-page-title"><h1>Look back, not down.</h1><p>Your data is here to help you notice yourself — not judge yourself.</p></div>

      <div className="lucidly-stat-grid">
        <div className="lucidly-stat-card"><Activity size={18} /><span>average vibe</span><strong>{average}</strong><small>out of 5</small></div>
        <div className="lucidly-stat-card"><Flame size={18} /><span>current streak</span><strong>{streak}</strong><small>days</small></div>
        <div className="lucidly-stat-card"><CalendarDays size={18} /><span>mood logs</span><strong>{moods.length}</strong><small>saved moments</small></div>
        <div className="lucidly-stat-card"><TrendingUp size={18} /><span>check-ins</span><strong>{checkins.length}</strong><small>reflections</small></div>
      </div>

      <section className="lucidly-chart-card">
        <div className="lucidly-card-heading"><div><span>last 7 logged moods</span><h2>Your week, in tiny signals.</h2></div><ArrowUpRight size={18} /></div>
        {loading ? <div className="lucidly-empty-state">reading your archive...</div> : bars.length ? <div className="lucidly-bars">{bars.map((item) => <div className="lucidly-bar-wrap" key={item.id}><div className="lucidly-bar" style={{ height: `${item.height}%` }} title={`${item.mood}: ${item.value}/5`} /><small>{new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' })}</small></div>)}</div> : <div className="lucidly-empty-state">Log a few moods and this space will start telling you a story.</div>}
      </section>

      <section className="lucidly-insight-note"><span>one thing to remember</span><h2>Patterns are information, not personality.</h2><p>A rough week does not become your identity because a graph had a bad Tuesday.</p></section>
    </div>
  );
}
