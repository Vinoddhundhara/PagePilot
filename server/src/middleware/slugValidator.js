/**
 * Validates the requested page slug parameter.
 * Prevents path traversal, injection, or malformed URL requests.
 */
export function validateSlug(req, res, next) {
  // Slug may come from req.params[0] (wildcard) or req.params.slug or req.query.slug
  let slug = req.params[0] !== undefined ? req.params[0] : (req.params.slug || req.query.slug || '');

  // Decode URI component safely
  try {
    slug = decodeURIComponent(slug);
  } catch {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Malformed URL encoding in page slug.',
        code: 'INVALID_SLUG_ENCODING',
        status: 400,
      },
    });
  }

  // Remove leading and trailing slashes
  slug = slug.trim().replace(/^\/+|\/+$/g, '');

  // Allow empty slug (represents home page)
  if (slug === '') {
    req.normalizedSlug = 'home';
    return next();
  }

  // Security check 1: Reject directory traversal sequences
  if (slug.includes('..') || slug.includes('./') || slug.includes('/.') || slug.includes('\\')) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid slug: Path traversal patterns are strictly forbidden.',
        code: 'PATH_TRAVERSAL_DETECTED',
        status: 400,
      },
    });
  }

  // Security check 2: Reject null bytes or control characters
  if (/[\x00-\x1F\x7F]/.test(slug)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid slug: Control characters or null bytes detected.',
        code: 'MALFORMED_SLUG',
        status: 400,
      },
    });
  }

  // Security check 3: Allowed characters: alphanumeric, hyphen, underscore, and slash for nested slugs
  // E.g. 'guide/getting-started', 'about-us', 'pricing_2026'
  const validSlugPattern = /^[a-zA-Z0-9_\-\/]+$/;
  if (!validSlugPattern.test(slug)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid slug format: Only letters, numbers, hyphens, underscores, and forward slashes are allowed.',
        code: 'INVALID_SLUG_FORMAT',
        status: 400,
      },
    });
  }

  // Security check 4: Slug length limit (prevent denial of service with huge strings)
  if (slug.length > 250) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Slug exceeds maximum allowed length of 250 characters.',
        code: 'SLUG_TOO_LONG',
        status: 400,
      },
    });
  }

  req.normalizedSlug = slug;
  next();
}
