import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import myLogo from '../assets/lucidly-logo.png';

// ─── Helpers ────────────────────────────────────────────────────────────────

const MOOD_OPTIONS = ['Happy', 'Neutral', 'Sad'];
const MOOD_VALUE = { Happy: 3, Neutral: 2, Sad: 1 };
const MOOD_EMOJI = { Happy: '😊', Neutral: '😐', Sad: '😔' };

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getMoodLogs() {
  try {
    return JSON.parse(localStorage.getItem('lucidly_mood_logs') || '[]');
  } catch {
    return [];
  }
}

function saveMoodLog(mood) {
  const logs = getMoodLogs().filter(l => l.date !== todayKey());
  logs.push({ date: todayKey(), mood, value: MOOD_VALUE[mood] });
  localStorage.setItem('lucidly_mood_logs', JSON.stringify(logs));
}

function getLast7DaysData() {
  const logs = getMoodLogs();
  const logMap = {};
  logs.forEach(l => { logMap[l.date] = l; });

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    days.push({ label, date: key, value: logMap[key]?.value ?? null, mood: logMap[key]?.mood ?? null });
  }
  return days;
}

function getAverageMood() {
  const logs = getMoodLogs();
  if (!logs.length) return null;
  const avg = logs.reduce((s, l) => s + l.value, 0) / logs.length;
  return avg.toFixed(1);
}

