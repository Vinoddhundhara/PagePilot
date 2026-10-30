import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';

export default function LoadingSkeleton({ slug = '' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto py-12 px-4 transition-colors duration-200"
    >
      {/* Top breadcrumb / meta skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-7 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <div className="h-7 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-xs font-mono text-indigo-600 dark:text-indigo-400">
          <Compass className="w-3.5 h-3.5 animate-spin" />
          <span>Resolving Dynamic Slug</span>
        </div>
      </div>

      {/* Hero title skeleton */}
      <div className="space-y-4 mb-10">
        <div className="h-10 w-3/4 max-w-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700/50 dark:to-slate-800 rounded-2xl bg-[length:200%_100%] animate-shimmer" />
        <div className="h-4 w-1/2 max-w-md bg-slate-200 dark:bg-slate-800/60 rounded-lg animate-pulse" />
      </div>

      {/* Content blocks skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { color: 'from-indigo-500/20 to-purple-500/10' },
          { color: 'from-purple-500/20 to-pink-500/10' },
          { color: 'from-blue-500/20 to-cyan-500/10' },
        ].map((item, idx) => (
          <div 
            key={idx}
            className="h-52 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className={`h-10 w-10 rounded-2xl bg-gradient-to-tr ${item.color} mb-4 animate-pulse`} />
              <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg mb-3 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800/60 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800/60 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>

      {/* Long text paragraph skeleton */}
      <div className="space-y-3 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-4 w-11/12 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      </div>

      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin-slow" />
        <span>Resolving slug <code className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">/{slug || 'home'}</code> from Stage Workspace...</span>
      </motion.div>
    </motion.div>
  );
}
