import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Route, 
  Server, 
  CloudLightning, 
  MonitorCheck, 
  ShieldCheck, 
  Cpu,
  Layers,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  ArrowRight,
  Sliders,
  Infinity as InfinityIcon,
  LayoutGrid
} from 'lucide-react';

export default function IntegrationFlow() {
  const steps = [
    {
      num: '01',
      title: 'Browser Navigation',
      actor: 'Client Window',
      icon: Globe,
      desc: 'User enters any URL path (e.g. /blogs, /about-us, or /guide/getting-started).',
      badge: 'URL Trigger',
      badgeColor: 'border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10',
      accentColor: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/20',
      detail: 'Initiates window location request without pre-baked static build routes.',
    },
    {
      num: '02',
      title: 'React Router DOM',
      actor: 'Frontend App',
      icon: Route,
      desc: 'Wildcard route (/*) captures the slug and invokes the universal PageRenderer component.',
      badge: 'Client Router',
      badgeColor: 'border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10',
      accentColor: 'from-indigo-500 to-purple-500',
      glow: 'shadow-indigo-500/20',
      detail: 'Dynamic wildcard catcher parses multi-segment slugs in real-time.',
    },
    {
      num: '03',
      title: 'Express Backend API',
      actor: 'Proxy & Validator',
      icon: Server,
      desc: 'Validates slug, enforces path traversal security, and checks the 60s in-memory cache.',
      badge: 'GET /api/pages/*',
      badgeColor: 'border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10',
      accentColor: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/20',
      detail: 'Sanitizes dangerous slug characters and prevents host token leakage.',
    },
    {
      num: '04',
      title: 'PagePilot Stage API',
      actor: 'Upstream Provider',
      icon: CloudLightning,
      desc: 'Parallel requests to verified PagePilot workspaces to resolve published page sections.',
      badge: 'Source of Truth',
      badgeColor: 'border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
      accentColor: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-500/20',
      detail: 'High-speed concurrent queries across active workspaces with auto-fallback.',
    },
    {
      num: '05',
      title: 'Shadow DOM Render',
      actor: 'DOMPurify & Isolation',
      icon: MonitorCheck,
      desc: 'Sanitizes HTML against XSS and renders inside Shadow DOM to isolate styles from the SaaS shell.',
      badge: 'Secure Display',
      badgeColor: 'border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
      accentColor: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/20',
      detail: 'Zero CSS bleed between host app theme and visual PagePilot components.',
    },
  ];

  // View modes: 'carousel' (right-to-left animated slider), 'marquee' (infinite smooth stream), 'grid' (overview)
  const [viewMode, setViewMode] = useState('carousel');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(1); // 1 = right-to-left next
  const autoPlayIntervalRef = useRef(null);
  const autoPlayDuration = 3600; // ms per slide
  const [progress, setProgress] = useState(0);

  // Auto-play timer for Carousel (moving right to left)
  useEffect(() => {
    if (viewMode !== 'carousel' || !isPlaying) {
      setProgress(0);
      return;
    }

    const stepTime = 50; // update progress every 50ms
    const totalTicks = autoPlayDuration / stepTime;
    let currentTick = 0;

    const interval = setInterval(() => {
      currentTick += 1;
      setProgress((currentTick / totalTicks) * 100);

      if (currentTick >= totalTicks) {
        currentTick = 0;
        setProgress(0);
        setDirection(1);
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [viewMode, isPlaying, currentStep, steps.length]);

  const handleNext = () => {
    setDirection(1);
    setProgress(0);
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setProgress(0);
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const handleStepClick = (index) => {
    setDirection(index > currentStep ? 1 : -1);
    setProgress(0);
    setCurrentStep(index);
  };

  // Carousel slide variants for smooth right-to-left motion
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    }),
  };

  return (
    <section id="integration" className="py-20 scroll-mt-20 border-y border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/40 relative overflow-hidden transition-colors duration-200">
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />

      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-3 shadow-sm hover:scale-105 transition-transform cursor-default">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>End-To-End Architecture</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            How Dynamic Page Resolution <span className="text-gradient">Works</span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            The browser URL maps dynamically to PagePilot's workspace with zero hardcoding,
            enterprise-grade sanitization, and isolated style boundaries.
          </p>

          {/* Mode Selector Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'carousel'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Right-To-Left Slider</span>
              <span className="text-[10px] bg-indigo-700/60 text-white px-1.5 py-0.2 rounded font-mono">Auto</span>
            </button>

            <button
              onClick={() => setViewMode('marquee')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'marquee'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              <InfinityIcon className="w-3.5 h-3.5" />
              <span>Continuous Stream</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Full Architecture Grid</span>
            </button>
          </div>
        </motion.div>

        {/* 1. CAROUSEL MODE (RIGHT-TO-LEFT ANIMATED SLIDER) */}
        {viewMode === 'carousel' && (
          <div className="relative">
            {/* Top Interactive Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-2">
              {/* Step indicator pills */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
                {steps.map((step, idx) => {
                  const isActive = idx === currentStep;
                  return (
                    <button
                      key={step.num}
                      onClick={() => handleStepClick(idx)}
                      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-105'
                          : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-400 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                      <span className="font-mono">{step.num}</span>
                      <span className="hidden md:inline font-sans font-medium text-[11px] truncate max-w-[90px]">
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Slider Play/Pause and Direction Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all active:scale-95"
                  title={isPlaying ? 'Pause Auto Slider' : 'Play Auto Slider'}
                  aria-label="Toggle autoplay"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" />}
                </button>

                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
                  <button
                    onClick={handlePrev}
                    className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-90"
                    title="Previous Step"
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold px-2 text-indigo-600 dark:text-indigo-400">
                    {steps[currentStep].num} / 05
                  </span>
                  <button
                    onClick={handleNext}
                    className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-90"
                    title="Next Step (Right to Left)"
                    aria-label="Next step"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Auto-Slide Progress Bar */}
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Spotlight Showcase of Active Slide */}
            <div className="relative min-h-[360px] flex items-center justify-center mb-8">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full max-w-3xl"
                >
                  {(() => {
                    const activeStepData = steps[currentStep];
                    const Icon = activeStepData.icon;
                    return (
                      <div className="p-8 sm:p-10 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-indigo-500/30 dark:border-indigo-500/40 shadow-2xl shadow-indigo-500/10 relative overflow-hidden group">
                        {/* Top decorative gradient bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${activeStepData.accentColor}`} />

                        {/* Background step watermark */}
                        <span className="absolute -bottom-6 -right-4 text-9xl font-mono font-extrabold text-slate-100 dark:text-slate-800/40 select-none pointer-events-none -z-0">
                          {activeStepData.num}
                        </span>

                        <div className="relative z-10">
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm font-extrabold px-3 py-1 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                                STEP {activeStepData.num}
                              </span>
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                {activeStepData.actor}
                              </span>
                            </div>

                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${activeStepData.badgeColor} shadow-sm`}>
                              {activeStepData.badge}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${activeStepData.accentColor} text-white shadow-lg ${activeStepData.glow} shrink-0 w-fit`}
                            >
                              <Icon className="w-8 h-8" />
                            </motion.div>

                            <div>
                              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                                {activeStepData.title}
                              </h3>
                              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                                {activeStepData.desc}
                              </p>
                            </div>
                          </div>

                          {/* Technical Pipeline In-depth Note */}
                          <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3">
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                                Architectural Implementation:
                              </span>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {activeStepData.detail}
                              </p>
                            </div>
                          </div>

                          {/* Next step hint button */}
                          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200/70 dark:border-slate-800/70 text-xs">
                            <span className="text-slate-400 dark:text-slate-500">
                              Auto-advances every {autoPlayDuration / 1000}s from right to left
                            </span>
                            <button
                              onClick={handleNext}
                              className="inline-flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                            >
                              <span>Next step</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quick Multi-Card Horizontal Preview Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {steps.map((step, idx) => {
                const isActive = idx === currentStep;
                const Icon = step.icon;
                return (
                  <button
                    key={step.num}
                    onClick={() => handleStepClick(idx)}
                    className={`text-left p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 border-indigo-500 dark:border-indigo-500 shadow-lg shadow-indigo-500/10 scale-102 ring-2 ring-indigo-500/20'
                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-75 hover:opacity-100 hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                        {step.num}
                      </span>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {step.title}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {step.actor}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. CONTINUOUS STREAM MODE (INFINITE RIGHT-TO-LEFT MARQUEE SLIDER) */}
        {viewMode === 'marquee' && (
          <div className="relative overflow-hidden py-4 mask-gradient-x pause-on-hover">
            <div className="flex items-center justify-between mb-4 px-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Infinite continuous right-to-left flow. Hover over any card to pause and inspect.
              </span>
              <span className="font-mono text-[11px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                Pause On Hover Active
              </span>
            </div>

            {/* Animated Marquee Flex Track */}
            <div className="flex gap-4 marquee-track animate-marquee w-max">
              {[...steps, ...steps].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={`${step.num}-${idx}`}
                    className="w-72 sm:w-80 shrink-0 flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 group hover:-translate-y-2 relative"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                          {step.num}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${step.badgeColor}`}>
                          {step.badge}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-fit mb-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        <Icon className="w-5 h-5" />
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {step.title}
                      </h3>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">
                        {step.actor}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Step {step.num} of 05</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. GRID MODE (FULL ARCHITECTURE GRID WITH CONNECTING PARTICLES) */}
        {viewMode === 'grid' && (
          <div className="relative">
            {/* Animated Data Flow Beam */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 -translate-y-12 opacity-30 pointer-events-none -z-0" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 group"
                  >
                    {/* Top hover indicator */}
                    <div className="absolute top-0 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 transition-colors">
                          {step.num}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${step.badgeColor}`}>
                          {step.badge}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-fit mb-4 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {step.title}
                      </h3>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">
                        {step.actor}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Flow: 0{idx + 1} &rarr; 0{Math.min(idx + 2, 5)}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:animate-ping" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Architectural Safeguards Grid (Animated cards below) */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-200 dark:border-slate-800">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Zero Secret Leakage
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Workspace credentials remain strictly isolated on the Express backend proxy.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-500/40 transition-all duration-200 group"
          >
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Shadow DOM Style Isolation
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                PagePilot visual builder CSS does not bleed into host application navigation or buttons.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-500/40 transition-all duration-200 group"
          >
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Parallel Lookup & Cache
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Simultaneous multi-workspace lookups with 60s in-memory caching for sub-millisecond repeated loads.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
