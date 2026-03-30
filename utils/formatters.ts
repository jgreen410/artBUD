const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatCount(value: number) {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return compactFormatter.format(value);
}

export function formatRelativeDate(value: string) {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return 'Recently';
  }

  const diffInHours = Math.round((timestamp - Date.now()) / (1000 * 60 * 60));
  const absHours = Math.abs(diffInHours);

  if (absHours < 1) {
    return 'Just now';
  }

  if (absHours < 24) {
    return `${absHours}h ago`;
  }

  const diffInDays = Math.round(absHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
}
