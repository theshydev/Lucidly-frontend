import React from 'react';
import { Download, ExternalLink, Share2, Sparkles } from 'lucide-react';

function escapeXml(value = '') {
  return String(value).replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '\"': '&quot;' }[char]));
}

function buildCardSvg({ name, handle, moodCount, journalCount, checkinCount, streak, vibe }) {
  const safeName = escapeXml(name);
  const safeHandle = escapeXml(handle);
  const safeVibe = escapeXml(vibe);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
  <rect width="1200" height="760" fill="#eee8dd"/>
  <rect x="28" y="28" width="1144" height="704" rx="8" fill="#f7f2e9" stroke="#242321" stroke-width="3"/>
  <path d="M55 128H1145M55 585H1145" stroke="#242321" stroke-width="2" opacity=".65"/>
  <text x="58" y="96" font-family="Georgia,serif" font-size="64" font-weight="700" letter-spacing="8" fill="#242321">PROFILE</text>
  <text x="1142" y="86" text-anchor="end" font-family="Arial,sans-serif" font-size="16" letter-spacing="4" fill="#6d665c">LUCIDLY FILE / PERSONAL</text>
  <rect x="72" y="165" width="450" height="350" rx="6" fill="#252321" transform="rotate(-3 297 340)"/>
  <rect x="96" y="184" width="402" height="310" fill="#ddd5c7" transform="rotate(-3 297 340)"/>
  <circle cx="297" cy="305" r="82" fill="#3b3940"/>
  <text x="297" y="320" text-anchor="middle" font-family="Georgia,serif" font-size="82" fill="#e7d8c2">✦</text>
  <text x="102" y="548" font-family="Arial,sans-serif" font-size="14" letter-spacing="3" fill="#6d665c">USERNAME</text>
  <text x="102" y="584" font-family="Arial,sans-serif" font-size="34" font-weight="700" letter-spacing="2" fill="#242321">${safeHandle}</text>
  <text x="102" y="615" font-family="Arial,sans-serif" font-size="14" fill="#6d665c">${safeName}</text>
  <text x="570" y="185" font-family="Arial,sans-serif" font-size="15" letter-spacing="4" fill="#6d665c">CODENAME</text>
  <text x="570" y="240" font-family="Georgia,serif" font-size="48" font-weight="700" fill="#242321">${safeVibe}</text>
  <text x="570" y="278" font-family="Arial,sans-serif" font-size="16" fill="#6d665c">“figuring things out, one day at a time.”</text>
  <g font-family="Arial,sans-serif" fill="#242321">
    <text x="570" y="340" font-size="15" letter-spacing="2">MOOD DAYS</text><text x="1110" y="340" text-anchor="end" font-size="24" font-weight="700">${moodCount}</text>
    <text x="570" y="390" font-size="15" letter-spacing="2">JOURNAL ENTRIES</text><text x="1110" y="390" text-anchor="end" font-size="24" font-weight="700">${journalCount}</text>
    <text x="570" y="440" font-size="15" letter-spacing="2">CHECK-INS</text><text x="1110" y="440" text-anchor="end" font-size="24" font-weight="700">${checkinCount}</text>
    <text x="570" y="490" font-size="15" letter-spacing="2">BEST CURRENT STREAK</text><text x="1110" y="490" text-anchor="end" font-size="24" font-weight="700">${streak} DAYS</text>
  </g>
  <rect x="72" y="625" width="1040" height="76" fill="#242321"/>
  <text x="96" y="655" font-family="Georgia,serif" font-size="24" fill="#f7f2e9">lucidly</text>
  <text x="96" y="681" font-family="Arial,sans-serif" font-size="12" letter-spacing="2" fill="#c8c0b4">MENTAL WELLNESS, MADE PERSONAL.</text>
  <text x="1080" y="672" text-anchor="end" font-family="Arial,sans-serif" font-size="13" letter-spacing="2" fill="#c8c0b4">SHARE WHAT YOU CHOOSE.</text>
</svg>`;
}

export default function ProfilePage({ user, authFetch }) {
  const [stats, setStats] = React.useState({ moods: 0, journals: 0, checkins: 0, streak: 0 });
  const [vibe, setVibe] = React.useState('DREAMER');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    Promise.all([authFetch('/api/moods'), authFetch('/api/journal'), authFetch('/api/checkins')])
      .then(async ([moodsRes, journalRes, checkinRes]) => {
        const moods = await moodsRes.json();
        const journals = await journalRes.json();
        const checkins = await checkinRes.json();
        const logs = moods.logs || [];
        const dates = new Set(logs.map((item) => item.date?.slice(0, 10)));
        let streak = 0; const day = new Date();
        while (dates.has(day.toISOString().slice(0, 10))) { streak += 1; day.setDate(day.getDate() - 1); }
        setStats({ moods: logs.length, journals: (journals.entries || (journals.entry ? [journals.entry] : [])).length, checkins: (checkins.checkins || []).length, streak });
      })
      .catch(() => {});
  }, [authFetch]);

  const handle = `@${(user?.name || 'lucidly-user').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 18)}`;
  const cardSvg = buildCardSvg({ name: user?.name || 'Lucidly user', handle, moodCount: stats.moods, journalCount: stats.journals, checkinCount: stats.checkins, streak: stats.streak, vibe });

  const download = () => {
    const blob = new Blob([cardSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'lucidly-profile.svg'; link.click(); URL.revokeObjectURL(url);
    setMessage('Card exported.');
  };

  const share = async () => {
    const text = `My Lucidly profile — ${handle}. ${stats.moods} mood days, ${stats.journals} journal entries, ${stats.streak} day streak.`;
    try {
      if (navigator.share) await navigator.share({ title: 'My Lucidly profile', text });
      else { await navigator.clipboard.writeText(text); setMessage('Profile text copied.'); }
    } catch {}
  };

  return (
    <div className="lucidly-page">
      <div className="lucidly-page-kicker"><Sparkles size={14} /> PROFILE / YOUR FILE</div>
      <div className="lucidly-page-title"><h1>Your internet identity, but softer.</h1><p>Choose what you want to show. Private journal text never belongs on this card.</p></div>
      <section className="lucidly-profile-layout">
        <div className="lucidly-profile-preview">
          <div className="lucidly-profile-sheet">
            <div className="lucidly-sheet-header"><strong>PROFILE</strong><span>LUCIDLY FILE / PERSONAL</span></div>
            <div className="lucidly-sheet-body">
              <div className="lucidly-id-card"><div className="lucidly-avatar-placeholder">✦</div><small>USERNAME</small><strong>{handle}</strong><span>{user?.name}</span></div>
              <div className="lucidly-profile-details"><small>CODENAME</small><h2>{vibe}</h2><p>“figuring things out, one day at a time.”</p><div className="lucidly-profile-stat-list"><span>MOOD DAYS <b>{stats.moods}</b></span><span>JOURNAL ENTRIES <b>{stats.journals}</b></span><span>CHECK-INS <b>{stats.checkins}</b></span><span>CURRENT STREAK <b>{stats.streak} DAYS</b></span></div></div>
            </div>
            <div className="lucidly-sheet-footer">lucidly <span>MENTAL WELLNESS, MADE PERSONAL.</span></div>
          </div>
        </div>
        <aside className="lucidly-profile-controls">
          <label>your codename</label>
          <input value={vibe} onChange={(e) => setVibe(e.target.value.toUpperCase().slice(0, 16))} placeholder="DREAMER" />
          <p>Try something that feels like you: DREAMER, NIGHT OWL, OVERTHINKER, CHAOS, SOFTIE...</p>
          <button className="lucidly-primary-button lucidly-full-button" onClick={download}><Download size={16} /> Export card</button>
          <button className="lucidly-ghost-button lucidly-full-button" onClick={share}><Share2 size={16} /> Share profile</button>
          <a className="lucidly-text-link" href="#" onClick={(e) => e.preventDefault()}><ExternalLink size={14} /> Public profile coming next</a>
          {message && <p className="lucidly-form-message">{message}</p>}
        </aside>
      </section>
    </div>
  );
}
