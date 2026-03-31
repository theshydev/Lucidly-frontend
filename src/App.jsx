import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, SmilePlus, BarChart2, Brain,
  ArrowRight, Star, Heart, Shield, Activity, Sparkles,
  Menu, X, Sun, Moon, LogOut, User
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AuthModal from './components/AuthModal.jsx';
import heroImage from '../assets/lucidly-hero.png';
import logoImg from '../assets/lucidly-logo.png';

// ─── Constants ────────────────────────────────────────────────────────────────
const MOOD_OPTIONS = ['Happy', 'Neutral', 'Sad'];
const MOOD_VALUE = { Happy: 3, Neutral: 2, Sad: 1 };
const MOOD_EMOJI = { Happy: '😊', Neutral: '😐', Sad: '😔' };

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Stress scoring ───────────────────────────────────────────────────────────
const NEGATIVE_WORDS = new Set(['terrible','awful','horrible','bad','sad','depressed','anxious','stressed','overwhelmed','miserable','angry','frustrated','upset','down','exhausted','drained','burnt','burned','panic','hopeless','worried','fearful','nervous','tense','irritable','lonely','lost','empty','numb']);
const POSITIVE_WORDS = new Set(['great','good','happy','excellent','amazing','wonderful','fantastic','awesome','energised','energized','motivated','calm','peaceful','relaxed','fine','okay','alright','positive','hopeful','grateful','content','cheerful','rested']);
const NEUTRAL_STRESSOR_WORDS = new Set(['no','none','nothing','nope','nah','not']);

function scoreText(text, negSet, posSet, max) {
  const words = text.toLowerCase().split(/\s+/);
  let neg = 0, pos = 0;
  words.forEach(w => { if (negSet.has(w)) neg++; if (posSet.has(w)) pos++; });
  if (neg === 0 && pos === 0) return max / 2;
  return Math.round((neg / (neg + pos)) * max);
}
function extractKeywords(text) {
  const stop = new Set(['i','am','a','an','the','is','was','and','or','but','have','had','been','my','me','so','just','very','its','with','that','this','are','for','on','in','at','to','of','it','do','did','not','no','yes','some','any','from','as','by','be']);
  return text.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z]/g,'')).filter(w => w.length > 2 && !stop.has(w)).slice(0, 6);
}
function computeCheckin(feeling, energy, stressors) {
  const feelingScore = scoreText(feeling, NEGATIVE_WORDS, POSITIVE_WORDS, 40);
  const energyScore = scoreText(energy, NEGATIVE_WORDS, POSITIVE_WORDS, 30);
  const isNoStressor = stressors.toLowerCase().split(/\s+/).some(w => NEUTRAL_STRESSOR_WORDS.has(w));
  const stressorScore = isNoStressor ? 5 : (stressors.trim().length > 2 ? 25 : 15);
  const score = Math.min(100, Math.max(0, feelingScore + energyScore + stressorScore));
  const keywords = [...extractKeywords(feeling), ...extractKeywords(energy), ...extractKeywords(stressors)].filter((v,i,a) => a.indexOf(v)===i).slice(0,6);
  let explanation, recommendations;
  if (score < 30) {
    explanation = 'You appear to be in a positive and balanced state. Your responses suggest good emotional regulation and energy levels.';
    recommendations = ["Keep up your current self-care routine — it's working.", "Journal what's going well to reinforce positive habits.", "Share your energy with someone who might need it today."];
  } else if (score < 55) {
    explanation = "You're experiencing moderate stress. This is normal and manageable with the right strategies.";
    recommendations = ["Take a 5-minute break every hour and step away from screens.", "Try a breathing exercise: inhale 4 counts, hold 4, exhale 6.", "Write down your top three priorities for today to reduce mental load."];
  } else if (score < 75) {
    explanation = "Elevated stress detected. Your energy and emotional state suggest you're carrying a significant load right now.";
    recommendations = ["Prioritise sleep tonight — aim for at least 7–8 hours.", "Do a 10-minute walk outside; physical movement reduces cortisol.", "Reach out to a trusted person and share how you're feeling.", "Try a short mindfulness or body-scan meditation."];
  } else {
    explanation = "High stress levels detected. It's important to take action and be kind to yourself right now.";
    recommendations = ["Please consider speaking with a counsellor or mental health professional.", "Remove or delegate at least one responsibility from your plate today.", "Grounding: name 5 things you can see, 4 you can touch, 3 you can hear.", "Avoid caffeine and heavy screens in the next 2 hours.", "Crisis line (US): 988 Suicide & Crisis Lifeline — call or text 988."];
  }
  return { score: score.toFixed(1), keywords, explanation, recommendations };
}

