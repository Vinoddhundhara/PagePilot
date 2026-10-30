import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import pagepilotService from '../src/services/pagepilotService.js';
import config from '../src/config/index.js';

describe('Backend API & Security Suite', () => {
  describe('GET /api/health', () => {
    it('should return 200 with service status and masked configuration', async () => {
      const res = await request(app).get('/api/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.timestamp);
      assert.ok(res.body.data.configuration);
      // Ensure no raw secrets leaked
      assert.equal(typeof res.body.data.configuration.workspaceIdMasked, 'string');
      assert.equal(res.body.data.configuration.apiKey, undefined);
    });
  });

  describe('Slug Validation & Security (Path Traversal & Injection)', () => {
    it('should reject path traversal attempts (..) with 400', async () => {
      const res = await request(app).get('/api/pages/../../etc/passwd');
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'PATH_TRAVERSAL_DETECTED');
    });

    it('should reject backslashes and relative path patterns with 400', async () => {
      const res = await request(app).get('/api/pages/..%2F..%2Fwindows');
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'PATH_TRAVERSAL_DETECTED');
    });

    it('should reject invalid characters with 400', async () => {
      const res = await request(app).get('/api/pages/test<script>');
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'INVALID_SLUG_FORMAT');
    });
  });

  describe('Non-Existent Routes & 404 Behavior', () => {
    it('should return 404 for arbitrary non-existent API routes', async () => {
      const res = await request(app).get('/api/unknown-endpoint');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'API_ENDPOINT_NOT_FOUND');
    });
  });

  describe('Page Resolution Mocked Scenarios', () => {
    const originalFetch = pagepilotService.fetchPageBySlug;

    after(() => {
      pagepilotService.fetchPageBySlug = originalFetch;
    });

    it('should return 200 with normalized page data for valid slug', async () => {
      pagepilotService.fetchPageBySlug = async (slug) => ({
        id: 'mock_123',
        slug,
        title: 'Mocked About Page',
        html: '<div><h1>About Us</h1><p>Welcome to our story.</p></div>',
        sectionsCount: 1,
        editor: 'visual',
        updatedAt: '2026-10-29T10:00:00.000Z',
        isCached: false,
        source: 'pagepilot-api',
      });

      const res = await request(app).get('/api/pages/about-us');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.slug, 'about-us');
      assert.equal(res.body.data.title, 'Mocked About Page');
      assert.ok(res.body.data.html.includes('Welcome to our story'));
    });

    it('should return 404 with standard schema when page is not found upstream', async () => {
      pagepilotService.fetchPageBySlug = async (slug) => {
        const err = new Error(`Page with slug "${slug}" was not found.`);
        err.statusCode = 404;
        err.code = 'PAGE_NOT_FOUND';
        throw err;
      };

      const res = await request(app).get('/api/pages/non-existent-page-slug');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'PAGE_NOT_FOUND');
      assert.ok(res.body.error.message.includes('non-existent-page-slug'));
    });

    it('should return 504 on upstream timeout', async () => {
      pagepilotService.fetchPageBySlug = async () => {
        const err = new Error('Request timed out');
        err.statusCode = 504;
        err.code = 'UPSTREAM_TIMEOUT';
        throw err;
      };

      const res = await request(app).get('/api/pages/heavy-page');
      assert.equal(res.status, 504);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'UPSTREAM_TIMEOUT');
    });

    it('should return 503 if workspace ID is not configured', async () => {
      pagepilotService.fetchPageBySlug = async () => {
        const err = new Error('PagePilot workspace configuration is missing.');
        err.statusCode = 503;
        err.code = 'PROVIDER_NOT_CONFIGURED';
        throw err;
      };

      const res = await request(app).get('/api/pages/home');
      assert.equal(res.status, 503);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'PROVIDER_NOT_CONFIGURED');
    });
  });

  describe('Live Integration Check (against real PagePilot Workspace)', () => {
    it('should fetch real "about-us" page from configured workspace', async () => {
      // Only execute live integration if workspace ID is present
      if (!config.isPagePilotConfigured()) {
        console.log('Skipping live test: Workspace ID not configured.');
        return;
      }

      const res = await request(app).get('/api/pages/about-us');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.slug, 'about-us');
      assert.ok(res.body.data.html.length > 50);
      assert.equal(res.body.data.source, 'pagepilot-api');
    });

    it('should fetch real "home" page from configured workspace', async () => {
      if (!config.isPagePilotConfigured()) return;

      const res = await request(app).get('/api/pages/home');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.slug, 'home');
      assert.ok(res.body.data.title);
    });

    it('should fetch nested slug "guide/getting-started"', async () => {
      if (!config.isPagePilotConfigured()) return;

      const res = await request(app).get('/api/pages/guide/getting-started');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.slug, 'guide/getting-started');
      assert.ok(res.body.data.title);
    });

    it('should fetch real pages list from /api/pages', async () => {
      if (!config.isPagePilotConfigured()) return;

      const res = await request(app).get('/api/pages');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.pages));
      assert.ok(res.body.data.pages.length >= 2);
    });
  });
});
