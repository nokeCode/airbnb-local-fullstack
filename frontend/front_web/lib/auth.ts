export function getCurrentUserIdFromToken(): number | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('access') || localStorage.getItem('token');
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const payloadBase64Url = parts[1];
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (payloadBase64.length % 4)) % 4;
    const padded = payloadBase64 + '='.repeat(padLen);
    const json = atob(padded);
    const payload = JSON.parse(json) as Record<string, unknown>;

    const raw =
      payload.user_id ??
      payload.userId ??
      payload.id ??
      payload.sub;

    const id = typeof raw === 'string' ? Number(raw) : typeof raw === 'number' ? raw : NaN;
    return Number.isFinite(id) ? id : null;
  } catch {
    return null;
  }
}

