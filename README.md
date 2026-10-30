# PagePilot Connect — MERN Integration POC

A production-grade Proof of Concept (POC) demonstrating the dynamic integration of **PagePilot-created pages** into a modern **MERN** web application.

This application dynamically resolves URL paths, proxies requests securely via an Express backend to the authorized PagePilot stage workspace, sanitizes markup against XSS, and renders rich CMS pages inside an isolated Shadow DOM container with zero template hardcoding.

---

## 📑 Table of Contents
- [1. Executive Summary & Requirement Mapping](#1-executive-summary--requirement-mapping)
- [2. Technology Stack](#2-technology-stack)
- [3. System Architecture & Mermaid Diagram](#3-system-architecture--mermaid-diagram)
- [4. PagePilot Integration Architecture](#4-pagepilot-integration-architecture)
- [5. Dynamic Page Routing Implementation](#5-dynamic-page-routing-implementation)
- [6. Backend API Specification](#6-backend-api-specification)
- [7. Security Architecture & Threat Mitigation](#7-security-architecture--threat-mitigation)
- [8. Bonus Integration: Tooltips & Tours](#8-bonus-integration-tooltips--tours)
- [9. Setup, Configuration & Running Locally](#9-setup-configuration--running-locally)
- [10. Automated & Manual Test Results](#10-automated--manual-test-results)
- [11. AI Tools & Prompt Engineering Disclosure](#11-ai-tools--prompt-engineering-disclosure)
- [12. Limitations & Blockers Encountered](#12-limitations--blockers-encountered)
- [13. Submission Packaging](#13-submission-packaging)

---

## 1. Executive Summary & Requirement Mapping

| Requirement | Implementation Detail | Status |
| :--- | :--- | :--- |
| **MERN Architecture** | Express.js backend with Node 20, Vite + React 18 frontend, clean layered architecture. | ✅ Verified |
| **Stage Workspace Integration** | Authorized stage workspace `6ac26e06fb3d2c14cbf71f89` (*PagePilot MERN POC*) connected. | ✅ Verified |
| **Dynamic Slug Resolution** | Wildcard routing `/*` extracts any slug (`/about-us`, `/home`, nested `/guide/getting-started`) on-demand. | ✅ Verified |
| **Test >= 2 Slugs** | Tested 4 live slugs: `/about-us`, `/home`, `/guide/getting-started`, `/guide/live-demo`. | ✅ Verified |
| **State Handling** | Loading skeletons, error boundaries, retry triggers, and custom 404 states for invalid/missing slugs. | ✅ Verified |
| **No Credential Leakage** | Credentials kept strictly server-side in `server/.env`. Masked in health check; zero tokens in bundles. | ✅ Verified |
| **Bonus Module** | Explored & integrated PagePilot's official Onboarding Tooltips & Tours via `ahdjs` SDK. | ✅ Verified |
| **Clean Packaging** | Root script generates submission ZIP excluding `node_modules`, `dist`, `.env`, and caches. | ✅ Verified |

---

## 2. Technology Stack

### Frontend (`client/`)
- **React 18** (`react`, `react-dom`): Functional components, custom hooks, and concurrent features.
- **Vite 5**: Sub-second HMR and optimized production bundling.
- **React Router DOM 6**: Wildcard dynamic routing (`/*`), URL parameter extraction, and programmatic navigation.
- **Tailwind CSS 3**: Custom dark SaaS design tokens (dark navy/charcoal surfaces, electric violet/indigo accents).
- **DOMPurify**: Sanitization of incoming CMS HTML before DOM insertion.
- **Web Components (Shadow DOM)**: Complete style isolation so PagePilot stylesheets never distort host SaaS styles.
- **Lucide React**: Modern, scalable icon system.
- **AHDjs (`ahdjs` ^0.0.227)**: PagePilot's official client SDK for Tooltips, Tours, and App Banners.

### Backend (`server/`)
- **Node.js (v20+) & Express.js**: ES Modules (`"type": "module"`), modular route-controller-service pattern.
- **Helmet**: Hardens standard HTTP headers (Cross-Origin Resource Policy, DNS prefetch control, etc.).
- **CORS**: Origin validation allowing authorized client origins.
- **Express Rate Limit**: Protects the backend and upstream PagePilot endpoints from denial-of-service spikes.
- **Native Fetch & AbortController**: 8-second timeout enforcement on upstream requests.
- **In-Memory Cache (TTL: 60s)**: High-speed caching for published page rows to prevent redundant network trips.

---

## 3. System Architecture & Mermaid Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Reviewer
    participant Browser as React Browser App
    participant Router as React Router (/*)
    participant PageRenderer as PageRenderer Component
    participant Express as Express API (/api/pages)
    participant Cache as In-Memory Cache (TTL: 60s)
    participant PagePilot as PagePilot Stage API

    User->>Browser: Enters URL (e.g. /about-us or /guide/getting-started)
    Browser->>Router: Resolves route via wildcard /*
    Router->>PageRenderer: Mounts with currentSlug
    PageRenderer->>Express: GET /api/pages/:slug (with AbortSignal)
    
    alt In-Memory Cache Hit
        Express->>Cache: Lookup slug
        Cache-->>Express: Return cached normalized page
    else Cache Miss
        Express->>Express: Validate slug & prevent traversal
        Express->>PagePilot: POST /tenant/:workspaceId/pagebyslug/:slug
        PagePilot-->>Express: Returns JSON with page sections
        Express->>Cache: Save normalized page (TTL: 60s)
    end

    Express-->>PageRenderer: 200 OK { success: true, data: { html, title, ... } }
    PageRenderer->>PageRenderer: DOMPurify.sanitize(html)
    PageRenderer->>Browser: Renders into isolated Shadow DOM container
```

---

## 4. PagePilot Integration Architecture

### Discovery & Workspace Context
Through inspection of the authorized account (`test.user@coderower.com`):
- **User Account:** `test.user@coderower.com`
- **Active Assessment Tenant ID:** `6ac26e06fb3d2c14cbf71f89`
- **Tenant Name:** `PagePilot MERN POC`
- **Base Endpoint:** `https://pagepilot.fabbuilder.com/api`

### Content Retrieval Protocol
PagePilot provides a REST endpoint specifically structured for headless web integrations:
```http
POST https://pagepilot.fabbuilder.com/api/tenant/:workspaceId/pagebyslug/:slug
Content-Type: application/json

{
  "data": {
    "includes": [],
    "pageSelect": {
      "select": { "title": 1, "name": 1, "slug": 1, "editor": 1, "head": 1, "bodyBottom": 1 },
      "sectionSelect": { "content": 1 }
    }
  }
}
```
- **Public Delivery:** For published (`status: 'live'`) pages, PagePilot allows reading content without transmitting bearer tokens on public traffic.
- **Draft/Preview Mode:** If an API key or bearer token is provided in the `Authorization` header, draft pages (such as `poc-permission-test`) can also be retrieved.

### Data Normalization
The Express service adapter (`server/src/services/pagepilotService.js`) transforms raw provider schemas into a clean, predictable contract:
```json
{
  "success": true,
  "data": {
    "id": "6ac28cb9fb3d2c14cbf72a97",
    "slug": "about-us",
    "title": "About Us",
    "metaDescription": "",
    "editor": "visual",
    "html": "<div data-ahd-tpl-root=\"true\">...</div>",
    "sectionsCount": 1,
    "createdAt": "2026-10-04T17:28:25.663Z",
    "updatedAt": "2026-10-04T17:28:25.663Z",
    "isCached": false,
    "source": "pagepilot-api"
  }
}
```

---

## 5. Dynamic Page Routing Implementation

### Reusable Single Renderer
Unlike naive implementations that create individual React components for every route, PagePilot Connect uses a **single, universal `PageRenderer.jsx`** component:

```jsx
// client/src/App.jsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<HomeOverview />} />
    {/* Wildcard captures any single or multi-segment slug */}
    <Route path="/*" element={<PageRenderer />} />
  </Route>
</Routes>
```

### Stale Request Abort Handling
When a user clicks between multiple slugs rapidly, previous in-flight requests are automatically aborted via `AbortController` in `useEffect`:
```javascript
useEffect(() => {
  if (abortControllerRef.current) abortControllerRef.current.abort();
  const controller = new AbortController();
  abortControllerRef.current = controller;

  fetchPage(currentSlug, { signal: controller.signal })
    .then(setPage)
    .catch((err) => {
      if (err.name !== 'AbortError') setError(err);
    });

  return () => controller.abort();
}, [currentSlug]);
```

### Shadow DOM Style Isolation (`SafeHtmlRenderer.jsx`)
PagePilot visual pages contain extensive stylesheets and Bootstrap/custom classes. Injecting raw HTML directly into the application causes CSS pollution that damages application navigation.
`SafeHtmlRenderer.jsx` sanitizes the HTML via **DOMPurify** and mounts it inside a **Shadow DOM root** (`host.attachShadow({ mode: 'open' })`):
1. PagePilot CSS applies 100% faithfully to its own elements.
2. The outer SaaS application UI remains pristine.
3. Embedded JavaScript tags are stripped, preventing XSS vulnerabilities.

---

## 6. Backend API Specification

### `GET /api/health`
Returns server status and non-sensitive configuration diagnostics.
```json
{
  "success": true,
  "data": {
    "uptimeSeconds": 482,
    "timestamp": "2026-10-29T10:40:00.000Z",
    "environment": "development",
    "configuration": {
      "status": "online",
      "configured": true,
      "baseUrl": "https://pagepilot.fabbuilder.com/api",
      "workspaceIdMasked": "6ac26e...1f89",
      "cacheTtlSeconds": 60
    }
  }
}
```

### `GET /api/pages`
Lists all published pages available in the configured PagePilot workspace.
```json
{
  "success": true,
  "data": {
    "configured": true,
    "count": 4,
    "pages": [
      {
        "id": "6ac28cb9fb3d2c14cbf72a97",
        "title": "About Us",
        "slug": "about-us",
        "status": "live"
      },
      {
        "id": "6ac29291fb3d2c14cbf72dd6",
        "title": "Getting Started",
        "slug": "guide/getting-started",
        "status": "live"
      }
    ]
  }
}
```

### `GET /api/pages/:slug(*)`
Fetches and normalizes a specific page by slug. Supports nested slugs like `/api/pages/guide/getting-started`.

---

## 7. Security Architecture & Threat Mitigation

1. **Path Traversal & Injection Prevention (`slugValidator.js`):**
   - Rejects `..`, `../`, `./`, `\`, and control characters with `400 Bad Request` (`PATH_TRAVERSAL_DETECTED`).
   - Restricts slug characters to `[a-zA-Z0-9_\-\/]`.
2. **SSRF Mitigation:**
   - The user cannot specify arbitrary fetch targets. The upstream host is hardcoded/configured to `https://pagepilot.fabbuilder.com/api` and only the verified workspace parameter is used.
3. **XSS Sanitization:**
   - Raw HTML from PagePilot is sanitized via `DOMPurify` before rendering. Script tags and dangerous event handlers (`onload`, `onerror`) are stripped.
4. **Credential Isolation:**
   - Secrets are loaded from `server/.env`. No workspace credentials or keys are exposed in client bundles or public endpoints.
5. **Rate Limiting & Timeouts:**
   - IP rate-limited to 300 requests per 15-minute window.
   - 8000ms hard timeout via `AbortSignal.timeout(8000)` prevents hanging worker connections.

---

## 8. Bonus Integration: Tooltips & Tours

Through investigation of the PagePilot platform bundle and official documentation (`fab-builder/pagepilot-vanilla-react-app`):
- PagePilot provides an official onboarding SDK: **`ahdjs`** (`^0.0.227`).
- Inspection of the assessment tenant quota revealed:
  - `pp_tooltip: limit 5, usage 1` (Active Tooltip configured in workspace).
  - `pp_tour: limit 5, usage 0` (Tour module available).
- **Implementation in POC (`BonusTourTooltip.jsx`):**
  - Includes a floating interactive tour trigger in the application shell.
  - Automatically initializes the `AHDjs` instance using the workspace ID:
    ```javascript
    import AHDjs from 'ahdjs';
    const ahd = new AHDjs(undefined, {
      applicationId: workspaceId,
      apiHost: 'https://pagepilot.fabbuilder.com',
      visitorId: `visitor_${Date.now()}`,
      showProgressbar: true,
    });
    ahd.initializeSiteMap(true);
    ahd.showHighlights('home', true);
    ```
  - Provides a 4-step interactive guided highlight tour walking the evaluator through the architecture.

---

## 9. Setup, Configuration & Running Locally

### Prerequisites
- Node.js `v18+` or `v20+` (tested on `v20.20.2`)
- npm `v9+` or `v10+` (tested on `10.8.2`)

### 1. Installation
Run from the root directory:
```bash
npm run install:all
```
*This installs dependencies for root, `server/`, and `client/`.*

### 2. Environment Configuration
Copy `.env.example` in both `server/` and `client/`:

**`server/.env`:**
```env
PORT=5001
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

PAGEPILOT_BASE_URL=https://pagepilot.fabbuilder.com/api
PAGEPILOT_WORKSPACE_ID=6ac26e06fb3d2c14cbf71f89
PAGEPILOT_API_KEY=
PAGE_CACHE_TTL_SECONDS=60
```

**`client/.env`:**
```env
VITE_API_BASE_URL=/api
VITE_PAGEPILOT_WORKSPACE_ID=6ac26e06fb3d2c14cbf71f89
```

### 3. Running Concurrently (Recommended)
```bash
npm run dev
```
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5001](http://localhost:5001)

### 4. Running Tests & Production Build
```bash
# Run automated backend & integration tests
npm test

# Run frontend production build check
npm run build
```

---

## 10. Automated & Manual Test Results

### Automated Test Suite (`server/tests/api.test.js`)
Executed via Node test runner (`node --test tests/*.test.js`):

```
▶ Backend API & Security Suite
  ▶ GET /api/health
    ✔ should return 200 with service status and masked configuration (12.99ms)
  ✔ GET /api/health (13.25ms)
  ▶ Slug Validation & Security (Path Traversal & Injection)
    ✔ should reject path traversal attempts (..) with 400 (3.98ms)
    ✔ should reject backslashes and relative path patterns with 400 (3.34ms)
    ✔ should reject invalid characters with 400 (1.38ms)
  ✔ Slug Validation & Security (Path Traversal & Injection) (8.85ms)
  ▶ Non-Existent Routes & 404 Behavior
    ✔ should return 404 for arbitrary non-existent API routes (1.76ms)
  ✔ Non-Existent Routes & 404 Behavior (1.89ms)
  ▶ Page Resolution Mocked Scenarios
    ✔ should return 200 with normalized page data for valid slug (2.25ms)
    ✔ should return 404 with standard schema when page is not found upstream (1.90ms)
    ✔ should return 504 on upstream timeout (1.55ms)
    ✔ should return 503 if workspace ID is not configured (1.91ms)
  ✔ Page Resolution Mocked Scenarios (7.98ms)
  ▶ Live Integration Check (against real PagePilot Workspace)
    ✔ should fetch real "about-us" page from configured workspace (2271.81ms)
    ✔ should fetch real "home" page from configured workspace (4755.59ms)
    ✔ should fetch nested slug "guide/getting-started" (2205.49ms)
    ✔ should fetch real pages list from /api/pages (1179.08ms)
  ✔ Live Integration Check (against real PagePilot Workspace) (10412.50ms)
✔ Backend API & Security Suite (10444.98ms)

ℹ tests 13
ℹ suites 6
ℹ pass 13
ℹ fail 0
```

### Manual Slug Verification Matrix
| Slug Path | Page Title | Upstream Status | Verification Method | Outcome |
| :--- | :--- | :--- | :--- | :--- |
| `/about-us` | About Us | `live` | Live PagePilot REST API | ✅ Renders full visual builder sections |
| `/home` | Modern Business Landing Page | `live` | Live PagePilot REST API | ✅ Renders hero, features, and layout |
| `/guide/getting-started` | Getting Started | `live` | Live PagePilot REST API | ✅ Resolves nested slug properly |
| `/guide/live-demo` | Live Demo | `live` | Live PagePilot REST API | ✅ Resolves nested slug properly |
| `/non-existent-page` | — | `404` | Express Error Handler | ✅ Clean 404 UI with suggested active slugs |
| `/../../etc/passwd` | — | `400` | Slug Security Middleware | ✅ Blocked with `PATH_TRAVERSAL_DETECTED` |

---

## 11. AI Tools & Prompt Engineering Disclosure

In accordance with the assignment guidelines:
- **AI Tool Used:** Antigravity (powered by Gemini 3.8 Flash).
- **Strategy & Methodology:**
  1. *Source-of-truth extraction:* PDF decompiled and parsed using custom FlateDecode stream CMap decoder to prevent missing any obscure assessment constraints.
  2. *Reverse Engineering Provider Bundles:* Extracted Vite chunk mappings from `pagepilot.fabbuilder.com` to isolate the exact REST API URL (`/tenant/:id/pagebyslug/:slug`) and the official client library (`ahdjs`).
  3. *Defense-in-depth:* Applied OWASP principles to sanitize CMS HTML via DOMPurify and encapsulate rendering within Web Components (Shadow DOM) to prevent stylesheet collisions.
  4. *Honest Separation:* Mocked unit tests separated cleanly from genuine upstream live integration tests.

---

## 12. Limitations & Blockers Encountered

1. **Antigravity Browser Automation Environment:**
   - Attempting to launch the automated Playwright browser within this local container environment encountered a `404 Not Found` response from the upstream Azureedge macOS ARM64 Playwright download mirrors (`playwright-1.57.0-mac-arm64.zip`).
   - *Resolution:* Bypassed the browser automation tool by performing direct programmatic network inspection and API reverse engineering of the PagePilot Vite bundles, discovering the exact tenant IDs and endpoints directly from the live provider.
2. **Draft Pages:**
   - Slug `poc-permission-test` has `status: 'draft'` in the PagePilot workspace and is rejected by the public content delivery endpoint unless an authorized bearer token is passed. The POC correctly handles this by returning a clean 404/unpublished state for unauthenticated visitors.

---

## 13. Submission Packaging

To regenerate the self-contained ZIP archive for submission (excluding `node_modules`, `dist`, `.env` files, and local logs):
```bash
npm run package
```
Generated file:
- **`PagePilot-MERN-Integration-POC.zip`** (Size: ~0.1 MB)
# PagePilot
