import { StyleSheet, Text, View } from 'react-native';

import { Avatar, Badge, Card, Skeleton } from '@/components/ui';
import { CommentWithAuthor } from '@/lib/types';
import { textStyles, theme } from '@/lib/theme';
import { formatRelativeDate } from '@/utils/formatters';

interface CommentListProps {
  comments: CommentWithAuthor[];
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function CommentList({ comments, isLoading = false, errorMessage = null }: CommentListProps) {
  if (isLoading) {
    return (
      <View style={styles.list}>
        {[0, 1, 2].map((index) => (
          <View key={`comment-loading-${index}`} style={styles.loadingRow}>
            <Skeleton height={42} radius={21} width={42} />
            <View style={styles.loadingBody}>
              <View style={styles.loadingHeader}>
                <Skeleton height={14} width="42%" />
                <Skeleton height={12} width="24%" />
              </View>
              <Skeleton height={12} width="30%" />
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width={index === 1 ? '68%' : '84%'} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (errorMessage) {
    return (
      <Card style={styles.feedbackCard} variant="muted">
        <Text style={textStyles.sectionTitle}>Comments need another pass</Text>
        <Text style={styles.feedbackCopy}>{errorMessage}</Text>
      </Card>
    );
  }

  if (comments.length === 0) {
    return (
      <Card style={styles.feedbackCard} variant="muted">
        <Text style={textStyles.sectionTitle}>No comments yet</Text>
        <Text style={styles.feedbackCopy}>
          Start the thread with a warm note, a specific observation, or a thoughtful question.
        </Text>
      </Card>
    );
  }

  return (
    <View style={styles.list}>
      {comments.map((comment) => (
        <View key={comment.id} style={styles.commentRow}>
          <Avatar
            name={comment.author?.display_name ?? comment.author?.username ?? 'Artist'}
            size={42}
            uri={comment.author?.avatar_url}
          />
          <View style={styles.commentBody}>
            <View style={styles.commentHeader}>
              <View style={styles.identityWrap}>
                <Text numberOfLines={1} style={styles.authorName}>
                  {comment.author?.display_name ?? 'Artist'}
                </Text>
                {comment.author?.is_professional ? <Badge label="Pro" variant="professional" /> : null}
              </View>
              <Text style={styles.dateCopy}>{formatRelativeDate(comment.created_at)}</Text>
            </View>
            <Text style={styles.handleCopy}>@{comment.author?.username ?? 'artist'}</Text>
            <Text style={styles.commentCopy}>{comment.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackCard: {
    gap: theme.spacing[1],
  },
  feedbackCopy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  list: {
    gap: theme.spacing[2],
  },
  commentRow: {
    alignItems: 'flex-start',
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: theme.spacing[2],
  },
  loadingRow: {
    alignItems: 'flex-start',
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: theme.spacing[2],
  },
  loadingBody: {
    flex: 1,
    gap: 8,
  },
  loadingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentBody: {
    flex: 1,
    gap: 4,
  },
  commentHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  identityWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
    gap: 8,
  },
  authorName: {
    ...textStyles.bodyBold,
    flexShrink: 1,
  },
  handleCopy: {
    ...textStyles.caption,
    color: theme.colors.text.tertiary,
  },
  dateCopy: {
    ...textStyles.caption,
    flexShrink: 0,
  },
  commentCopy: {
    ...textStyles.body,
    color: theme.colors.text.primary,
  },
});
