import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommentInput, CommentList, ImageGallery } from '@/components/post';
import { Avatar, Badge, Button, Card, Skeleton, Tag } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useFollow } from '@/hooks/useFollow';
import { useLike } from '@/hooks/useLike';
import { useAddComment, usePostComments, usePostDetail } from '@/hooks/usePosts';
import { textStyles, theme } from '@/lib/theme';
import { formatWarmError } from '@/utils/errors';
import { formatCount, formatRelativeDate } from '@/utils/formatters';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [commentDraft, setCommentDraft] = useState('');

  const postQuery = usePostDetail(id);
  const commentsQuery = usePostComments(id);
  const addCommentMutation = useAddComment(id);
  const like = useLike(id);
  const follow = useFollow(postQuery.data?.author_id);

  const post = postQuery.data;
  const isRefreshing = (postQuery.isRefetching && !postQuery.isLoading) || commentsQuery.isRefetching;
  const actionError =
    formatWarmError(like.error, '') ||
    formatWarmError(follow.error, '') ||
    formatWarmError(addCommentMutation.error, '');
  const commentsError = commentsQuery.isError
    ? formatWarmError(
        commentsQuery.error,
        'Comments could not load just yet. Pull to refresh and try again.',
      )
    : null;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)');
  };

  const handleRefresh = () => {
    void postQuery.refetch();
    void commentsQuery.refetch();
  };

  const handleCommentSubmit = async () => {
    try {
      await addCommentMutation.mutateAsync(commentDraft);
      setCommentDraft('');
      Keyboard.dismiss();
    } catch {
      return;
    }
  };

  if (!id) {
    return (
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <View style={styles.centeredState}>
          <Card style={styles.feedbackCard} variant="muted">
            <Text style={textStyles.sectionTitle}>This post link is incomplete</Text>
            <Text style={styles.feedbackCopy}>
              The detail route needs a post id before it can load artwork, likes, or comments.
            </Text>
            <Button onPress={handleBack} variant="surface">
              Back to feed
            </Button>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  if (postQuery.isLoading && !post) {
    return (
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.loadingScrollContent} showsVerticalScrollIndicator={false}>
          <Skeleton height={420} radius={theme.radius.lg} />

          <View style={styles.content}>
            <View style={styles.metaRow}>
              <Skeleton height={28} radius={theme.radius.pill} width="38%" />
              <Skeleton height={14} width="22%" />
            </View>

            <View style={styles.authorRow}>
              <View style={styles.authorPressable}>
                <Skeleton height={56} radius={28} width={56} />
                <View style={styles.authorCopy}>
                  <Skeleton height={18} width="54%" />
                  <Skeleton height={12} width="38%" />
                </View>
              </View>
              <Skeleton height={40} radius={theme.radius.pill} width={112} />
            </View>

            <View style={styles.titleBlock}>
              <Skeleton height={32} width="76%" />
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="72%" />
            </View>

            <View style={styles.tagWrap}>
              <Skeleton height={32} radius={theme.radius.pill} width="26%" />
              <Skeleton height={32} radius={theme.radius.pill} width="22%" />
              <Skeleton height={32} radius={theme.radius.pill} width="30%" />
            </View>

            <Card style={styles.actionCard} variant="muted">
              <View style={styles.actionRow}>
                <Skeleton height={48} radius={theme.radius.pill} width={168} />
                <Skeleton height={48} radius={theme.radius.pill} width={144} />
              </View>
            </Card>

            <View style={styles.commentsSection}>
              <View style={styles.commentsHeader}>
                <Skeleton height={22} width="32%" />
                <Skeleton height={18} width="14%" />
              </View>
              <CommentList comments={[]} isLoading />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (postQuery.isError || !post) {
    const errorMessage = formatWarmError(
      postQuery.error,
      'The post could not load just yet. Pull to refresh and try again.',
    );

    return (
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <View style={styles.centeredState}>
          <Card style={styles.feedbackCard} variant="muted">
            <Text style={textStyles.sectionTitle}>This artwork isn&apos;t available yet</Text>
            <Text style={styles.feedbackCopy}>{errorMessage}</Text>
            <View style={styles.feedbackActions}>
              <Button onPress={handleBack} variant="surface">
                Back to feed
              </Button>
              <Button onPress={() => void postQuery.refetch()}>Try again</Button>
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  const authorName = post.author?.display_name ?? post.author?.username ?? 'Unknown artist';
  const authorHandle = post.author?.username ? `@${post.author.username}` : 'Artist profile';
  const isOwnPost = Boolean(user?.id && user.id === post.author_id);

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
        style={styles.keyboardFrame}
      >
        <View
          style={[
            styles.backButtonWrap,
            {
              top: insets.top + theme.spacing[1],
            },
          ]}
        >
          <Button
            iconLeft={<Feather color={theme.colors.text.primary} name="chevron-left" size={18} />}
            onPress={handleBack}
            size="sm"
            style={styles.backButton}
            variant="surface"
          >
            Back
          </Button>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              onRefresh={handleRefresh}
              progressBackgroundColor={theme.colors.background.surface}
              refreshing={isRefreshing}
              tintColor={theme.colors.action.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <ImageGallery images={post.images} title={post.title} />

          <View style={styles.content}>
            <View style={styles.metaRow}>
              <Badge
                label={post.community ? `${post.community.icon_emoji} ${post.community.name}` : 'Community'}
                variant="launched"
              />
              <Text style={textStyles.meta}>{formatRelativeDate(post.created_at)}</Text>
            </View>

            <View style={styles.authorRow}>
              <Pressable
                android_ripple={{ color: 'transparent' }}
                disabled={!post.author?.id}
                onPress={() => {
                  if (!post.author?.id) {
                    return;
                  }

                  router.push(`/artist/${post.author.id}`);
                }}
                style={({ pressed }) => [styles.authorPressable, pressed && styles.authorPressed]}
              >
                <Avatar name={authorName} size={56} uri={post.author?.avatar_url} />
                <View style={styles.authorCopy}>
                  <View style={styles.authorIdentity}>
                    <Text numberOfLines={1} style={styles.authorName}>
                      {authorName}
                    </Text>
                    {post.author?.is_professional ? <Badge label="Pro" variant="professional" /> : null}
                  </View>
                  <Text style={styles.authorHandle}>{authorHandle}</Text>
                </View>
              </Pressable>

              {isOwnPost ? (
                <Badge label="Your Post" variant="neutral" />
              ) : follow.canFollow ? (
                <Button
                  loading={follow.isPending}
                  onPress={() => void follow.toggleFollow()}
                  size="sm"
                  variant={follow.isFollowing ? 'surface' : 'primary'}
                >
                  {follow.isFollowing ? 'Following' : 'Follow'}
                </Button>
              ) : null}
            </View>

            <View style={styles.titleBlock}>
              <Text style={styles.title}>{post.title}</Text>
              {post.description ? <Text style={styles.description}>{post.description}</Text> : null}
            </View>

            <View style={styles.tagWrap}>
              {post.medium_tags.map((tag) => (
                <Tag key={`medium-${post.id}-${tag}`} label={tag} variant="accent" />
              ))}
              {post.subject_tags.map((tag) => (
                <Tag key={`subject-${post.id}-${tag}`} label={tag} variant="muted" />
              ))}
            </View>

            <Card style={styles.actionCard} variant="muted">
              <View style={styles.actionRow}>
                <Button
                  iconLeft={
                    <Ionicons
                      color={like.isLiked ? theme.colors.text.inverse : theme.colors.action.secondary}
                      name={like.isLiked ? 'heart' : 'heart-outline'}
                      size={18}
                    />
                  }
                  loading={like.isPending}
                  onPress={() => void like.toggleLike()}
                  style={styles.likeButton}
                  variant={like.isLiked ? 'secondary' : 'surface'}
                >
                  {formatCount(post.likes_count)} {post.likes_count === 1 ? 'Like' : 'Likes'}
                </Button>
                <View style={styles.statPill}>
                  <Feather color={theme.colors.accent.sage} name="message-circle" size={16} />
                  <Text style={styles.statCopy}>
                    {formatCount(post.comments_count)} {post.comments_count === 1 ? 'Comment' : 'Comments'}
                  </Text>
                </View>
              </View>
            </Card>

            {actionError ? (
              <Card style={styles.feedbackCard} variant="muted">
                <Text style={textStyles.sectionTitle}>That action needs another try</Text>
                <Text style={styles.feedbackCopy}>{actionError}</Text>
              </Card>
            ) : null}

            <View style={styles.commentsSection}>
              <View style={styles.commentsHeader}>
                <Text style={textStyles.sectionTitle}>Comments</Text>
                <Text style={styles.commentsMeta}>{formatCount(post.comments_count)}</Text>
              </View>
              <CommentList
                comments={commentsQuery.data ?? []}
                errorMessage={commentsError}
                isLoading={commentsQuery.isLoading}
              />
            </View>
          </View>
        </ScrollView>

        <CommentInput
          bottomInset={insets.bottom}
          errorMessage={addCommentMutation.isError ? formatWarmError(addCommentMutation.error, '') : null}
          isSubmitting={addCommentMutation.isPending}
          onChangeText={setCommentDraft}
          onSubmit={() => void handleCommentSubmit()}
          value={commentDraft}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background.base,
    flex: 1,
  },
  keyboardFrame: {
    flex: 1,
  },
  centeredState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[2],
  },
  loadingCopy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  loadingScrollContent: {
    paddingBottom: theme.spacing[3],
  },
  feedbackCard: {
    gap: theme.spacing[1],
    width: '100%',
  },
  feedbackCopy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  feedbackActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  backButtonWrap: {
    left: theme.spacing[2],
    position: 'absolute',
    zIndex: 5,
  },
  backButton: {
    backgroundColor: 'rgba(245, 237, 224, 0.92)',
  },
  scrollContent: {
    paddingBottom: theme.spacing[3],
  },
  content: {
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[2],
    paddingTop: theme.spacing[3],
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  authorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  authorPressable: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  authorPressed: {
    opacity: 0.86,
  },
  authorCopy: {
    flex: 1,
    gap: 3,
  },
  authorIdentity: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  authorName: {
    ...textStyles.bodyBold,
    flexShrink: 1,
  },
  authorHandle: {
    ...textStyles.caption,
    color: theme.colors.text.secondary,
  },
  titleBlock: {
    gap: 10,
  },
  title: {
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.display,
    fontSize: 30,
    lineHeight: 34,
  },
  description: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    gap: theme.spacing[1],
  },
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  likeButton: {
    minWidth: 150,
  },
  statPill: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statCopy: {
    ...textStyles.bodyMedium,
    color: theme.colors.text.primary,
  },
  commentsSection: {
    gap: theme.spacing[2],
  },
  commentsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentsMeta: {
    ...textStyles.editorial,
    color: theme.colors.text.secondary,
  },
});
