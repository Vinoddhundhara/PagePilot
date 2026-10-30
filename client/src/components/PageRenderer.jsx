import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useLocation, Link } from 'react-router-dom';
import { fetchPage } from '../services/apiClient';
import SafeHtmlRenderer from './SafeHtmlRenderer';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorState from './ErrorState';
import NotFound from './NotFound';
import { 
  Globe, 
  Code2, 
  Layers, 
  Clock, 
  ArrowLeft, 
  RefreshCw,
  CheckCircle2, 
  FileText,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  Zap,
  Sparkles
} from 'lucide-react';

export default function PageRenderer() {
  const params = useParams();
  const location = useLocation();

  let currentSlug = params['*'] || '';
  if (!currentSlug && location.pathname !== '/') {
    currentSlug = location.pathname.replace(/^\/+/, '');
  }
  if (!currentSlug || currentSlug === '') {
    currentSlug = 'home';
  }

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('rendered'); // 'rendered' | 'json'
  const [viewportMode, setViewportMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [copiedJson, setCopiedJson] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    fetchPage(currentSlug, { signal: controller.signal })
      .then((data) => {
        setPage(data);
        setLoading(false);
        if (data?.title) {
          document.title = `${data.title} | PagePilot Connect`;
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [currentSlug, reloadTrigger]);

  const handleRetry = () => {
    setIsRefreshing(true);
    setReloadTrigger(prev => prev + 1);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const copyJson = () => {
    if (!page) return;
    navigator.clipboard.writeText(JSON.stringify(page, null, 2)).then(() => {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    });
  };

  if (loading) {
    return <LoadingSkeleton slug={currentSlug} />;
  }

  if (error?.status === 404 || error?.code === 'PAGE_NOT_FOUND') {
    return <NotFound slug={currentSlug} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} slug={currentSlug} />;
  }

  if (!page) {
    return <NotFound slug={currentSlug} />;
  }

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'max-w-2xl mx-auto border-x border-slate-300 dark:border-slate-800 shadow-2xl',
    mobile: 'max-w-sm mx-auto border-x border-slate-300 dark:border-slate-800 shadow-2xl',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-6xl mx-auto px-4 py-8 transition-colors duration-200"
    >
      {/* Top Metadata and Inspector Toolbar */}
      <motion.div 
        layout
        className="mb-6 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors duration-200"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm flex items-center justify-center"
                title="Return to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 shadow-sm">
                /{page.slug}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs font-semibold shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live PagePilot Source
              </span>
              {page.isCached && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-[11px] font-mono font-semibold">
                  <Zap className="w-3 h-3 text-amber-500" />
                  Cached
                </span>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                {page.sectionsCount || 1} Section{(page.sectionsCount || 1) > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {page.updatedAt ? new Date(page.updatedAt).toLocaleTimeString() : 'Current'}
              </span>
            </div>
          </div>

          {/* Controls: Viewport toggles, View switchers, Refresh */}
          <div className="flex items-center gap-2">
            {/* Responsive Viewport Preview Switcher */}
            {activeTab === 'rendered' && (
              <div className="hidden md:flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                {[
                  { mode: 'desktop', title: 'Desktop View (Full Width)', icon: Monitor },
                  { mode: 'tablet', title: 'Tablet View (768px)', icon: Tablet },
                  { mode: 'mobile', title: 'Mobile View (380px)', icon: Smartphone },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = viewportMode === item.mode;
                  return (
                    <button
                      key={item.mode}
                      onClick={() => setViewportMode(item.mode)}
                      title={item.title}
                      className={`relative p-2 rounded-xl transition-all ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="viewportPill"
                          className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm -z-0"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <Icon className="w-3.5 h-3.5 relative z-10" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* View Mode Toggle: Rendered vs JSON */}
            <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              {[
                { id: 'rendered', label: 'Rendered View', icon: Globe },
                { id: 'json', label: 'Inspect JSON', icon: Code2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-indigo-600 rounded-xl -z-0"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetry}
              type="button"
              title="Refetch live from PagePilot"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors active:scale-95 flex items-center justify-center"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'rendered' ? (
          <motion.div 
            key="rendered-view"
            layout
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.3 }}
            className={`rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xl p-6 sm:p-10 transition-all duration-300 ${viewportWidths[viewportMode]}`}
          >
            {page.title && (
              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {page.title}
                </h1>
                {page.metaDescription && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                    {page.metaDescription}
                  </p>
                )}
              </div>
            )}

            {/* Render sanitized PagePilot HTML inside Shadow DOM container */}
            {page.html ? (
              <SafeHtmlRenderer html={page.html} />
            ) : (
              <div className="py-20 text-center text-slate-500 text-sm">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-40 text-indigo-500" />
                <p className="font-medium text-slate-700 dark:text-slate-300">Section Content Empty</p>
                <p className="text-xs text-slate-400 mt-1">This page has no section content published yet in PagePilot.</p>
              </div>
            )}
          </motion.div>
        ) : (
          /* Normalized JSON Inspection View */
          <motion.div 
            key="json-view"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 overflow-x-auto shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-400 block">Normalized API Response Contract</span>
                  <span className="text-[11px] text-slate-500 font-mono">Dispatched by server/src/services/pagepilotService.js</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyJson}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors shadow-sm"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
              </motion.button>
            </div>
            <pre className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
              {JSON.stringify(page, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
