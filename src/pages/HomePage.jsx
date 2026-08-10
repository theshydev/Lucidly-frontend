import React from 'react';
import { ArrowUpRight, BookOpen, Brain, Heart, Sparkles } from 'lucide-react';

export default function HomePage({ user, onNavigate, onAuth }) {
  const firstName = user?.name?.split(' ')[0] || 'you';

  return (
    <div className="lucidly-page lucidly-home-page">
      <section className="editorial-hero">
        <div className="editorial-hero-topline">
          <span>01 — PERSONAL ARCHIVE</span>
          <span>LU / 2026</span>
        </div>

        <div className="editorial-hero-title">
          <p className="editorial-kicker"><Sparkles size={13} /> a quieter place on the internet</p>
          <h1 style={{ fontSize: 'clamp(64px, 8vw, 132px)', maxWidth: '100%' }}>GET TO<br /><em>KNOW</em> YOURSELF.</h1>
          <div className="editorial-hero-copy">
            <p>Lucidly turns tiny moments into a living archive of how you feel, what matters, and what keeps returning.</p>
            <div className="editorial-hero-actions">
              <button className="lucidly-primary-button" onClick={() => user ? onNavigate('today') : onAuth('signup')}>
                {user ? `Enter today, ${firstName}` : 'Start your first check-in'} <ArrowUpRight size={16} />
              </button>
              <button className="lucidly-ghost-button" onClick={() => onNavigate('journal')}>
                <BookOpen size={16} /> write a thought
              </button>
            </div>
          </div>
        </div>

        <div className="editorial-landscape" aria-hidden="true">
          <div className="landscape-sun" />
          <div className="landscape-cloud cloud-a" />
          <div className="landscape-cloud cloud-b" />
          <div className="landscape-mountain mountain-back" />
          <div className="landscape-mountain mountain-front" />
          <div className="landscape-ground" />
          <div className="landscape-person"><span /></div>
          <div className="landscape-caption"><span>FIELD NOTE / 001</span><strong>you don't have to<br />figure everything out.</strong></div>
        </div>
      </section>

      <section className="editorial-intro">
        <div className="editorial-section-number">02</div>
        <div>
          <p className="editorial-kicker">THE IDEA</p>
          <h2>Small enough<br /><em>to come back to.</em></h2>
        </div>
        <p className="editorial-intro-copy">No twelve-step routine. No wall of charts. Lucidly is designed around small interactions that become more interesting when you look back at your own story.</p>
      </section>

      <section className="editorial-feature-spread">
        <button className="editorial-feature editorial-feature-dark" onClick={() => onNavigate('today')}>
          <span className="feature-index">01 / CHECK IN</span>
          <Heart size={20} />
          <strong>How are you,<br /><em>really?</em></strong>
          <span className="feature-arrow"><ArrowUpRight size={18} /></span>
          <small>one minute · no clinical questionnaire</small>
        </button>
        <button className="editorial-feature editorial-feature-paper" onClick={() => onNavigate('journal')}>
          <span className="feature-index">02 / JOURNAL</span>
          <BookOpen size={20} />
          <strong>Put the<br /><em>mess</em> somewhere.</strong>
          <span className="feature-arrow"><ArrowUpRight size={18} /></span>
          <small>private thoughts · your archive</small>
        </button>
        <button className="editorial-feature editorial-feature-accent" onClick={() => onNavigate('insights')}>
          <span className="feature-index">03 / INSIGHTS</span>
          <Brain size={20} />
          <strong>Notice what<br /><em>keeps happening.</em></strong>
          <span className="feature-arrow"><ArrowUpRight size={18} /></span>
          <small>patterns · rhythms · your own words</small>
        </button>
      </section>

      <section className="editorial-manifesto">
        <span>03 — LUCIDLY PHILOSOPHY</span>
        <blockquote>“You are not a score.<br />The numbers are only a way to notice the story.”</blockquote>
        <div className="editorial-manifesto-mark">✦</div>
      </section>
    </div>
  );
}
