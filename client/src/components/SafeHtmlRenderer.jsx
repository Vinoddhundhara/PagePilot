import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

/**
 * SafeHtmlRenderer renders PagePilot HTML inside a Shadow DOM container
 * with DOMPurify sanitization.
 *
 * Benefits:
 * 1. Security: Sanitizes raw HTML to prevent XSS.
 * 2. Style Isolation: Shadow DOM prevents PagePilot global CSS from leaking
 *    into the host application (and vice versa).
 * 3. Exact Layout: Embedded fonts and styles from PagePilot render faithfully.
 */
export default function SafeHtmlRenderer({ html, className = '' }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Sanitize the HTML content safely
    const cleanHtml = DOMPurify.sanitize(html, {
      ADD_TAGS: ['style', 'link', 'svg', 'path'],
      ADD_ATTR: ['target', 'data-ahd-tpl-root', 'style', 'class'],
    });

    const wrapperHtml = `
      <style>
        :host {
          display: block;
          width: 100%;
          color: inherit;
          font-family: inherit;
        }
        * {
          box-sizing: border-box;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        a {
          color: #6366f1;
          text-decoration: underline;
        }
      </style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
      <div class="pagepilot-content-wrapper">
        ${cleanHtml}
      </div>
    `;

    // Attach or reuse existing shadow root
    let root = host.shadowRoot;
    if (!root) {
      root = host.attachShadow({ mode: 'open' });
    }
    root.innerHTML = wrapperHtml;
  }, [html]);

  return <div ref={hostRef} className={`pagepilot-rendered-host ${className}`} />;
}
