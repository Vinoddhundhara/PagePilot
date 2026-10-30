import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Code2, Terminal, CheckCircle2, Play, ExternalLink, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const [activeSlugTab, setActiveSlugTab] = useState('blogs');

  const slugSnippets = {
    'blogs': {
      url: '/blogs',
      title: 'nexcent (User Created & Published)',
      source: 'PagePilot Cloud',
      time: '0.01s (Cached)',
    },
    'about-us': {
      url: '/about-us',
      title: 'About Us',
      source: 'PagePilot Cloud',
      time: '180ms',
    },
    'home': {
      url: '/home',
      title: 'Modern Business Landing Page',
      source: 'PagePilot Cloud',
      time: '210ms',
    },
    'guide/getting-started': {
      url: '/guide/getting-started',
      title: 'Getting Started (Nested Route)',
      source: 'PagePilot Cloud',
      time: '195ms',
    },
  };

  const selected = slugSnippets[activeSlugTab];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
    },
  };

  return (
    <div className="relative pt-12 pb-20 overflow-hidden">
      {/* Background ambient lighting with smooth floating animation */}
      <motion.div 
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/15 blur-[130px] rounded-full pointer-events-none -z-10" 
      />

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Controls */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Pill Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm hover:scale-105 transition-transform cursor-default">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
                <span>Dynamic Headless CMS Integration Engine</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.12]"
            >
              Your PagePilot Content. <br />
              <span className="text-gradient">One Seamless Experience.</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Deliver visual CMS pages authored in PagePilot directly inside your React
              web app. URL slugs resolve on-demand with XSS sanitization, style-isolated
              Shadow DOM, and zero template hardcoding.
            </motion.p>

            {/* Quick-test slug badges */}
            <motion.div variants={itemVariants} className="pt-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Click to Test Verified Slugs:
              </span>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {['blogs', 'about-us', 'home', 'guide/getting-started'].map((slug) => (
                  <motion.div
                    key={slug}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Link
                      to={`/${slug}`}
                      className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono text-xs font-semibold hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 shadow-sm transition-colors flex items-center gap-1.5 group"
                    >
                      <span>/{slug}</span>
                      <Zap className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3"
            >
              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                href="#pages"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 group"
              >
                Explore Live Pages
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                href="#integration"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                Architecture Flow
              </motion.a>
            </motion.div>

            {/* Checkmark bullets */}
            <motion.div 
              variants={itemVariants}
              className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-500 dark:text-slate-400"
            >
              <span className="flex items-center gap-1.5 font-medium hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Hardcoded Templates
              </span>
              <span className="flex items-center gap-1.5 font-medium hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-Workspace Fallback
              </span>
              <span className="flex items-center gap-1.5 font-medium hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Shadow DOM Style Safe
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive Slug Resolver Preview Card */}
          <motion.div 
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10 hover:border-slate-300 dark:hover:border-slate-700 group">
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block hover:scale-125 transition-transform" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block hover:scale-125 transition-transform" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block hover:scale-125 transition-transform" />
                  <span className="ml-2 text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                    <Terminal className="w-3.5 h-3.5 text-indigo-500" /> dynamic-slug-engine
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>200 OK</span>
                </div>
              </div>

              {/* Tab Selector with Framer Motion LayoutId */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
                {Object.keys(slugSnippets).map((slugKey) => {
                  const isActive = activeSlugTab === slugKey;
                  return (
                    <button
                      key={slugKey}
                      onClick={() => setActiveSlugTab(slugKey)}
                      className={`relative px-3 py-1.5 rounded-lg font-mono transition-all text-xs whitespace-nowrap font-medium ${
                        isActive
                          ? 'text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="heroTabIndicator"
                          className="absolute inset-0 bg-indigo-600 rounded-lg -z-0"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">/{slugKey}</span>
                    </button>
                  );
                })}
              </div>

              {/* Resolution Payload Display */}
              <div className="p-5 font-mono text-xs space-y-3 bg-slate-900 text-slate-200 dark:bg-slate-950 min-h-[220px]">
                <div className="text-slate-400 text-[11px] flex items-center justify-between">
                  <span>// 1. Incoming Client Route:</span>
                  <span className="text-[10px] text-indigo-400 animate-pulse">Live Captured</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected.url}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700/80 flex items-center justify-between text-indigo-400 font-bold shadow-sm">
                      <span className="flex items-center gap-2">
                        <span className="text-emerald-400">GET</span> {selected.url}
                      </span>
                      <Link
                        to={selected.url}
                        className="text-[11px] text-indigo-300 hover:text-white underline font-sans flex items-center gap-1 group/link"
                      >
                        <span>Render Page</span> 
                        <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>

                    <div className="text-slate-400 text-[11px] pt-1">// 2. Upstream Response:</div>
                    <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/70 space-y-1 text-[11px] shadow-inner">
                      <div><span className="text-purple-400">"title"</span>: <span className="text-emerald-300">"{selected.title}"</span>,</div>
                      <div><span className="text-purple-400">"source"</span>: <span className="text-emerald-300">"{selected.source}"</span>,</div>
                      <div><span className="text-purple-400">"resolutionTime"</span>: <span className="text-amber-300">"{selected.time}"</span>,</div>
                      <div><span className="text-purple-400">"engine"</span>: <span className="text-cyan-300">"ShadowDOM + DOMPurify"</span></div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
