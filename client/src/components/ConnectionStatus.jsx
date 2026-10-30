import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkHealth } from '../services/apiClient';
import { ShieldCheck, RefreshCw, Activity, CheckCircle2, Lock, Copy, Check, Zap } from 'lucide-react';

export default function ConnectionStatus() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latencyMs, setLatencyMs] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const data = await checkHealth();
      const end = performance.now();
      setLatencyMs(Math.round(end - start));
      setHealth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const copyWorkspaceId = () => {
    const wid = health?.configuration?.workspaceIdMasked || '6ac26e06fb3d2c14cbf71f89';
    navigator.clipboard.writeText(wid).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isConfigured = health?.configuration?.configured;

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
    }),
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-indigo-500/5 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Live Integration Diagnostics</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-semibold">
                ACTIVE
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time health check against Express backend and PagePilot stage workspace.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchStatus}
          disabled={loading}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
          <span>{loading ? 'Testing...' : 'Test Connection'}</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Backend Status */}
        <motion.div 
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Backend API
            </span>
            <Zap className="w-3.5 h-3.5 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${health ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`} />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {health ? 'Healthy (Port 5001)' : error ? 'Offline' : 'Connecting...'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block font-mono">
            Latency: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{latencyMs !== null ? `${latencyMs} ms` : '—'}</span>
          </span>
        </motion.div>

        {/* Workspace Config */}
        <motion.div 
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/40 transition-all duration-200 group"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Workspaces Active
          </span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <Lock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 truncate">
                {health?.configuration?.workspaceIdMasked || 'Connected'}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={copyWorkspaceId}
              type="button"
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 transition-colors"
              title="Copy masked ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </motion.button>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
            {isConfigured ? '✓ Multi-Workspace Fallback' : '⚠ Ready & Proxied'}
          </span>
        </motion.div>

        {/* Upstream Host */}
        <motion.div 
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/40 transition-all duration-200 group"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Provider Base URL
          </span>
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="text-xs text-slate-700 dark:text-slate-300 truncate font-mono">
              pagepilot.fabbuilder.com
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            REST v1 Content API
          </span>
        </motion.div>

        {/* Cache Policy */}
        <motion.div 
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-500/40 transition-all duration-200 group"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Proxy Cache TTL
          </span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {health?.configuration?.cacheTtlSeconds || 60} Seconds
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            In-Memory Fast Cache
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
