import React, { useState, useEffect } from 'react';
import { BookOpen, SmilePlus, BarChart2, Brain, ChevronRight, Menu, X, ArrowRight, Star } from 'lucide-react';

export default function PolishedClarity() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      title: "Journaling",
      description: "Express your thoughts, feelings, and experiences freely and privately.",
      bg: "bg-blue-50/50"
    },
    {
      icon: <SmilePlus className="w-6 h-6 text-emerald-500" />,
      title: "Daily Tracker",
      description: "Quickly log your mood and daily activities to spot patterns over time.",
      bg: "bg-emerald-50/50"
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-indigo-500" />,
      title: "Analytics",
      description: "See a visual summary of your wellness journey with insightful charts.",
      bg: "bg-indigo-50/50"
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      title: "AI Check-In",
      description: "A compassionate AI assistant to help you de-stress and reflect.",
      bg: "bg-purple-50/50"
    }
  ];

  const steps = [
    { num: "01", title: "Log Daily Moods", desc: "Start by simply logging how you feel each day." },
    { num: "02", title: "Journal Your Thoughts", desc: "Write about your experiences to gain clarity." },
    { num: "03", title: "See Your Progress", desc: "Visualize your journey with insightful analytics." },
    { num: "04", title: "Check-in with AI", desc: "A compassionate AI assistant will guide you to de-stress." }
  ];

  const testimonials = [
    {
      quote: "Lucidly has completely changed the way I approach my mental health. The journaling feature is incredibly helpful.",
      author: "Alex K.",
      role: "College Student"
    },
    {
      quote: "I love the daily tracker. It's so simple to use and helps me see my mood patterns over time. Highly recommended!",
      author: "Jane D.",
      role: "UX Designer"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-y-auto selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg leading-none tracking-tighter">L</span>
            </div>
            <span className="font-semibold text-xl tracking-tight text-slate-900">Lucidly</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it Works', 'Testimonials'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
              Log in
            </button>
            <button className="text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors px-5 py-2.5 rounded-full shadow-sm">
              Get Started
            </button>
          </div>

          <button 
            className="md:hidden text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-medium text-slate-800">
            {['Features', 'How it Works', 'Testimonials'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="border-b border-slate-100 pb-4"
              >
                {item}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-4">
              <button className="w-full py-3 rounded-full border border-slate-200 text-slate-700 font-medium">Log in</button>
              <button className="w-full py-3 rounded-full bg-slate-900 text-white font-medium">Get Started</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Abstract Background Blur */}
        <div className="absolute top-0 inset-x-0 h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-400/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-slate-200/50 backdrop-blur-sm mb-6 text-sm font-medium text-indigo-700 shadow-sm animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Introducing Polished Clarity
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                A quiet space <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">for your mind.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                Understand yourself better. Lucidly helps you journal daily thoughts, track your mood, and find clarity with guided AI check-ins.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <button className="group flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-medium shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5 transition-all">
                  Start your journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-medium hover:bg-slate-50 transition-colors shadow-sm">
                  View Demo
                </button>
              </div>
              
              <div className="mt-10 flex items-center gap-4 text-sm text-slate-500 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-50 bg-slate-200 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>Joined by 10,000+ mindful people</div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="relative aspect-[4/3] w-full max-w-2xl mx-auto lg:mr-0 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-white/20">
                <div className="absolute inset-0 bg-slate-100 animate-pulse"></div>
                <img 
                  src="/__mockup/images/lucidly-hero-a.png" 
                  alt="Abstract serene shapes representing clarity" 
                  className="w-full h-full object-cover relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Floating UI Elements over image */}
                <div className="absolute top-6 -left-6 md:-left-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 z-20 flex items-center gap-4 animate-float">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <SmilePlus className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Mood logged</div>
                    <div className="text-xs text-slate-500">Feeling calm today</div>
                  </div>
                </div>
                
                <div className="absolute bottom-12 -right-6 md:-right-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 z-20 flex items-center gap-4 animate-float-delayed">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Insight generated</div>
                    <div className="text-xs text-slate-500">Based on recent journal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">Everything you need to find focus</h2>
            <p className="text-lg text-slate-600">Simple, powerful tools designed to help you build a sustainable mental wellness practice.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">Your daily path to clarity</h2>
              <p className="text-lg text-slate-600 mb-12">Building a habit takes time. We've designed a workflow that takes just a few minutes a day, yielding compound insights over time.</p>
              
              <div className="space-y-8">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-sm font-bold text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-colors">
                        {step.num}
                      </div>
                      {idx !== steps.length - 1 && (
                        <div className="w-px h-full bg-slate-200 my-2 group-hover:bg-slate-300 transition-colors"></div>
                      )}
                    </div>
                    <div className="pb-8">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                  <div className="w-24 h-24 bg-white rounded-full shadow-lg shadow-indigo-100 flex items-center justify-center mb-6 relative z-10">
                    <BarChart2 className="w-10 h-10 text-indigo-500" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 relative z-10">Weekly Insights</h4>
                  <p className="text-sm text-slate-500 relative z-10">Your mood has been steadily improving. You feel best on days when you journal.</p>
                  
                  {/* Decorative chart lines */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 opacity-20">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M0,100 C20,80 40,90 60,50 C80,10 100,30 100,30" strokeDasharray="5,5" />
                      <path d="M0,100 C20,90 40,70 60,60 C80,50 100,20 100,20" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Loved by mindful people</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-6 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-lg text-slate-700 leading-relaxed mb-8">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.author}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 z-0"></div>
        
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[120px] z-0"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px] z-0"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Start understanding yourself today.</h2>
          <p className="text-xl text-indigo-100/80 mb-10 max-w-2xl mx-auto">Join thousands of others building a healthier relationship with their mind through journaling and reflection.</p>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl shadow-indigo-900/20">
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="font-semibold text-slate-900">Lucidly</span>
          </div>
          
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>
          
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} Lucidly. All rights reserved.
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out 3s infinite;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        html {
          scroll-behavior: smooth;
        }
      `}} />
    </div>
  );
}
