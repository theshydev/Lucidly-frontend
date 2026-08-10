import React from 'react';
import { ArrowRight, BookOpen, Brain, Flame, Heart, Sparkles } from 'lucide-react';

export default function HomePage({ user, onNavigate, onAuth }) {
  const firstName = user?.name?.split(' ')[0] || 'you';

  return (
    <div className="lucidly-page lucidly-home-page">
      <section className="lucidly-hero-grid">
        <div className="lucidly-hero-copy">
          <span className="lucidly-eyebrow"><Sparkles size={14} /> your little corner of the internet</span>
          <h1>Know yourself.<br /><em>Without making it homework.</em></h1>
          <p>Lucidly turns tiny moments of reflection into a living picture of how you feel, what matters to you, and what keeps showing up.</p>
          <div className="lucidly-hero-actions">
            <button className="lucidly-primary-button" onClick={() => user ? onNavigate('today') : onAuth('signup')}>
              {user ? `Check in, ${firstName}` : 'Make your first check-in'} <ArrowRight size={17} />
            </button>
            <button className="lucidly-ghost-button" onClick={() => onNavigate('journal')}><BookOpen size={17} /> Write something</button>
          </div>
        </div>
        <div className="lucidly-hero-card">
          <div className="lucidly-orbit orbit-one" />
          <div className="lucidly-orbit orbit-two" />
          <div className="lucidly-mini-card lucidly-mini-card-main">
            <span>today's vibe</span>
            <strong>{user ? 'whatever you say it is.' : 'you decide.'}</strong>
            <div className="lucidly-vibe-row"><span>☁️</span><span>🌙</span><span>✨</span><span>🫧</span><span>🌱</span></div>
          </div>
          <div className="lucidly-floating-note note-one">no pressure.</div>
          <div className="lucidly-floating-note note-two">just check in ♡</div>
        </div>
      </section>

      <section className="lucidly-section">
        <div className="lucidly-section-heading"><span>01 / the point</span><h2>Small enough to actually use.</h2><p>You do not need a 20-minute routine. Lucidly is built around tiny interactions that become meaningful when you look back.</p></div>
        <div className="lucidly-feature-grid">
          <button className="lucidly-feature-card" onClick={() => onNavigate('today')}><span className="lucidly-feature-icon"><Heart /></span><small>01</small><h3>Check in</h3><p>Tell us the vibe. One minute, no clinical questionnaire.</p></button>
          <button className="lucidly-feature-card" onClick={() => onNavigate('journal')}><span className="lucidly-feature-icon"><BookOpen /></span><small>02</small><h3>Dump your brain</h3><p>Write the thing you cannot quite say out loud.</p></button>
          <button className="lucidly-feature-card" onClick={() => onNavigate('insights')}><span className="lucidly-feature-icon"><Brain /></span><small>03</small><h3>Notice patterns</h3><p>Look back and spot what keeps appearing in your own words.</p></button>
        </div>
      </section>

      <section className="lucidly-manifesto">
        <div><Flame size={20} /><span>lucidly philosophy</span></div>
        <p>“You are not a score. The numbers are just a way to notice the story.”</p>
      </section>
    </div>
  );
}
