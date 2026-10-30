const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchPage(slug, { isPreview = false, signal } = {}) {
  // Normalize slug: leading slash removed, empty maps to 'home'
  const cleanSlug = (slug || '').replace(/^\/+/, '');
  const path = cleanSlug 
    ? cleanSlug.split('/').map(encodeURIComponent).join('/') 
    : 'home';
  const url = `${API_BASE}/pages/${path}${isPreview ? '?mode=preview' : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    signal,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    const error = new Error(data?.error?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.code = data?.error?.code || 'UNKNOWN_ERROR';
    error.details = data?.error;
    throw error;
  }

  return data.data;
}

export async function fetchPagesList({ signal } = {}) {
  const url = `${API_BASE}/pages`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    const error = new Error(data?.error?.message || `Failed to fetch page index (${response.status})`);
    error.status = response.status;
    error.code = data?.error?.code || 'INDEX_FETCH_ERROR';
    throw error;
  }

  return data.data;
}

export async function checkHealth({ signal } = {}) {
  const url = `${API_BASE}/health`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new Error(data?.error?.message || 'Backend service unreachable');
  }

  return data.data;
}
