import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-12 text-slate-500 dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-600/30 text-indigo-600 dark:text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                PagePilot Connect — MERN Integration
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-md text-xs leading-relaxed">
              Technical Assessment Proof of Concept for dynamic CMS page rendering, security,
              and seamless upstream integration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <a href="#pages" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Pages Explorer</a>
            <a href="#integration" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Architecture Flow</a>
            <a href="#docs" className="hover:text-indigo-600 dark:hover:text-white transition-colors">API Specs</a>
            <Link to="/blogs" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">/blogs (Nexcent)</Link>
            <Link to="/about-us" className="hover:text-indigo-600 dark:hover:text-white transition-colors">/about-us</Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Tech Stack: React 18 · Vite 5 · Express · Tailwind CSS · Framer Motion · Shadow DOM · ahdjs</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Assessment POC &copy; {new Date().getFullYear()}</span>
            <span>•</span>
            <span className="text-indigo-500 font-medium">Built with live dynamic resolution</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
