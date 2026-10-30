import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound({ slug = '' }) {
  const suggestedSlugs = [
    { slug: 'blogs', label: 'nexcent (User Page)' },
    { slug: 'about-us', label: 'About Us' },
    { slug: 'home', label: 'Modern Business Landing Page' },
    { slug: 'guide/getting-started', label: 'Getting Started Guide' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-2xl mx-auto my-16 p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-2xl transition-colors duration-200 relative overflow-hidden"
    >
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Animated 404 Icon */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-flex p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-200 dark:border-indigo-500/20 shadow-lg shadow-indigo-500/10"
      >
        <HelpCircle className="w-12 h-12" />
      </motion.div>

      <div>
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shadow-sm inline-block mb-3">
          404 Page Not Found
        </span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
        No Page Matches <span className="text-indigo-600 dark:text-indigo-400 font-mono">/{slug}</span>
      </h2>

      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
        The requested slug has not been published in the connected PagePilot workspace.
        Dynamic routing safely resolved the path and received a clean 404 response.
      </p>

      {/* Suggested active slugs with staggered hover cards */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-left mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Verified Active Slugs In Workspace:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedSlugs.map((item, idx) => (
            <motion.div
              key={item.slug}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Link
                to={`/${item.slug}`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white transition-all shadow-sm group"
              >
                <div>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold block">/{item.slug}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">{item.label}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/25"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
