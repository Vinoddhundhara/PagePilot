import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPagesList } from '../services/apiClient';
import { 
  Search, 
  ArrowRight, 
  Compass, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Layers,
  Globe,
  Tag
} from 'lucide-react';

export default function PagesExplorer() {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'live' | 'guides'
  const [customSlug, setCustomSlug] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPagesList()
      .then((data) => {
        setPages(data.pages || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredPages = pages.filter((page) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (
      (page.title || '').toLowerCase().includes(q) ||
      (page.slug || '').toLowerCase().includes(q)
    );

    if (!matchesSearch) return false;

    if (selectedFilter === 'guides') {
      return (page.slug || '').startsWith('guide/');
    }
    if (selectedFilter === 'live') {
      return page.status === 'live';
    }
    return true;
  });

  return (
    <section id="pages" className="py-20 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header & Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800"
        >
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>Live Workspace Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              Live Pages Explorer
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-xl">
              Published CMS pages discovered in the PagePilot workspace. Click any card to resolve
              and render the live page through dynamic routing.
            </p>
          </div>

          {/* Search Bar with glowing focus ring */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-indigo-500" />
            <input
              type="text"
              placeholder="Search by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all"
            />
          </div>
        </motion.div>

        {/* Filter Pills with smooth spring active indicator */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto text-xs pb-1">
          {[
            { id: 'all', label: `All Pages (${pages.length})` },
            { id: 'guides', label: `Nested Guides (${pages.filter(p => (p.slug || '').startsWith('guide/')).length})` },
            { id: 'live', label: `Live Status (${pages.filter(p => p.status === 'live').length})` },
          ].map((filter) => {
            const isActive = selectedFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`relative px-4 py-2 rounded-full font-semibold transition-all ${
                  isActive
                    ? 'text-white shadow-md shadow-indigo-600/25'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="filterPillActive"
                    className="absolute inset-0 bg-indigo-600 rounded-full -z-0"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="h-48 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse p-6" 
              />
            ))}
          </div>
        )}

        {/* Pages Grid with AnimatePresence & layout */}
        {!loading && (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredPages.map((pageItem, idx) => {
                const targetRoute = pageItem.slug === 'home' ? '/' : `/${pageItem.slug}`;
                return (
                  <motion.div
                    layout
                    key={pageItem.id || pageItem.slug}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                          /{pageItem.slug}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{pageItem.status || 'live'}</span>
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 line-clamp-2">
                        {pageItem.title || 'Untitled Page'}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{pageItem.createdAt ? new Date(pageItem.createdAt).toLocaleDateString() : 'Active'}</span>
                      </div>
                    </div>

                    <Link
                      to={targetRoute}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 group-hover:bg-indigo-600 text-slate-700 dark:text-slate-200 group-hover:text-white text-xs font-semibold transition-all duration-200 border border-slate-200 dark:border-slate-700 group-hover:border-indigo-600 shadow-sm active:scale-98"
                    >
                      <span>Open & Render Page</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty state when search yields no results */}
        {!loading && filteredPages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No published pages matched your search filter "{searchQuery}".
            </p>
          </motion.div>
        )}

        {/* Custom Slug Tester Input Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Direct Slug Navigator</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Test any arbitrary slug directly (e.g. <code className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">blogs</code> or an unmapped slug to test the dynamic 404 handler).
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customSlug.trim()) {
                  navigate(`/${customSlug.trim().replace(/^\/+/, '')}`);
                }
              }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">/</span>
                <input
                  type="text"
                  placeholder="enter-any-slug"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 w-48 sm:w-60 shadow-sm transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md active:scale-95 flex items-center gap-1"
              >
                <span>Go</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
