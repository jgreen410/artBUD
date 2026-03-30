function getErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error.trim();
  }

  if (error instanceof Error) {
    return error.message.trim();
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message?: unknown }).message ?? '').trim();

    if (message.length > 0) {
      return message;
    }
  }

  return '';
}

export function formatWarmError(error: unknown, fallback: string) {
  const message = getErrorMessage(error);

  if (!message) {
    return fallback;
  }

  const normalized = message.toLowerCase();

  if (
    normalized.includes('network') ||
    normalized.includes('fetch') ||
    normalized.includes('timed out') ||
    normalized.includes('timeout') ||
    normalized.includes('offline')
  ) {
    return 'The connection drifted for a moment. Give it another try.';
  }

  if (
    normalized.includes('permission') ||
    normalized.includes('not authorized') ||
    normalized.includes('forbidden') ||
    normalized.includes('jwt') ||
    normalized.includes('rls') ||
    normalized.includes('policy')
  ) {
    return 'That action is blocked right now. Refresh your session and try again.';
  }

  if (
    normalized.includes('schema cache') ||
    normalized.includes('relation') ||
    normalized.includes('table') ||
    normalized.includes('column') ||
    normalized.includes('does not exist')
  ) {
    return 'The backend is still catching up to the latest studio setup. Refresh in a moment.';
  }

  if (normalized.includes('storage') || normalized.includes('object not found')) {
    return 'That image is not ready right now. Try the action again in a moment.';
  }

  if (
    normalized.includes('duplicate') ||
    normalized.includes('already exists') ||
    normalized.includes('duplicate key')
  ) {
    return 'That already exists, so nothing new needed to be added.';
  }

  return message;
}
