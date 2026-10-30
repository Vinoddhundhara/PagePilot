import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Copy, Check, Terminal, Code2, Sparkles } from 'lucide-react';

export default function DocSection() {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const curlExample = `curl -X GET http://localhost:5001/api/pages/blogs \\
  -H "Accept: application/json"`;

  const routerExample = `// client/src/App.jsx - Universal Wildcard Route
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<HomeOverview />} />
    {/* Dynamically resolves /blogs, /about-us, /guide/getting-started */}
    <Route path="/*" element={<PageRenderer />} />
  </Route>
</Routes>`;

  const serviceExample = `// server/src/services/pagepilotService.js
const endpoint = \`\${BASE_URL}/tenant/\${WORKSPACE_ID}/pagebyslug/\${encodeURIComponent(slug)}\`;
const res = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: { pageSelect: { ... }, sectionSelect: { content: 1 } } })
});`;

  return (
    <section id="docs" className="py-20 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Developer Quickstart & Endpoints</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
            API & Dynamic Routing Documentation
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
            Reference for backend endpoints, dynamic slug resolution mechanisms, and client-side integration patterns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Backend Endpoints Table */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 mb-5 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Backend Endpoints Specification</span>
              </h3>

              <div className="space-y-4">
                {[
                  {
                    method: 'GET',
                    path: '/api/health',
                    badge: 'Public Diagnostics',
                    color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10',
                    desc: 'Returns application health, uptime, and non-sensitive configuration status.',
                  },
                  {
                    method: 'GET',
                    path: '/api/pages',
                    badge: 'Workspace Index',
                    color: 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10',
                    desc: 'Retrieves published page metadata (title, slug, status, dates) across active workspaces.',
                  },
                  {
                    method: 'GET',
                    path: '/api/pages/:slug(*)',
                    badge: 'Dynamic Resolver',
                    color: 'text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10',
                    desc: 'Resolves single or nested slugs (e.g. blogs, guide/getting-started) and returns normalized HTML sections.',
                  },
                ].map((endpoint, i) => (
                  <motion.div
                    key={endpoint.path}
                    whileHover={{ x: 4, transition: { duration: 0.15 } }}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 transition-all duration-200 cursor-default"
                  >
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                      <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-md ${endpoint.color}`}>
                        {endpoint.method} {endpoint.path}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {endpoint.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {endpoint.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Terminal cURL snippet */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-slate-900 text-slate-100 dark:bg-slate-950 border border-slate-800 font-mono text-xs shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3 text-slate-400">
                <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Test via cURL:
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(curlExample, 'curl')}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  {copiedKey === 'curl' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </motion.button>
              </div>
              <pre className="text-slate-300 overflow-x-auto p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 leading-relaxed">
                {curlExample}
              </pre>
            </motion.div>
          </motion.div>

          {/* Right: Code Snippets */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-slate-900 text-slate-100 dark:bg-slate-950 border border-slate-800 font-mono text-xs shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3 text-slate-400">
                <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  Dynamic Wildcard Router in React:
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(routerExample, 'router')}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  {copiedKey === 'router' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </motion.button>
              </div>
              <pre className="text-slate-300 overflow-x-auto p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 leading-relaxed">
                {routerExample}
              </pre>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-slate-900 text-slate-100 dark:bg-slate-950 border border-slate-800 font-mono text-xs shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3 text-slate-400">
                <span className="text-purple-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  PagePilot Integration Service Adapter:
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(serviceExample, 'service')}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  {copiedKey === 'service' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </motion.button>
              </div>
              <pre className="text-slate-300 overflow-x-auto p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 leading-relaxed">
                {serviceExample}
              </pre>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