// ─── Inner App (uses auth context) ────────────────────────────────────────────
function InnerApp() {
  const { user, logout, authFetch } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('lucidly_dark_mode');
    return stored !== null ? stored === 'true' : true;
  });
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null

  const navigateTo = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('lucidly_dark_mode', String(next));
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const dm = isDarkMode;

  // Require auth to navigate to feature pages
  const requireAuth = (page) => {
    if (!user) { setAuthModal('signup'); return; }
    navigateTo(page);
  };

  // ── Shared UI ────────────────────────────────────────────────────────────
  const BackButton = () => (
    <button onClick={() => navigateTo('home')} className="mb-6 flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
      <ArrowRight className="w-4 h-4 rotate-180" /> Back to home
    </button>
  );

  const PageShell = ({ children }) => (
    <div className={`min-h-screen p-4 md:p-8 flex flex-col items-center justify-center ${dm ? 'bg-[#090514] text-slate-200' : 'bg-gray-50 text-gray-800'}`}>
      <div className={`w-full max-w-xl rounded-2xl shadow-2xl p-6 border ${dm ? 'bg-[#0d081f] border-indigo-900/40' : 'bg-white border-gray-200'}`}>
        {children}
      </div>
    </div>
  );

  // ── Home Page ────────────────────────────────────────────────────────────
  const HomePage = () => {
    const darkBg = dm;

    const navBg = darkBg ? 'bg-[#090514]/80 border-indigo-900/30' : 'bg-white/90 border-gray-200';
    const textPrimary = darkBg ? 'text-white' : 'text-gray-900';
    const textMuted = darkBg ? 'text-slate-400' : 'text-gray-500';
    const textBody = darkBg ? 'text-indigo-200/80' : 'text-gray-600';
    const sectionBg2 = darkBg ? 'bg-[#0d081f]' : 'bg-gray-50';
    const sectionBg3 = darkBg ? 'bg-[#05020a]' : 'bg-gray-100';
    const cardBg = darkBg ? 'bg-gradient-to-b from-white/5 to-transparent border-white/10' : 'bg-white border-gray-200 shadow-sm';
    const heroBg = darkBg ? 'bg-[#090514]' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50';
    const testimonialBg = darkBg ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm';
    const testimonialFeaturedBg = darkBg ? 'bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200';
    const footerBg = darkBg ? 'bg-[#05020a] border-white/10' : 'bg-gray-900 border-gray-700';
    const footerText = 'text-gray-400';

    return (
      <div className={`min-h-screen ${heroBg} ${darkBg ? 'text-slate-200' : 'text-gray-800'} font-sans overflow-x-hidden selection:bg-indigo-500/30`}>

        {/* Nav */}
        <nav className={`sticky top-0 z-50 px-6 py-4 backdrop-blur-md ${navBg} border-b`}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="Lucidly" className="w-8 h-8 rounded-full"
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
              />
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 items-center justify-center hidden">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className={`font-bold text-xl tracking-tight ${textPrimary}`}>Lucidly</span>
            </div>

            <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${textMuted}`}>
              <button onClick={() => scrollToSection('features')} className="hover:text-indigo-400 transition-colors">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-indigo-400 transition-colors">How it works</button>
              <button onClick={() => scrollToSection('testimonials')} className="hover:text-indigo-400 transition-colors">Stories</button>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors ${darkBg ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}>
                {darkBg ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              {user ? (
                <>
                  <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
                    <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <span className={textPrimary}>{user.name.split(' ')[0]}</span>
                  </div>
                  <button onClick={logout} className={`text-sm font-medium transition-colors ${textMuted} hover:text-red-400 flex items-center gap-1`}>
                    <LogOut className="w-3.5 h-3.5" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setAuthModal('login')} className={`text-sm font-medium transition-colors ${textMuted} hover:text-indigo-400`}>Sign in</button>
                  <button onClick={() => setAuthModal('signup')} className="text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-indigo-400 hover:to-purple-400 transition-all">
                    Get Started
                  </button>
                </>
              )}
            </div>

            <button className={`md:hidden p-2 transition-colors ${darkBg ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className={`md:hidden absolute inset-x-0 top-full border-b px-6 py-6 flex flex-col gap-5 ${darkBg ? 'bg-[#0d081f] border-indigo-900/40' : 'bg-white border-gray-100'}`}>
              {[['Features', () => scrollToSection('features')], ['How it works', () => scrollToSection('how-it-works')], ['Stories', () => scrollToSection('testimonials')]].map(([l, a]) => (
                <button key={l} onClick={a} className={`text-left text-lg font-medium transition-colors ${darkBg ? 'text-slate-300 hover:text-white' : 'text-gray-700 hover:text-indigo-600'}`}>{l}</button>
              ))}
              <div className={`pt-4 border-t flex flex-col gap-3 ${darkBg ? 'border-indigo-900/40' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${textMuted}`}>{darkBg ? 'Light mode' : 'Dark mode'}</span>
                  <button onClick={toggleDarkMode} className={`p-2 rounded-full ${darkBg ? 'text-slate-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`}>
                    {darkBg ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
                {user ? (
                  <button onClick={logout} className="text-red-400 font-medium text-left flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign out</button>
                ) : (
                  <>
                    <button onClick={() => { setIsMenuOpen(false); setAuthModal('login'); }} className={`font-medium text-left ${textMuted}`}>Sign in</button>
                    <button onClick={() => { setIsMenuOpen(false); setAuthModal('signup'); }} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-5 py-3 rounded-full text-center hover:from-indigo-400 hover:to-purple-400">Get Started</button>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Hero */}
        <section className="relative pt-24 pb-32 px-6 overflow-hidden">
          {darkBg && <>
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
          </>}
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="lg:w-1/2 flex flex-col items-start text-left">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 ${darkBg ? 'bg-indigo-900/40 border border-indigo-700/50 text-indigo-300' : 'bg-indigo-100 border border-indigo-200 text-indigo-600'}`}>
                <Sparkles className="w-3 h-3" />
                <span>Your personal sanctuary</span>
              </div>
              <h1 className={`text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 ${textPrimary}`}>
                Find clarity in the noise.
              </h1>
              <p className={`text-lg mb-10 max-w-md leading-relaxed ${textBody}`}>
                A private space to journal your thoughts, track your emotional rhythms, and understand yourself better through compassionate AI guidance.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <button onClick={() => requireAuth('journaling')}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-400 hover:to-purple-400 transition-all shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2">
                  Start your journey <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => scrollToSection('features')}
                  className={`px-8 py-4 rounded-full font-medium border transition-colors text-center ${darkBg ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                  See features
                </button>
              </div>
              {user && (
                <p className="mt-5 text-sm text-indigo-400">
                  Welcome back, {user.name.split(' ')[0]}! <button onClick={() => navigateTo('journaling')} className="underline hover:text-indigo-300">Open your journal</button>
                </p>
              )}
            </div>
            <div className="lg:w-1/2 relative w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/20 border border-white/10 aspect-[4/3] group">
                <div className={`absolute inset-0 z-10 opacity-60 ${darkBg ? 'bg-gradient-to-t from-[#090514] via-transparent to-transparent' : 'bg-gradient-to-t from-indigo-900/20 via-transparent to-transparent'}`} />
                <img src={heroImage} alt="Mental clarity visualization" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
                <div className={`absolute bottom-6 left-6 right-6 z-20 backdrop-blur-md border p-4 rounded-xl flex items-center gap-4 ${darkBg ? 'bg-[#090514]/40 border-white/10' : 'bg-white/80 border-white/60'}`}>
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 shrink-0">
                    <Brain className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${darkBg ? 'text-white' : 'text-gray-900'}`}>AI Check-in</p>
                    <p className={`text-xs ${darkBg ? 'text-indigo-200' : 'text-gray-600'}`}>"You seem stressed. Let's take a breath."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className={`py-32 px-6 relative border-t ${darkBg ? 'border-white/5' : 'border-gray-100'} ${sectionBg2}`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${textPrimary}`}>Tools for your mind.</h2>
              <p className={`text-lg ${textBody}`}>Everything you need to build emotional awareness, all in one calm, private space.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: BookOpen, hoverBorder: 'hover:border-blue-500/30', iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:bg-blue-500/20', title: 'Reflective Journaling', desc: 'A judgment-free zone to pour your thoughts out. Express your experiences freely with a beautiful, distraction-free editor.', page: 'journaling' },
                { icon: SmilePlus, hoverBorder: 'hover:border-green-500/30', iconBg: 'bg-green-500/10 border-green-500/20 text-green-400 group-hover:bg-green-500/20', title: 'Daily Tracker', desc: 'Log your mood and energy levels in seconds. Build a habit of checking in with yourself without it feeling like a chore.', page: 'tracker' },
                { icon: BarChart2, hoverBorder: 'hover:border-purple-500/30', iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover:bg-purple-500/20', title: 'Deep Analytics', desc: 'Spot patterns in your emotional rhythms. See how your sleep, activities, and stressors correlate with your overall wellbeing.', page: 'analytics' },
                { icon: Brain, hoverBorder: 'hover:border-pink-500/30', iconBg: 'bg-pink-500/10 border-pink-500/20 text-pink-400 group-hover:bg-pink-500/20', title: 'AI-Guided Check-ins', desc: "When you're overwhelmed, our compassionate AI helps you untangle your thoughts and guides you through grounding exercises.", page: 'ai-checkin' },
              ].map(({ icon: Icon, hoverBorder, iconBg, title, desc, page }) => (
                <button key={page} onClick={() => requireAuth(page)}
                  className={`group p-8 rounded-3xl border transition-all text-left ${cardBg} ${hoverBorder}`}>
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 group-hover:scale-110 transition-all ${iconBg}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${textPrimary}`}>{title}</h3>
                  <p className={textBody}>{desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-32 px-6 relative">
          {darkBg && <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-indigo-900/50 to-transparent hidden md:block" />}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${textPrimary}`}>How it unfolds.</h2>
            </div>
            <div className="space-y-12 md:space-y-0">
              {[
                { n: '1', title: 'Check in daily', desc: "Take 30 seconds to log how you're feeling. A simple act of mindfulness to anchor your day.", color: 'indigo', icon: Activity, flip: false },
                { n: '2', title: 'Journal freely', desc: 'When things get heavy, write it out. Your private space to process complex emotions.', color: 'purple', icon: BookOpen, flip: true },
                { n: '3', title: 'Gain insights', desc: 'Watch patterns emerge. Understand what drains you and what gives you life over time.', color: 'blue', icon: BarChart2, flip: false },
              ].map(({ n, title, desc, color, icon: Icon, flip }) => (
                <div key={n} className={`flex flex-col ${flip ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between group md:mt-24 first:md:mt-0`}>
                  <div className={`md:w-5/12 text-center ${flip ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'} mb-6 md:mb-0`}>
                    <h3 className={`text-2xl font-bold mb-3 ${textPrimary}`}>{title}</h3>
                    <p className={textBody}>{desc}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold z-10 transition-colors shrink-0 shadow-[0_0_15px_rgba(79,70,229,0.2)] ${darkBg ? `bg-[#090514] border-4 border-${color}-900 text-${color}-400 group-hover:border-${color}-500 group-hover:text-${color}-300` : `bg-white border-4 border-${color}-200 text-${color}-500 group-hover:border-${color}-400 shadow-md`}`}>
                    {n}
                  </div>
                  <div className={`md:w-5/12 ${flip ? 'md:pr-12' : 'md:pl-12'} hidden md:block`}>
                    <div className={`h-32 rounded-2xl flex items-center justify-center border ${darkBg ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                      <Icon className={`w-8 h-8 ${darkBg ? `text-${color}-500/50` : `text-${color}-300`}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className={`py-32 px-6 border-y ${darkBg ? sectionBg3 + ' border-white/5' : 'bg-gray-50 border-gray-100'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-5xl font-bold ${textPrimary}`}>Stories of clarity.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {[
                { quote: "It feels like the first time an app isn't trying to hack my attention. It's just a quiet place for my brain to rest. The AI check-ins actually calm me down.", name: 'Elena R.', role: 'Grad Student', featured: false },
                { quote: "I used to get overwhelmed by complex journaling apps. Lucidly is so beautiful and minimal that I actually look forward to logging my mood every evening.", name: 'Marcus T.', role: 'Software Engineer', featured: true },
                { quote: "The analytics finally helped me realize my anxiety spikes directly correlate with my sleep quality. Seeing it visualized changed my habits.", name: 'Sarah K.', role: 'Product Manager', featured: false },
              ].map(({ quote, name, role, featured }) => (
                <div key={name} className={`p-8 rounded-3xl flex flex-col h-full border ${featured ? (darkBg ? `${testimonialFeaturedBg} md:-translate-y-4` : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 md:-translate-y-4') : testimonialBg}`}>
                  <div className="flex gap-1 mb-6 text-indigo-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className={`text-lg leading-relaxed mb-8 flex-grow ${darkBg ? 'text-indigo-100/90' : 'text-gray-700'}`}>"{quote}"</p>
                  <div>
                    <p className={`font-medium ${textPrimary}`}>{name}</p>
                    <p className={`text-sm ${textMuted}`}>{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 relative overflow-hidden">
          {darkBg && <>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/20" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none" />
          </>}
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-px mb-8 shadow-2xl shadow-indigo-500/30">
              <div className={`w-full h-full rounded-[23px] flex items-center justify-center ${darkBg ? 'bg-[#090514]' : 'bg-white'}`}>
                <Heart className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${textPrimary}`}>Start your inner dialogue.</h2>
            <p className={`text-xl mb-10 max-w-2xl mx-auto ${textBody}`}>
              Join thousands of others who have found clarity and peace with Lucidly. Your mind deserves a beautiful space.
            </p>
            <button onClick={() => user ? requireAuth('journaling') : setAuthModal('signup')}
              className={`px-10 py-5 rounded-full font-semibold text-lg hover:scale-105 transition-all ${darkBg ? 'bg-white text-[#090514] hover:bg-indigo-50 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]'}`}>
              {user ? 'Open your journal' : 'Create your free account'}
            </button>
            <p className={`mt-6 text-sm flex items-center justify-center gap-2 ${darkBg ? 'text-indigo-400/60' : 'text-gray-400'}`}>
              <Shield className="w-4 h-4" /> Your data is private and encrypted.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-12 px-6 border-t text-sm ${footerBg}`}>
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src={logoImg} alt="Lucidly" className="w-5 h-5 rounded-full" onError={e => e.target.style.display='none'} />
                <span className="font-bold text-lg text-white">Lucidly</span>
              </div>
              <p className={`max-w-xs ${footerText}`}>A personal sanctuary for your mind. Track, reflect, and grow.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {[['Journal', 'journaling'], ['Tracker', 'tracker'], ['Analytics', 'analytics'], ['AI Check-in', 'ai-checkin']].map(([l, p]) => (
                  <li key={p}><button onClick={() => requireAuth(p)} className={`${footerText} hover:text-indigo-300 transition-colors`}>{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map(l => <li key={l}><a href="#" className={`${footerText} hover:text-indigo-300 transition-colors`}>{l}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service'].map(l => <li key={l}><a href="#" className={`${footerText} hover:text-indigo-300 transition-colors`}>{l}</a></li>)}
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-gray-600">
            <p>© 2026 Lucidly. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-indigo-300 transition-colors">Twitter</a>
              <a href="#" className="hover:text-indigo-300 transition-colors">Instagram</a>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  // ── Journaling Page ──────────────────────────────────────────────────────
  const JournalingPage = () => {
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const [msgType, setMsgType] = useState('success');
    const [loadingData, setLoadingData] = useState(true);
    const MAX = 5000;

    useEffect(() => {
      authFetch('/api/journal')
        .then(r => r.json())
        .then(d => { if (d.entry) setContent(d.entry.content); })
        .catch(() => {})
        .finally(() => setLoadingData(false));
    }, []);

    const handleSave = async () => {
      try {
        const res = await authFetch('/api/journal', { method: 'POST', body: JSON.stringify({ content }) });
        if (!res.ok) throw new Error();
        setMsgType('success'); setMessage('Entry saved!');
      } catch {
        setMsgType('error'); setMessage('Failed to save. Please try again.');
      }
      setTimeout(() => setMessage(''), 3000);
    };

    return (
      <PageShell>
        <BackButton />
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className={`text-2xl font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>Journal</h2>
        </div>
        <p className={`mb-6 text-sm ${dm ? 'text-indigo-300/60' : 'text-gray-500'}`}>Write your thoughts and feelings. This is a safe space just for you.</p>
        {loadingData ? (
          <div className="flex justify-center py-12"><div className="w-7 h-7 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" /></div>
        ) : (
          <>
            <textarea
              className={`w-full h-64 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-sm ${dm ? 'bg-[#090514] text-slate-200 border-indigo-900/50 placeholder-indigo-300/30' : 'bg-gray-50 text-gray-800 border-gray-300 placeholder-gray-400'}`}
              placeholder="What's on your mind today?"
              value={content}
              maxLength={MAX}
              onChange={e => setContent(e.target.value)}
            />
            <div className={`text-right text-xs mt-1 mb-3 ${content.length >= MAX ? 'text-red-400' : dm ? 'text-indigo-400/40' : 'text-gray-400'}`}>
              {content.length} / {MAX}
            </div>
            <button onClick={handleSave} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-400 hover:to-purple-400 transition-all">
              Save Entry
            </button>
            {message && (
              <div className={`mt-4 p-3 rounded-xl text-center text-sm border ${msgType === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {message}
              </div>
            )}
          </>
        )}
      </PageShell>
    );
  };

  // ── Daily Tracker Page ───────────────────────────────────────────────────
  const DailyTrackerPage = () => {
    const [selectedMood, setSelectedMood] = useState('');
    const [toast, setToast] = useState('');
    const [toastType, setToastType] = useState('success');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      authFetch('/api/moods')
        .then(r => r.json())
        .then(d => {
          const today = d.logs?.find(l => l.date?.slice(0,10) === todayKey());
          if (today) setSelectedMood(today.mood);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
      if (!selectedMood) { setToastType('warn'); setToast('Please select a mood first.'); setTimeout(() => setToast(''), 3000); return; }
      try {
        const res = await authFetch('/api/moods', {
          method: 'POST',
          body: JSON.stringify({ date: todayKey(), mood: selectedMood, value: MOOD_VALUE[selectedMood] }),
        });
        if (!res.ok) throw new Error();
        setToastType('success'); setToast(`Mood "${selectedMood}" saved!`);
      } catch {
        setToastType('error'); setToast('Failed to save. Please try again.');
      }
      setTimeout(() => setToast(''), 3000);
    };

    return (
      <PageShell>
        <BackButton />
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <SmilePlus className="w-5 h-5 text-green-400" />
          </div>
          <h2 className={`text-2xl font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>Daily Tracker</h2>
        </div>
        <p className={`mb-6 text-sm ${dm ? 'text-indigo-300/60' : 'text-gray-500'}`}>How are you feeling today?</p>
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-7 h-7 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" /></div>
        ) : (
          <>
            <div className="flex gap-3 justify-center mb-6">
              {MOOD_OPTIONS.map(mood => (
                <button key={mood} onClick={() => setSelectedMood(mood)}
                  className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all flex-1 ${selectedMood === mood ? 'border-indigo-500 bg-indigo-500/10' : dm ? 'border-indigo-900/50 hover:border-indigo-700' : 'border-gray-200 hover:border-gray-400'}`}>
                  <span className="text-3xl mb-1">{MOOD_EMOJI[mood]}</span>
                  <span className="text-xs font-medium">{mood}</span>
                </button>
              ))}
            </div>
            <button onClick={handleSave} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-400 hover:to-purple-400 transition-all">
              Save Mood
            </button>
            {toast && (
              <div className={`mt-4 p-3 rounded-xl text-center text-sm border ${toastType === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : toastType === 'warn' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {toast}
              </div>
            )}
          </>
        )}
      </PageShell>
    );
  };

  // ── Analytics Page ───────────────────────────────────────────────────────
  const AnalyticsPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      authFetch('/api/moods')
        .then(r => r.json())
        .then(d => setLogs(d.logs || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, []);

    const logMap = {};
    logs.forEach(l => { logMap[l.date?.slice(0,10)] = l; });

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      chartData.push({ label, date: key, value: logMap[key]?.value ?? null, mood: logMap[key]?.mood ?? null });
    }

    const total = logs.length;
    const average = total ? (logs.reduce((s, l) => s + l.value, 0) / total).toFixed(1) : null;
    const avgLabel = average ? (Number(average) >= 2.5 ? 'Happy' : Number(average) >= 1.5 ? 'Neutral' : 'Sad') : '—';

    // streak
    let streak = 0;
    const logDates = new Set(logs.map(l => l.date?.slice(0,10)));
    const dCheck = new Date();
    while (logDates.has(dCheck.toISOString().slice(0,10))) { streak++; dCheck.setDate(dCheck.getDate() - 1); }

    const CustomDot = ({ cx, cy, payload }) => {
      if (!payload.value) return null;
      return <circle cx={cx} cy={cy} r={5} fill="#818cf8" stroke={dm ? '#090514' : '#ffffff'} strokeWidth={2} />;
    };

    return (
      <PageShell>
        <BackButton />
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className={`text-2xl font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>Analytics</h2>
        </div>
        <p className={`mb-6 text-sm ${dm ? 'text-indigo-300/60' : 'text-gray-500'}`}>Your mood trends over the last 7 days.</p>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-7 h-7 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" /></div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Total Logs', value: total },
                { label: 'Avg Mood', value: average ? `${average} (${avgLabel})` : '—' },
                { label: 'Streak', value: streak > 0 ? `${streak} 🔥` : '0' },
              ].map(s => (
                <div key={s.label} className={`rounded-xl p-3 text-center border ${dm ? 'bg-[#090514] border-indigo-900/40' : 'bg-gray-50 border-gray-200'}`}>
                  <p className={`text-xs ${dm ? 'text-indigo-400/50' : 'text-gray-500'}`}>{s.label}</p>
                  <p className="font-bold mt-1 text-sm">{s.value}</p>
                </div>
              ))}
            </div>
            <div className={`rounded-xl p-4 border ${dm ? 'bg-[#090514] border-indigo-900/40' : 'bg-gray-50 border-gray-200'}`}>
              {total < 3 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <BarChart2 className="w-10 h-10 text-indigo-500/30 mb-3" />
                  <p className={`font-medium ${dm ? 'text-slate-300' : 'text-gray-600'}`}>Not enough data yet</p>
                  <p className={`text-sm mt-1 mb-4 ${dm ? 'text-indigo-400/50' : 'text-gray-500'}`}>Log your mood for at least 3 days to see your trend.</p>
                  <button onClick={() => navigateTo('tracker')} className="py-2 px-5 text-sm font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 transition-all">
                    Log Today's Mood
                  </button>
                </div>
              ) : (
                <>
                  <p className={`text-xs mb-3 font-medium uppercase tracking-wider ${dm ? 'text-indigo-400/50' : 'text-gray-400'}`}>Mood — Last 7 Days</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={dm ? '#1e1b4b' : '#e5e7eb'} />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: dm ? '#6366f1' : '#6b7280' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[1, 3]} ticks={[1, 2, 3]} tickFormatter={v => ({ 1: '😔', 2: '😐', 3: '😊' }[v] || '')} tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={v => [({ 1: 'Sad 😔', 2: 'Neutral 😐', 3: 'Happy 😊' }[v] || '—'), 'Mood']}
                        contentStyle={{ background: dm ? '#0d081f' : '#ffffff', border: `1px solid ${dm ? 'rgba(99,102,241,0.3)' : '#e5e7eb'}`, borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: '#818cf8' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={2} connectNulls={false} dot={<CustomDot />} activeDot={{ r: 6, fill: '#a5b4fc' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          </>
        )}
      </PageShell>
    );
  };

  // ── AI Check-In Page ─────────────────────────────────────────────────────
  const AICheckInPage = () => {
    const [feeling, setFeeling] = useState('');
    const [energy, setEnergy] = useState('');
    const [stressors, setStressors] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleCheck = async () => {
      if (!feeling.trim() && !energy.trim() && !stressors.trim()) { setError(true); return; }
      setError(false); setLoading(true); setResult(null);
      const computed = computeCheckin(feeling, energy, stressors);
      // Save to database
      try {
        await authFetch('/api/checkins', {
          method: 'POST',
          body: JSON.stringify({ feeling, energy, stressors, score: computed.score, keywords: computed.keywords, explanation: computed.explanation }),
        });
      } catch {}
      setTimeout(() => { setResult(computed); setLoading(false); }, 700);
    };

    const scoreColor = result ? (Number(result.score) < 30 ? 'text-green-400' : Number(result.score) < 60 ? 'text-yellow-400' : 'text-red-400') : '';
    const inputClass = `w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm ${dm ? 'bg-[#090514] text-slate-200 border-indigo-900/50 placeholder-indigo-300/30' : 'bg-gray-50 text-gray-800 border-gray-300 placeholder-gray-400'}`;

    return (
      <PageShell>
        <BackButton />
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-pink-400" />
          </div>
          <h2 className={`text-2xl font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>AI Check-In</h2>
        </div>
        <div className={`mb-5 p-3 rounded-xl border text-xs ${dm ? 'bg-indigo-900/20 border-indigo-900/40 text-indigo-300/70' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
          <strong>Disclaimer:</strong> Lucidly is a self-reflection tool and is not a substitute for professional mental health care. If you are in crisis, call or text <strong>988</strong> (US).
        </div>
        {!result && (
          <div className={`p-5 rounded-2xl mb-5 ${dm ? 'bg-[#090514] border border-indigo-900/40' : 'bg-gray-50'}`}>
            <h3 className={`font-semibold text-lg mb-4 ${dm ? 'text-white' : 'text-gray-800'}`}>Quick Check-In</h3>
            {[
              { label: 'How have you been feeling?', val: feeling, set: setFeeling, ph: 'e.g., stressed, happy, overwhelmed…' },
              { label: 'Sleep / Energy levels', val: energy, set: setEnergy, ph: 'e.g., tired, well-rested, low energy…' },
              { label: 'Any stressors right now?', val: stressors, set: setStressors, ph: 'e.g., exams, work deadline, or "none"' },
            ].map(f => (
              <div key={f.label} className="mb-4">
                <p className={`mb-2 text-sm font-medium ${dm ? 'text-indigo-300/70' : 'text-gray-600'}`}>{f.label}</p>
                <input type="text" value={f.val} onChange={e => f.set(e.target.value)} className={inputClass} placeholder={f.ph} onKeyDown={e => e.key === 'Enter' && handleCheck()} />
              </div>
            ))}
            {error && <p className="text-red-400 text-xs mb-3">Please fill in at least one field.</p>}
            <button onClick={handleCheck} disabled={loading}
              className={`w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-400 hover:to-purple-400 transition-all ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {loading ? 'Analysing…' : 'Check In'}
            </button>
          </div>
        )}
        {loading && <div className="flex justify-center py-8"><div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" /></div>}
        {result && (
          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border ${dm ? 'bg-[#090514] border-indigo-900/40' : 'bg-gray-50 border-gray-200'}`}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className={`p-4 rounded-xl border ${dm ? 'bg-[#0d081f] border-indigo-900/40' : 'bg-white border-gray-200'}`}>
                  <p className={`text-xs uppercase tracking-wider mb-1 ${dm ? 'text-indigo-400/50' : 'text-gray-500'}`}>Stress Score</p>
                  <p className={`text-4xl font-extrabold ${scoreColor}`}>{result.score}</p>
                  <p className={`text-xs mt-0.5 ${dm ? 'text-indigo-400/40' : 'text-gray-400'}`}>out of 100</p>
                </div>
                <div className={`p-4 rounded-xl border ${dm ? 'bg-[#0d081f] border-indigo-900/40' : 'bg-white border-gray-200'}`}>
                  <p className={`text-xs uppercase tracking-wider mb-1 ${dm ? 'text-indigo-400/50' : 'text-gray-500'}`}>Keywords</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.keywords.length > 0
                      ? result.keywords.map(k => <span key={k} className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-500/20">{k}</span>)
                      : <span className={`text-xs ${dm ? 'text-indigo-400/40' : 'text-gray-400'}`}>None detected</span>}
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-xl border mb-3 ${dm ? 'bg-[#0d081f] border-indigo-900/40' : 'bg-white border-gray-200'}`}>
                <p className={`text-xs uppercase tracking-wider mb-2 ${dm ? 'text-indigo-400/50' : 'text-gray-500'}`}>Insight</p>
                <p className="text-sm leading-relaxed">{result.explanation}</p>
              </div>
              <div className={`p-4 rounded-xl border ${dm ? 'bg-[#0d081f] border-indigo-900/40' : 'bg-white border-gray-200'}`}>
                <p className={`text-xs uppercase tracking-wider mb-3 ${dm ? 'text-indigo-400/50' : 'text-gray-500'}`}>Recommendations</p>
                <ul className="space-y-2">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm"><span className="text-green-400 mt-0.5 shrink-0">✓</span><span>{r}</span></li>
                  ))}
                </ul>
              </div>
            </div>
            <button onClick={() => { setResult(null); setFeeling(''); setEnergy(''); setStressors(''); }}
              className={`w-full py-3 rounded-xl border font-medium text-sm transition-colors ${dm ? 'border-indigo-900/50 text-indigo-300 hover:bg-indigo-900/20' : 'border-gray-300 hover:bg-gray-100'}`}>
              Start a New Check-In
            </button>
          </div>
        )}
      </PageShell>
    );
  };

  // ── Router ──────────────────────────────────────────────────────────────
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'journaling': return <JournalingPage />;
      case 'tracker': return <DailyTrackerPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'ai-checkin': return <AICheckInPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {renderPage()}
      {authModal && (
        <AuthModal
          mode={authModal}
          isDark={isDarkMode}
          onClose={() => setAuthModal(null)}
          onSuccess={() => setAuthModal(null)}
        />
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
