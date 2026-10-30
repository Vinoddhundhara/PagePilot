import config from '../config/index.js';

class PagePilotError extends Error {
  constructor(message, statusCode = 500, code = 'PAGEPILOT_ERROR') {
    super(message);
    this.name = 'PagePilotError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

class PagePilotService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Normalize and sanitize a slug.
   * Root / or empty resolves to 'home'.
   */
  sanitizeSlug(rawSlug) {
    if (!rawSlug || rawSlug === '/' || rawSlug === '') {
      return 'home';
    }
    // Remove leading and trailing slashes, collapse multiple slashes
    let cleaned = rawSlug.trim().replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/');
    return cleaned;
  }

  /**
   * Internal helper to fetch page from a specific workspace ID.
   */
  async _fetchFromWorkspace(workspaceId, slug, isPreview = false) {
    const baseUrl = config.pagepilot.baseUrl;
    const encodedSlug = encodeURIComponent(slug);
    const endpointUrl = `${baseUrl}/tenant/${workspaceId}/pagebyslug/${encodedSlug}`;

    const requestBody = {
      data: {
        includes: isPreview ? [] : [{ filter: { status: 'live' } }],
        pageSelect: {
          select: {
            title: 1,
            name: 1,
            slug: 1,
            editor: 1,
            head: 1,
            bodyBottom: 1,
            metaTitle: 1,
            metaDescription: 1,
            metaKeywords: 1,
            updatedAt: 1,
            createdAt: 1,
          },
          sectionSelect: {
            content: 1,
          },
        },
      },
    };

    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'PagePilot-MERN-POC/1.0',
    };

    if (config.pagepilot.apiKey) {
      headers['Authorization'] = `Bearer ${config.pagepilot.apiKey}`;
    }

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(config.pagepilot.timeoutMs),
    });

    if (response.status === 404) {
      throw new PagePilotError(
        `Page with slug "${slug}" was not found in PagePilot workspace.`,
        404,
        'PAGE_NOT_FOUND'
      );
    }

    if (!response.ok) {
      throw new PagePilotError(
        `PagePilot upstream API returned HTTP ${response.status}`,
        response.status >= 500 ? 502 : response.status,
        'UPSTREAM_API_ERROR'
      );
    }

    const responseJson = await response.json();
    const rawPage = responseJson.page;

    if (!rawPage) {
      throw new PagePilotError(
        `Page with slug "${slug}" was not found or is unpublished.`,
        404,
        'PAGE_NOT_FOUND'
      );
    }

    // Combine section contents into full HTML
    const sections = Array.isArray(rawPage.sections) ? rawPage.sections : [];
    const combinedHtml = sections
      .map(section => (typeof section === 'string' ? section : section?.content || ''))
      .filter(Boolean)
      .join('\n');

    return {
      id: rawPage._id || rawPage.id || `pp_${slug}`,
      slug: rawPage.slug || slug,
      title: rawPage.title || rawPage.name || 'Untitled Page',
      metaTitle: rawPage.metaTitle || rawPage.title || rawPage.name || '',
      metaDescription: rawPage.metaDescription || '',
      editor: rawPage.editor || 'visual',
      html: combinedHtml,
      sectionsCount: sections.length,
      createdAt: rawPage.createdAt || null,
      updatedAt: rawPage.updatedAt || new Date().toISOString(),
      isCached: false,
      source: 'pagepilot-api',
      workspaceId,
    };
  }

  /**
   * Fetch a single page from PagePilot by slug across configured workspaces.
   * Supports nested slugs like 'guide/getting-started'.
   */
  async fetchPageBySlug(rawSlug, isPreview = false) {
    if (!config.isPagePilotConfigured()) {
      throw new PagePilotError(
        'PagePilot workspace configuration is missing. Set PAGEPILOT_WORKSPACE_ID in server/.env.',
        503,
        'PROVIDER_NOT_CONFIGURED'
      );
    }

    const slug = this.sanitizeSlug(rawSlug);
    const cacheKey = `page:${slug}:${isPreview ? 'preview' : 'live'}`;

    // Check in-memory cache for live pages
    if (!isPreview && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < config.pagepilot.cacheTtlMs) {
        return { ...cached.data, isCached: true };
      }
      this.cache.delete(cacheKey);
    }

    const workspaceIds = config.pagepilot.workspaceIds;

    // Run lookups in parallel across workspaces for fast resolution
    const promises = workspaceIds.map(async (wid) => {
      try {
        return await this._fetchFromWorkspace(wid, slug, isPreview);
      } catch (err) {
        return null;
      }
    });

    const results = await Promise.all(promises);
    const foundPage = results.find(Boolean);

    if (foundPage) {
      if (!isPreview) {
        this.cache.set(cacheKey, { timestamp: Date.now(), data: foundPage });
      }
      return foundPage;
    }

    throw new PagePilotError(
      `Page with slug "${slug}" was not found in PagePilot workspace.`,
      404,
      'PAGE_NOT_FOUND'
    );
  }

  /**
   * Fetch known pages from all configured PagePilot workspaces.
   */
  async listPages() {
    if (!config.isPagePilotConfigured()) {
      return {
        configured: false,
        pages: [],
        message: 'PagePilot workspace not configured',
      };
    }

    const workspaceIds = config.pagepilot.workspaceIds;
    const baseUrl = config.pagepilot.baseUrl;
    const allPagesMap = new Map();

    for (const workspaceId of workspaceIds) {
      const url = `${baseUrl}/tenant/${workspaceId}/client/page?includeSections=false&select=slug name title status createdAt updatedAt`;
      const headers = { 'User-Agent': 'PagePilot-MERN-POC/1.0' };
      if (config.pagepilot.apiKey) {
        headers['Authorization'] = `Bearer ${config.pagepilot.apiKey}`;
      }

      try {
        const response = await fetch(url, {
          headers,
          signal: AbortSignal.timeout(config.pagepilot.timeoutMs),
        });

        if (response.ok) {
          const data = await response.json();
          const rows = Array.isArray(data.rows) ? data.rows : [];
          for (const r of rows) {
            if (r.slug && !allPagesMap.has(r.slug)) {
              allPagesMap.set(r.slug, {
                id: r._id || r.id,
                title: r.title || r.name || 'Untitled',
                slug: r.slug,
                status: r.status || 'live',
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
                workspaceId,
              });
            }
          }
        }
      } catch (err) {
        console.warn(`[PagePilotService] Could not list pages for ${workspaceId}: ${err.message}`);
      }
    }

    const pages = Array.from(allPagesMap.values());
    return {
      configured: true,
      count: pages.length,
      pages,
    };
  }

  clearCache() {
    this.cache.clear();
  }
}

export { PagePilotError };
export default new PagePilotService();
