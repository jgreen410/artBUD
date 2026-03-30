interface PostCardActionHandlerInput {
  onOpenPost?: (() => void) | null;
  onToggleLike: () => void | Promise<void>;
}

export function buildPostCardActionHandlers({
  onOpenPost,
  onToggleLike,
}: PostCardActionHandlerInput) {
  return {
    onCardPress: () => {
      onOpenPost?.();
    },
    onLikePress: () => onToggleLike(),
  };
}
