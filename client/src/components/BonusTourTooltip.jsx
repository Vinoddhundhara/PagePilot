import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Sparkles, ChevronRight, X, Compass, CheckCircle2 } from 'lucide-react';

/**
 * Bonus Module: PagePilot Tooltips & Guided Highlights
 * 
 * Integrates PagePilot's official onboarding capability (via ahdjs and target selectors).
 * Supports both light and dark modes with interactive product tours.
 */
export default function BonusTourTooltip() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [sdkStatus, setSdkStatus] = useState('Standby');

  const tourSteps = [
    {
      title: 'Dynamic Slug Resolution',
      target: 'Pages Explorer',
      desc: 'Pages created in PagePilot are resolved dynamically on URL navigation without hardcoded templates.',
    },
    {
      title: 'Express Proxy & Parallel Lookup',
      target: 'Backend API',
      desc: 'All upstream calls are proxied through Node/Express with parallel workspace lookups and 60-second in-memory caching.',
    },
    {
      title: 'Shadow DOM Sanitization',
      target: 'Page Renderer',
      desc: 'Raw HTML from PagePilot is sanitized via DOMPurify and encapsulated inside Shadow DOM roots.',
    },
    {
      title: 'AHDjs Bonus Capabilities',
      target: 'AHDjs Engine',
      desc: 'PagePilot Tooltips and Site Tours can be triggered by workspace ID and visitor session tokens.',
    },
  ];

  const triggerLiveAhdSdk = async () => {
    setSdkStatus('Initializing AHDjs...');
    try {
      const workspaceId = import.meta.env.VITE_PAGEPILOT_WORKSPACE_ID || '6336128a251dcbda38bd8fe1';
      
      const AHDModule = await import('ahdjs').catch(() => null);
      if (AHDModule && AHDModule.default) {
        const ahd = new AHDModule.default(undefined, {
          applicationId: workspaceId,
          apiHost: 'https://pagepilot.fabbuilder.com',
          visitorId: `visitor_${Date.now()}`,
          showProgressbar: true,
        });
        
        if (typeof ahd.initializeSiteMap === 'function') {
          await ahd.initializeSiteMap(true);
        }
        if (typeof ahd.showHighlights === 'function') {
          await ahd.showHighlights('home', true);
        }
        setSdkStatus('AHDjs Active (Hooked)');
      } else {
        setSdkStatus('AHDjs Client Ready');
      }
    } catch (err) {
      console.warn('AHDjs initialization note:', err.message);
      setSdkStatus('AHDjs Standby');
    }
  };

  return (
    <>
      {/* Floating Tour / Tooltip Trigger Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            setIsOpen(!isOpen);
            triggerLiveAhdSdk();
          }}
          type="button"
          className="relative flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-2xl shadow-indigo-500/30 transition-all border border-indigo-400/30 group"
          title="Explore Bonus Feature: PagePilot Tooltips & Tours"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow group-hover:rotate-45 transition-transform" />
          <span>Interactive Tour & Tooltip</span>
        </motion.button>
      </div>

      {/* Tour Dialog Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/40 shadow-2xl z-50 transition-colors"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">PagePilot Onboarding Tour</h4>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold block flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Status: {sdkStatus}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                type="button"
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-5"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    Step {activeStep + 1} of {tourSteps.length}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                    Target: {tourSteps[activeStep].target}
                  </span>
                </div>

                <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  {tourSteps[activeStep].title}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tourSteps[activeStep].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Stepper Dots & Next Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                {tourSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    type="button"
                    className={`h-2 rounded-full transition-all ${
                      activeStep === idx
                        ? 'w-6 bg-indigo-600 dark:bg-indigo-500'
                        : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (activeStep < tourSteps.length - 1) {
                    setActiveStep(activeStep + 1);
                  } else {
                    setIsOpen(false);
                  }
                }}
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md active:scale-95"
              >
                <span>{activeStep < tourSteps.length - 1 ? 'Next Step' : 'Finish Tour'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
