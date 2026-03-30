import { FlashList } from '@shopify/flash-list';
import { ReactElement } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Skeleton } from '@/components/ui';
import { FeedPost } from '@/lib/types';
import { textStyles, theme } from '@/lib/theme';
import { PostCard } from './PostCard';

interface MasonryGridProps {
  data: FeedPost[];
  header?: ReactElement | null;
  emptyTitle: string;
  emptyCopy: string;
  isLoading: boolean;
  isRefreshing: boolean;
  isFetchingNextPage: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  onPostPress: (post: FeedPost) => void;
  onScroll?: (offset: number) => void;
}

export function MasonryGrid({
  data,
  header,
  emptyTitle,
  emptyCopy,
  isLoading,
  isRefreshing,
  isFetchingNextPage,
  onRefresh,
  onEndReached,
  onPostPress,
  onScroll,
}: MasonryGridProps) {
  const loadingHeights = [192, 256, 168, 228, 206, 182] as const;

  return (
    <FlashList
      contentContainerStyle={styles.content}
      data={data}
      drawDistance={900}
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.loadingGrid}>
            {loadingHeights.map((height, index) => (
              <View key={`loading-card-${index}`} style={styles.loadingCell}>
                <View style={styles.loadingCard}>
                  <Skeleton height={height} radius={0} />
                  <View style={styles.loadingBody}>
                    <Skeleton height={18} width="72%" />
                    <View style={styles.loadingMetaRow}>
                      <Skeleton height={12} width="28%" />
                      <Skeleton height={12} width="24%" />
                    </View>
                    <View style={styles.loadingTags}>
                      <Skeleton height={28} radius={theme.radius.pill} width="34%" />
                      <Skeleton height={28} radius={theme.radius.pill} width="40%" />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={textStyles.sectionTitle}>{emptyTitle}</Text>
            <Text style={styles.emptyCopy}>{emptyCopy}</Text>
            <Button onPress={onRefresh} variant="surface">
              Refresh feed
            </Button>
          </Card>
        )
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator color={theme.colors.action.primary} />
          </View>
        ) : (
          <View style={styles.footerSpacer} />
        )
      }
      ListHeaderComponent={header}
      masonry
      numColumns={2}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.25}
      onRefresh={onRefresh}
      onScroll={(event) => onScroll?.(event.nativeEvent.contentOffset.y)}
      optimizeItemArrangement
      refreshing={isRefreshing}
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <PostCard onPress={() => onPostPress(item)} post={item} />
        </View>
      )}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  cell: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    paddingTop: 4,
  },
  loadingCell: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    width: '50%',
  },
  loadingCard: {
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  loadingBody: {
    gap: 10,
    padding: 12,
  },
  loadingMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loadingTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emptyCard: {
    gap: theme.spacing[2],
    marginTop: 24,
  },
  emptyCopy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerSpacer: {
    height: 12,
  },
});
