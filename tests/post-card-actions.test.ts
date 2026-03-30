import { describe, expect, it, vi } from 'vitest';

import { buildPostCardActionHandlers } from '../components/feed/postCardActions';

describe('buildPostCardActionHandlers', () => {
  it('calls only the open callback when the card body is pressed', () => {
    const onOpenPost = vi.fn();
    const onToggleLike = vi.fn();
    const actions = buildPostCardActionHandlers({
      onOpenPost,
      onToggleLike,
    });

    actions.onCardPress();

    expect(onOpenPost).toHaveBeenCalledTimes(1);
    expect(onToggleLike).not.toHaveBeenCalled();
  });

  it('calls only the like callback when the heart is pressed', async () => {
    const onOpenPost = vi.fn();
    const onToggleLike = vi.fn(async () => undefined);
    const actions = buildPostCardActionHandlers({
      onOpenPost,
      onToggleLike,
    });

    await actions.onLikePress();

    expect(onToggleLike).toHaveBeenCalledTimes(1);
    expect(onOpenPost).not.toHaveBeenCalled();
  });
});
