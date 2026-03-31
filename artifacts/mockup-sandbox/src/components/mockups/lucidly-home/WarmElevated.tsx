import React from 'react';
import { BookOpen, SmilePlus, BarChart2, Brain, ArrowRight, Star, Heart, Shield, Activity, Sparkles } from 'lucide-react';

export default function WarmElevated() {
  return (
    <div className="min-h-screen bg-[#090514] text-slate-200 font-sans overflow-y-auto selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-4 backdrop-blur-md bg-[#090514]/70 border-b border-indigo-900/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Lucidly</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Stories</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-white transition-colors">Sign in</button>
            <button className="text-sm font-medium bg-white text-[#090514] px-4 py-2 rounded-full hover:bg-indigo-50 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        {/* Abstract background glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="lg:w-1/2 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/40 border border-indigo-700/50 text-indigo-300 text-xs font-medium mb-6">
              <Sparkles className="w-3 h-3" />
              <span>Your personal sanctuary</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              Find clarity in the noise.
            </h1>
            <p className="text-lg text-indigo-200/80 mb-10 max-w-md leading-relaxed">
              A private space to journal your thoughts, track your emotional rhythms, and understand yourself better through compassionate AI guidance.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-400 hover:to-purple-400 transition-all shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2">
                Start your journey <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-colors">
                View demo
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/20 border border-white/10 aspect-[4/3] group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#090514] via-transparent to-transparent z-10 opacity-60"></div>
              <img 
                src="/__mockup/images/lucidly-hero-b.png" 
                alt="Abstract representation of mental clarity" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 backdrop-blur-md bg-[#090514]/40 border border-white/10 p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30">
                  <Brain className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">AI Check-in</p>
                  <p className="text-indigo-200 text-xs">"You seem stressed. Let's take a breath."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 relative border-t border-white/5 bg-[#0d081f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Tools for your mind.</h2>
            <p className="text-indigo-200/70 text-lg">Everything you need to build emotional awareness, all in one calm, private space.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="group p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-indigo-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Reflective Journaling</h3>
              <p className="text-indigo-200/70 leading-relaxed">
                A judgment-free zone to pour your thoughts out. Express your experiences freely with a beautiful, distraction-free editor.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-green-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 group-hover:bg-green-500/20 transition-all">
                <SmilePlus className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Daily Tracker</h3>
              <p className="text-indigo-200/70 leading-relaxed">
                Log your mood and energy levels in seconds. Build a habit of checking in with yourself without it feeling like a chore.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-purple-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                <BarChart2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Deep Analytics</h3>
              <p className="text-indigo-200/70 leading-relaxed">
                Spot patterns in your emotional rhythms. See how your sleep, activities, and stressors correlate with your overall wellbeing.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-pink-500/30 transition-colors relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all">
                  <Brain className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">AI-Guided Check-ins</h3>
                <p className="text-indigo-200/70 leading-relaxed">
                  When you're overwhelmed, our compassionate AI helps you untangle your thoughts and guides you through grounding exercises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 px-6 relative">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-indigo-900/50 to-transparent hidden md:block"></div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">How it unfolds.</h2>
          </div>

          <div className="space-y-12 md:space-y-0">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center justify-between group">
              <div className="md:w-5/12 text-center md:text-right md:pr-12 mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-3">Check in daily</h3>
                <p className="text-indigo-200/70">Take 30 seconds to log how you're feeling. A simple act of mindfulness to anchor your day.</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#090514] border-4 border-indigo-900 flex items-center justify-center text-indigo-400 font-bold z-10 group-hover:border-indigo-500 group-hover:text-indigo-300 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                1
              </div>
              <div className="md:w-5/12 md:pl-12 hidden md:block">
                <div className="h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Activity className="text-indigo-500/50 w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center justify-between group md:mt-24">
              <div className="md:w-5/12 text-center md:text-left md:pl-12 mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-3">Journal freely</h3>
                <p className="text-indigo-200/70">When things get heavy, write it out. Your private space to process complex emotions.</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#090514] border-4 border-purple-900 flex items-center justify-center text-purple-400 font-bold z-10 group-hover:border-purple-500 group-hover:text-purple-300 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                2
              </div>
              <div className="md:w-5/12 md:pr-12 hidden md:block">
                <div className="h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <BookOpen className="text-purple-500/50 w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center justify-between group md:mt-24">
              <div className="md:w-5/12 text-center md:text-right md:pr-12 mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-3">Gain insights</h3>
                <p className="text-indigo-200/70">Watch patterns emerge. Understand what drains you and what gives you life over time.</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#090514] border-4 border-blue-900 flex items-center justify-center text-blue-400 font-bold z-10 group-hover:border-blue-500 group-hover:text-blue-300 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                3
              </div>
              <div className="md:w-5/12 md:pl-12 hidden md:block">
                <div className="h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <BarChart2 className="text-blue-500/50 w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-6 bg-[#05020a] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white">Stories of clarity.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col h-full">
              <div className="flex gap-1 mb-6 text-indigo-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-lg text-indigo-100/90 leading-relaxed mb-8 flex-grow">
                "It feels like the first time an app isn't trying to hack my attention. It's just a quiet place for my brain to rest. The AI check-ins actually calm me down."
              </p>
              <div>
                <p className="text-white font-medium">Elena R.</p>
                <p className="text-indigo-400/60 text-sm">Grad Student</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 flex flex-col h-full transform md:-translate-y-4">
              <div className="flex gap-1 mb-6 text-indigo-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-lg text-indigo-100/90 leading-relaxed mb-8 flex-grow">
                "I used to get overwhelmed by complex journaling apps. Lucidly is so beautiful and minimal that I actually look forward to logging my mood every evening."
              </p>
              <div>
                <p className="text-white font-medium">Marcus T.</p>
                <p className="text-indigo-400/60 text-sm">Software Engineer</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col h-full">
              <div className="flex gap-1 mb-6 text-indigo-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-lg text-indigo-100/90 leading-relaxed mb-8 flex-grow">
                "The analytics finally helped me realize my anxiety spikes directly correlate with my sleep quality. It sounds obvious, but seeing it visualized changed my habits."
              </p>
              <div>
                <p className="text-white font-medium">Sarah K.</p>
                <p className="text-indigo-400/60 text-sm">Product Manager</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/20"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-px mb-8 shadow-2xl shadow-indigo-500/30">
            <div className="w-full h-full bg-[#090514] rounded-[23px] flex items-center justify-center">
              <Heart className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Start your inner dialogue.</h2>
          <p className="text-xl text-indigo-200/70 mb-10 max-w-2xl mx-auto">
            Join thousands of others who have found clarity and peace with Lucidly. Your mind deserves a beautiful space.
          </p>
          <button className="px-10 py-5 rounded-full bg-white text-[#090514] font-semibold text-lg hover:bg-indigo-50 hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
            Create your free account
          </button>
          <p className="mt-6 text-sm text-indigo-400/60 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> Your data is private and encrypted.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-[#05020a] text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-lg text-white">Lucidly</span>
            </div>
            <p className="text-indigo-400/60 max-w-xs">
              A personal sanctuary for your mind. Track, reflect, and grow.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-indigo-400/60">
              <li><a href="#" className="hover:text-indigo-300 transition-colors">Journal</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition-colors">Tracker</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition-colors">AI Check-in</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-indigo-400/60">
              <li><a href="#" className="hover:text-indigo-300 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-indigo-400/60">
              <li><a href="#" className="hover:text-indigo-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-indigo-400/40">
          <p>© 2026 Lucidly. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-indigo-300 transition-colors">Twitter</a>
            <a href="#" className="hover:text-indigo-300 transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
