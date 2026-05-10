export function getDisplayName(userLike: any): string {
  if (!userLike) return '';

  const name =
    (typeof userLike.name === 'string' && userLike.name.trim()) ||
    (typeof userLike.username === 'string' && userLike.username.trim()) ||
    (typeof userLike.full_name === 'string' && userLike.full_name.trim()) ||
    (typeof userLike.fullName === 'string' && userLike.fullName.trim()) ||
    '';

  if (name) return name;

  const first = typeof userLike.first_name === 'string' ? userLike.first_name.trim() : '';
  const last = typeof userLike.last_name === 'string' ? userLike.last_name.trim() : '';
  const composed = `${first} ${last}`.trim();
  if (composed) return composed;

  if (typeof userLike.email === 'string' && userLike.email.trim()) return userLike.email.trim();
  if (typeof userLike.phone === 'string' && userLike.phone.trim()) return userLike.phone.trim();

  return '';
}

