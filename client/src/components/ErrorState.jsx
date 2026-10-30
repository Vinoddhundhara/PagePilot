import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, ArrowLeft, Copy, Check, Terminal, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ErrorState({ error, onRetry, slug }) {
  const [copied, setCopied] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const isMissingConfig = error?.code === 'PROVIDER_NOT_CONFIGURED';
  const isTimeout = error?.code === 'UPSTREAM_TIMEOUT';

  const copyDiagnostics = () => {
    const diag = JSON.stringify({
      slug: slug || 'home',
      errorCode: error?.code || 'FETCH_ERROR',
      status: error?.status || 500,
      message: error?.message,
      timestamp: new Date().toISOString(),
    }, null, 2);

    navigator.clipboard.writeText(diag).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRetryClick = () => {
    if (!onRetry) return;
    setIsRetrying(true);
    onRetry();
    setTimeout(() => setIsRetrying(false), 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-2xl mx-auto my-16 p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-500/20 shadow-2xl text-center transition-colors duration-200 relative overflow-hidden"
    >
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Alert Icon */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-flex p-5 rounded-3xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-6 border border-rose-200 dark:border-rose-500/20 shadow-lg shadow-rose-500/10"
      >
        <AlertTriangle className="w-12 h-12" />
      </motion.div>

      <div>
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 shadow-sm inline-block mb-3">
          {error?.code || 'Resolution Error'}
        </span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
        {isMissingConfig
          ? 'PagePilot Workspace Not Configured'
          : isTimeout
          ? 'Upstream Provider Timed Out'
          : 'Unable to Load Page Content'}
      </h2>

      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
        {error?.message || 'An error occurred while communicating with the PagePilot service.'}
      </p>

      {/* Diagnostic details box */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-left font-mono text-xs mb-8 text-slate-700 dark:text-slate-300 space-y-2 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px]">
          <span className="flex items-center gap-1.5 font-sans font-bold">
            <Terminal className="w-3.5 h-3.5 text-rose-500" />
            <span>Diagnostics Telemetry</span>
          </span>
          <button
            onClick={copyDiagnostics}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Target Slug:</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">/{slug || 'home'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Error Code:</span>
          <span className="text-rose-600 dark:text-rose-400 font-semibold">{error?.code || 'FETCH_ERROR'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">HTTP Status:</span>
          <span className="text-amber-600 dark:text-amber-400 font-semibold">{error?.status || 500}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetryClick}
            type="button"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>Retry Request</span>
          </motion.button>
        )}

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