function getStreak() {
  const logs = getMoodLogs();
  const logDates = new Set(logs.map(l => l.date));
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (logDates.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// ─── Stress scoring ──────────────────────────────────────────────────────────

const NEGATIVE_WORDS = new Set([
  'terrible','awful','horrible','bad','sad','depressed','anxious','stressed',
  'overwhelmed','miserable','angry','frustrated','upset','down','exhausted',
  'drained','burnt','burned','panic','hopeless','worthless','worried','fearful',
  'nervous','tense','irritable','lonely','lost','empty','numb',
]);
const POSITIVE_WORDS = new Set([
  'great','good','happy','excellent','amazing','wonderful','fantastic','awesome',
  'energised','energized','motivated','calm','peaceful','relaxed','fine',
  'okay','alright','positive','hopeful','grateful','content','cheerful','rested',
]);
const NEUTRAL_STRESSOR_WORDS = new Set(['no','none','nothing','nope','nah','not']);

function scoreText(text, negSet, posSet, max) {
  const words = text.toLowerCase().split(/\s+/);
  let neg = 0, pos = 0;
  words.forEach(w => {
    if (negSet.has(w)) neg++;
    if (posSet.has(w)) pos++;
  });
  if (neg === 0 && pos === 0) return max / 2;
  const ratio = neg / (neg + pos);
  return Math.round(ratio * max);
}

function extractKeywords(text) {
  const stopWords = new Set(['i','am','a','an','the','is','was','and','or','but','have','had','been','my','me','so','just','very','been','its','with','that','this','are','for','on','in','at','to','of','it','do','did','not','no','yes','some','any','from','as','by','be']);
  return text.toLowerCase().split(/\s+/)
    .map(w => w.replace(/[^a-z]/g, ''))
    .filter(w => w.length > 2 && !stopWords.has(w))
    .slice(0, 6);
}

function computeCheckin(feeling, energy, stressors) {
  const feelingScore = scoreText(feeling, NEGATIVE_WORDS, POSITIVE_WORDS, 40);
  const energyScore = scoreText(energy, NEGATIVE_WORDS, POSITIVE_WORDS, 30);

  const stressorWords = stressors.toLowerCase().split(/\s+/);
  const isNoStressor = stressorWords.some(w => NEUTRAL_STRESSOR_WORDS.has(w));
  const stressorScore = isNoStressor ? 5 : (stressors.trim().length > 2 ? 25 : 15);

  const raw = feelingScore + energyScore + stressorScore;
  const score = Math.min(100, Math.max(0, raw));

  const keywords = [
    ...extractKeywords(feeling),
    ...extractKeywords(energy),
    ...extractKeywords(stressors),
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 6);

  let explanation, recommendations;
  if (score < 30) {
    explanation = 'You appear to be in a positive and balanced state. Your responses suggest good emotional regulation and energy levels.';
    recommendations = [
      'Keep up your current self-care routine — it\'s working.',
      'Consider journaling what\'s going well to reinforce positive habits.',
      'Share your energy with someone who might need it today.',
    ];
  } else if (score < 55) {
    explanation = 'You\'re experiencing moderate stress. This is normal and manageable with the right strategies.';
    recommendations = [
      'Take a 5-minute break every hour and step away from screens.',
      'Try a short breathing exercise: inhale 4 counts, hold 4, exhale 6.',
      'Write down your top three priorities for today to reduce mental load.',
    ];
  } else if (score < 75) {
    explanation = 'Elevated stress detected. Your energy and emotional state suggest you\'re carrying a significant load right now.';
    recommendations = [
      'Prioritise sleep tonight — aim for at least 7–8 hours.',
      'Do a 10-minute walk outside; physical movement reduces cortisol.',
      'Reach out to a friend or trusted person and share how you\'re feeling.',
      'Consider a short mindfulness or body-scan meditation.',
    ];
  } else {
    explanation = 'High stress levels detected. It\'s important to take action and be kind to yourself right now.';
    recommendations = [
      'Please consider speaking with a counsellor or mental health professional.',
      'Remove or delegate at least one responsibility from your plate today.',
      'Grounding exercise: name 5 things you can see, 4 you can touch, 3 you can hear.',
      'Avoid caffeine and heavy screens in the next 2 hours.',
      'Crisis line (US): 988 Suicide & Crisis Lifeline — call or text 988.',
    ];
  }

  return { score: score.toFixed(1), keywords, explanation, recommendations };
}

// ─── App ─────────────────────────────────────────────────────────────────────

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('lucidly_dark_mode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
    setIsMenuOpen(false);
  };

  const scrollToSection = (id) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(id);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('lucidly_dark_mode', String(next));
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('bg-gray-900', 'text-gray-100');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('bg-gray-900', 'text-gray-100');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const dm = isDarkMode;

  const BackButton = () => (
    <button
      onClick={() => navigateTo('home')}
      className={`mb-4 transition-colors duration-200 flex items-center ${dm ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back
    </button>
  );

  // ── Home Page ──────────────────────────────────────────────────────────────
  const HomePage = () => (
    <div className={`flex flex-col min-h-screen text-gray-800 ${dm ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <nav className={`sticky top-0 z-50 flex items-center p-6 md:px-12 card-shadow rounded-xl m-4 ${dm ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex-1">
          <span className="font-bold text-xl">Lucidly</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          {['home', 'features', 'about'].map(id => (
            <a key={id} onClick={() => scrollToSection(id)}
              className={`cursor-pointer transition-colors duration-200 relative group capitalize ${activeSection === id ? 'font-bold' : ''} ${dm ? 'hover:text-white' : 'hover:text-gray-900'}`}>
              {id}
              <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 transform -translate-x-1/2 group-hover:w-full ${dm ? 'bg-white' : 'bg-gray-900'} ${activeSection === id ? 'w-full' : ''}`}></span>
            </a>
          ))}
        </div>
        <div className="flex-1 flex items-center justify-end space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors duration-200 ${dm ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
              <span role="img" aria-label="dark mode toggle">{dm ? '☀️' : '🌙'}</span>
            </button>
            <a href="#" className={`py-2 px-4 font-semibold rounded-full transition-colors duration-200 ${dm ? 'bg-gray-200 text-gray-800 hover:bg-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>Login</a>
            <a href="#" className={`py-2 px-4 border font-semibold rounded-full transition-colors duration-200 ${dm ? 'border-gray-100 text-gray-100 hover:bg-gray-100 hover:text-gray-800' : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'}`}>Sign Up</a>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className={`fixed inset-0 z-40 flex flex-col items-center justify-center space-y-6 ${dm ? 'bg-gray-800' : 'bg-white'}`}>
          {['home','journaling','tracker','analytics','ai-checkin','about'].map(p => (
            <a key={p} onClick={() => navigateTo(p)} className="text-2xl font-bold cursor-pointer capitalize">
              {p === 'ai-checkin' ? 'AI Check-In' : p}
            </a>
          ))}
          <a href="#" className={`py-2 px-4 font-semibold rounded-full ${dm ? 'bg-gray-200 text-gray-800' : 'bg-gray-800 text-white'}`}>Login</a>
          <a href="#" className={`py-2 px-4 border font-semibold rounded-full ${dm ? 'border-gray-100 text-gray-100' : 'border-gray-800 text-gray-800'}`}>Sign Up</a>
        </div>
      )}

      <header id="home" className={`hero-bg flex items-center justify-center p-8 md:p-12 relative overflow-hidden ${dm ? 'text-gray-100' : 'text-gray-800'}`}>
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 text-center lg:text-left p-4">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Your Journey <br/> to Mental Wellness</h1>
            <p className="mt-4 max-w-md mx-auto lg:mx-0">Lucidly helps you track your mood, journal your thoughts, and find clarity in your day-to-day life.</p>
            <div className="mt-8 flex justify-center lg:justify-start space-x-4">
              <a onClick={() => navigateTo('journaling')} className={`py-3 px-6 font-semibold rounded-full transition-colors cursor-pointer ${dm ? 'bg-gray-200 text-gray-900 hover:bg-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>Get Started</a>
              <a onClick={() => scrollToSection('about')} className={`py-3 px-6 bg-transparent border font-semibold rounded-full transition-colors cursor-pointer ${dm ? 'border-gray-200 hover:bg-gray-800' : 'border-gray-900 hover:bg-gray-100'}`}>Learn More</a>
            </div>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
            <div className="w-80 h-80 md:w-96 md:h-96 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl">
              <img src={myLogo} alt="Lucidly logo" className="w-full h-full object-cover"
                onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/E2E8F0/A0AEC0?text=Lucidly'; }}
              />
            </div>
          </div>
        </div>
      </header>

      <section id="features" className={`p-8 md:p-12 ${dm ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Lucidly Features</h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { page: 'journaling', emoji: '📝', color: 'blue', title: 'Journaling', desc: 'Express your thoughts, feelings, and experiences freely and privately.' },
              { page: 'tracker', emoji: '🙂', color: 'green', title: 'Daily Tracker', desc: 'Quickly log your mood and daily activities to spot patterns over time.' },
              { page: 'analytics', emoji: '📊', color: 'yellow', title: 'Analytics', desc: 'See a visual summary of your wellness journey with insightful charts.' },
              { page: 'ai-checkin', emoji: '🧠', color: 'purple', title: 'AI Check-In', desc: 'A compassionate AI assistant to help you de-stress and reflect.' },
            ].map(f => (
              <div key={f.page} onClick={() => navigateTo(f.page)}
                className={`rounded-2xl p-6 card-shadow text-center cursor-pointer hover:shadow-xl transition-shadow ${dm ? 'bg-gray-700' : 'bg-white'}`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${f.color}-100 flex items-center justify-center`}>
                  <span className={`text-${f.color}-500 font-bold text-2xl`}>{f.emoji}</span>
                </div>
                <h3 className="font-bold text-xl">{f.title}</h3>
                <p className="mt-2 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`p-8 md:p-12 ${dm ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Your Wellness Journey</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '1.', title: 'Log Daily Moods', desc: 'Start by simply logging how you feel each day.', gradient: 'from-pink-100 to-purple-100' },
              { num: '2.', title: 'Journal Your Thoughts', desc: 'Write about your experiences to gain clarity.', gradient: 'from-blue-100 to-green-100' },
              { num: '3.', title: 'See Your Progress', desc: 'Visualize your journey with insightful analytics.', gradient: 'from-yellow-100 to-orange-100' },
              { num: '4.', title: 'Check-in with AI', desc: 'A compassionate AI assistant will guide you to de-stress.', gradient: 'from-red-100 to-yellow-100' },
            ].map(step => (
              <div key={step.num} className={`rounded-2xl p-6 relative overflow-hidden ${dm ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} ${dm ? 'opacity-10' : 'opacity-50'}`}></div>
                <div className="relative">
                  <h3 className="font-bold text-2xl">{step.num} {step.title}</h3>
                  <p className="mt-2 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`p-8 md:p-12 ${dm ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 relative flex justify-center lg:justify-start p-4">
            <div className={`relative w-48 h-96 lg:w-64 lg:h-[32rem] rounded-3xl shadow-xl transform -rotate-6 flex items-center justify-center p-4 text-center ${dm ? 'bg-gray-700' : 'bg-white'}`}>
              <span className="font-semibold text-lg text-gray-400">Journaling Mockup</span>
            </div>
            <div className={`relative w-48 h-96 lg:w-64 lg:h-[32rem] rounded-3xl shadow-xl transform rotate-6 ml-12 flex items-center justify-center p-4 text-center ${dm ? 'bg-gray-700' : 'bg-white'}`}>
              <span className="font-semibold text-lg text-gray-400">Analytics Mockup</span>
            </div>
          </div>
          <div className="lg:w-1/2 text-center lg:text-left p-4">
            <h2 className="text-3xl md:text-4xl font-bold">Your Personal Dashboard</h2>
            <p className="mt-4 max-w-md mx-auto lg:mx-0">Lucidly provides a simple, intuitive dashboard to view your progress and gain valuable insights.</p>
            <div className="mt-8">
              <a onClick={() => navigateTo('analytics')} className={`py-3 px-6 font-semibold rounded-full transition-colors cursor-pointer ${dm ? 'bg-gray-200 text-gray-900 hover:bg-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                View Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={`p-8 md:p-12 ${dm ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">What People Say</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { quote: 'Lucidly has completely changed the way I approach my mental health. The journaling feature is incredibly helpful.', name: 'Kuroneko', role: 'College Student' },
              { quote: "I love the daily tracker. It's so simple to use and helps me see my mood patterns over time. Highly recommended!", name: 'Jane Doe', role: 'UX Designer' },
            ].map(t => (
              <div key={t.name} className={`rounded-2xl p-6 card-shadow ${dm ? 'bg-gray-800' : 'bg-white'}`}>
                <p className="italic">"{t.quote}"</p>
                <p className="mt-4 font-bold">{t.name}</p>
                <p className={`text-sm ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className={`p-8 md:p-12 ${dm ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold">About Lucidly</h2>
          <p className="mt-4 max-w-xl">Lucidly is an app designed to help you track your mental wellness journey. Built to help with journaling and stress management, with plans to integrate a backend for cloud sync and an AI model for advanced insights.</p>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-300 p-8 md:p-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-lg">Lucidly</span>
            <p className="text-sm mt-2">&copy; 2026 Lucidly. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );

  // ── Journaling Page ────────────────────────────────────────────────────────
  const JournalingPage = () => {
    const [journalEntry, setJournalEntry] = useState('');
    const [message, setMessage] = useState('');
    const MAX_CHARS = 5000;

    useEffect(() => {
      const saved = localStorage.getItem('lucidly_journal_entry');
      if (saved) setJournalEntry(saved);
    }, []);

    const handleSave = () => {
      localStorage.setItem('lucidly_journal_entry', journalEntry);
      setMessage('Journal entry saved!');
      setTimeout(() => setMessage(''), 3000);
    };

    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 ${dm ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <div className={`w-full max-w-xl rounded-xl shadow-lg p-6 border ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <BackButton />
          <h2 className="text-3xl font-bold">Journaling</h2>
          <p className={`mt-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>Write your thoughts and feelings. This is a safe space just for you.</p>

          <textarea
            className={`mt-6 w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-shadow duration-200 resize-none ${dm ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white border-gray-300'}`}
            placeholder="What's on your mind today?"
            value={journalEntry}
            maxLength={MAX_CHARS}
            onChange={e => setJournalEntry(e.target.value)}
          />
          <div className={`text-right text-xs mt-1 ${journalEntry.length >= MAX_CHARS ? 'text-red-500' : dm ? 'text-gray-400' : 'text-gray-500'}`}>
            {journalEntry.length} / {MAX_CHARS}
          </div>

          <button onClick={handleSave}
            className={`mt-3 w-full py-3 text-white font-semibold rounded-lg transition-colors duration-200 ${dm ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'}`}>
            Save Journal Entry
          </button>
          {message && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
              {message}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Daily Tracker Page ─────────────────────────────────────────────────────
  const DailyTrackerPage = () => {
    const [selectedMood, setSelectedMood] = useState('');
    const [toast, setToast] = useState('');

    useEffect(() => {
      const logs = getMoodLogs();
      const todayLog = logs.find(l => l.date === todayKey());
      if (todayLog) setSelectedMood(todayLog.mood);
    }, []);

    const handleSave = () => {
      if (!selectedMood) {
        setToast('Please select a mood first.');
        setTimeout(() => setToast(''), 3000);
        return;
      }
      saveMoodLog(selectedMood);
      setToast(`Mood "${selectedMood}" saved for today!`);
      setTimeout(() => setToast(''), 3000);
    };

    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 ${dm ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <div className={`w-full max-w-xl rounded-xl shadow-lg p-6 border ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <BackButton />
          <h2 className="text-3xl font-bold">Daily Tracker</h2>
          <p className={`mt-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>How are you feeling today? You can update this any time before midnight.</p>

          <div className="mt-6 flex justify-center gap-4">
            {MOOD_OPTIONS.map(mood => (
              <button key={mood} onClick={() => setSelectedMood(mood)}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 flex-1
                  ${selectedMood === mood
                    ? (dm ? 'border-blue-400 bg-blue-900' : 'border-blue-500 bg-blue-50')
                    : (dm ? 'border-gray-600 hover:border-gray-400' : 'border-gray-200 hover:border-gray-400')
                  }`}>
                <span className="text-3xl">{MOOD_EMOJI[mood]}</span>
                <span className="mt-2 text-sm font-medium">{mood}</span>
              </button>
            ))}
          </div>

          <button onClick={handleSave}
            className={`mt-6 w-full py-3 text-white font-semibold rounded-lg transition-colors duration-200 ${dm ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'}`}>
            Save Mood
          </button>

          {toast && (
            <div className={`mt-4 p-3 rounded-lg text-center ${toast.startsWith('Please') ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
              {toast}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Analytics Page ─────────────────────────────────────────────────────────
  const AnalyticsPage = () => {
    const chartData = getLast7DaysData();
    const totalEntries = getMoodLogs().length;
    const average = getAverageMood();
    const streak = getStreak();
    const avgLabel = average ? (Number(average) >= 2.5 ? 'Happy' : Number(average) >= 1.5 ? 'Neutral' : 'Sad') : '—';
    const hasEnoughData = totalEntries >= 3;

    const CustomDot = (props) => {
      const { cx, cy, payload } = props;
      if (payload.value === null) return null;
      return <circle cx={cx} cy={cy} r={5} fill={dm ? '#60a5fa' : '#1d4ed8'} stroke="white" strokeWidth={2} />;
    };

    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 ${dm ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <div className={`w-full max-w-xl rounded-xl shadow-lg p-6 border ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <BackButton />
          <h2 className="text-3xl font-bold">Analytics</h2>
          <p className={`mt-2 ${dm ? 'text-gray-400' : 'text-gray-600'}`}>Your mood trends over the last 7 days.</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: 'Total Logs', value: totalEntries },
              { label: 'Avg Mood', value: average ? `${average} (${avgLabel})` : '—' },
              { label: 'Day Streak', value: streak > 0 ? `${streak} 🔥` : '0' },
            ].map(stat => (
              <div key={stat.label} className={`rounded-xl p-3 text-center ${dm ? 'bg-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                <p className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                <p className="font-bold mt-1 text-sm">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className={`mt-6 w-full rounded-xl p-4 border ${dm ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            {!hasEnoughData ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <span className="text-4xl">📊</span>
                <p className={`mt-3 font-medium ${dm ? 'text-gray-300' : 'text-gray-600'}`}>Not enough data yet</p>
                <p className={`mt-1 text-sm ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Log your mood for at least 3 days to see your trend chart.</p>
                <button onClick={() => navigateTo('tracker')}
                  className={`mt-4 py-2 px-5 text-sm font-semibold rounded-full transition-colors ${dm ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-800 hover:bg-gray-900 text-white'}`}>
                  Log Today's Mood
                </button>
              </div>
            ) : (
              <>
                <p className={`text-xs mb-3 font-medium ${dm ? 'text-gray-400' : 'text-gray-500'}`}>MOOD — LAST 7 DAYS</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dm ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: dm ? '#9ca3af' : '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[1, 3]} ticks={[1, 2, 3]}
                      tickFormatter={v => ({ 1: '😔', 2: '😐', 3: '😊' }[v] || '')}
                      tick={{ fontSize: 13 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value) => [({ 1: 'Sad 😔', 2: 'Neutral 😐', 3: 'Happy 😊' }[value] || '—'), 'Mood']}
                      contentStyle={{ background: dm ? '#1f2937' : '#fff', border: 'none', borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: dm ? '#d1d5db' : '#374151' }}
                    />
                    <Line type="monotone" dataKey="value" stroke={dm ? '#60a5fa' : '#2563eb'}
                      strokeWidth={2} connectNulls={false} dot={<CustomDot />} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2">
                  {Object.entries(MOOD_EMOJI).map(([mood, emoji]) => (
                    <span key={mood} className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{emoji} {mood}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── AI Check-In Page ───────────────────────────────────────────────────────
  const AICheckInPage = () => {
    const [feeling, setFeeling] = useState('');
    const [energy, setEnergy] = useState('');
    const [stressors, setStressors] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleCheck = () => {
      if (!feeling.trim() && !energy.trim() && !stressors.trim()) {
        setError(true);
        return;
      }
      setError(false);
      setLoading(true);
      setResult(null);
      setTimeout(() => {
        setResult(computeCheckin(feeling, energy, stressors));
        setLoading(false);
      }, 700);
    };

    const handleReset = () => {
      setFeeling('');
      setEnergy('');
      setStressors('');
      setResult(null);
      setError(false);
    };

    const scoreColor = result
      ? Number(result.score) < 30 ? 'text-green-500'
        : Number(result.score) < 60 ? 'text-yellow-500'
        : 'text-red-500'
      : '';

    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 ${dm ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <div className={`w-full max-w-xl rounded-xl shadow-lg p-6 border ${dm ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <BackButton />
          <h2 className="text-3xl font-bold text-center mb-2">AI Check-In</h2>

          <div className={`mb-5 p-3 rounded-lg border text-xs ${dm ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
            <strong>Disclaimer:</strong> Lucidly is a self-reflection tool and is <strong>not a substitute</strong> for professional mental health care. If you are in crisis, please contact a licensed therapist or call/text <strong>988</strong> (US Suicide & Crisis Lifeline).
          </div>

          {!result && (
            <div className={`p-5 rounded-xl mb-5 ${dm ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h3 className="font-semibold text-lg mb-4">Quick Check-In</h3>

              {[
                { label: 'How have you been feeling?', val: feeling, set: setFeeling, placeholder: 'e.g., stressed, happy, overwhelmed…' },
                { label: 'Sleep / Energy levels', val: energy, set: setEnergy, placeholder: 'e.g., tired, well-rested, low energy…' },
                { label: 'Any stressors right now?', val: stressors, set: setStressors, placeholder: 'e.g., exams, work deadline, or "none"' },
              ].map(field => (
                <div key={field.label} className="mb-4">
                  <p className={`mb-2 text-sm font-medium ${dm ? 'text-gray-300' : 'text-gray-700'}`}>{field.label}</p>
                  <input type="text" value={field.val} onChange={e => field.set(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-shadow ${dm ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    placeholder={field.placeholder}
                    onKeyDown={e => e.key === 'Enter' && handleCheck()}
                  />
                </div>
              ))}

              {error && (
                <p className="text-red-500 text-sm mb-3">Please fill in at least one field before checking in.</p>
              )}

              <button onClick={handleCheck}
                className={`w-full py-3 text-white font-semibold rounded-lg transition-colors duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''} ${dm ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'}`}
                disabled={loading}>
                {loading ? 'Analysing…' : 'Check In'}
              </button>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <div className={`w-8 h-8 rounded-full border-4 border-t-transparent animate-spin ${dm ? 'border-blue-400' : 'border-gray-700'}`} />
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${dm ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl card-shadow ${dm ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className={`text-xs font-medium uppercase ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Stress Score</p>
                    <p className={`text-5xl font-extrabold mt-1 ${scoreColor}`}>{result.score}</p>
                    <p className={`text-xs mt-1 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>out of 100</p>
                  </div>
                  <div className={`p-4 rounded-xl card-shadow ${dm ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className={`text-xs font-medium uppercase ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Insight</p>
                    <p className="mt-1 text-sm leading-relaxed">{result.explanation}</p>
                  </div>
                  <div className={`p-4 rounded-xl card-shadow md:col-span-2 ${dm ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className={`text-xs font-medium uppercase ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Keywords Detected</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.keywords.length > 0
                        ? result.keywords.map(k => (
                          <span key={k} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{k}</span>
                        ))
                        : <span className={`text-sm ${dm ? 'text-gray-400' : 'text-gray-500'}`}>No specific keywords detected.</span>
                      }
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl card-shadow md:col-span-2 ${dm ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className={`text-xs font-medium uppercase mb-2 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Recommendations</p>
                    <ul className="space-y-2">
                      {result.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="mt-0.5 text-green-500">✓</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <button onClick={handleReset}
                className={`w-full py-3 font-semibold rounded-lg border transition-colors ${dm ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}>
                Start a New Check-In
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Router ─────────────────────────────────────────────────────────────────
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
    <div className={isDarkMode ? 'dark text-white' : 'text-gray-900'}>
      {renderPage()}
    </div>
  );
};

export default App;
