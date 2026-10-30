import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeOverview from './components/HomeOverview';
import PageRenderer from './components/PageRenderer';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Main SaaS Overview Dashboard */}
        <Route path="/" element={<HomeOverview />} />

        {/* Dynamic Page Resolver for any slug or nested slug (e.g. /about-us, /guide/getting-started, /home) */}
        <Route path="/*" element={<PageRenderer />} />
      </Route>
    </Routes>
  );
}
