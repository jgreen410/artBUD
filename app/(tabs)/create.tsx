import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge, Button, Card, Input, Tag } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useJoinedCommunities } from '@/hooks/useCommunities';
import { useCreatePost } from '@/hooks/usePosts';
import { theme, textStyles } from '@/lib/theme';
import { formatWarmError } from '@/utils/errors';
import {
  captureImage,
  getMaxImageCount,
  LocalImageAsset,
  pickImagesFromLibrary,
} from '@/utils/imageUpload';

const mediumOptions = [
  'Oil',
  'Acrylic',
  'Watercolor',
  'Gouache',
  'Pencil',
  'Charcoal',
  'Ink',
  'Pastel',
  'Digital',
  '3D',
  'Vector',
  'Marker',
  'Spray Paint',
  'Clay',
  'Bronze',
  'Wood',
  'Fiber',
  'Film',
  'Mixed',
] as const;

const subjectOptions = [
  'Portrait',
  'Landscape',
  'Abstract',
  'Still Life',
  'Figure',
  'Concept Art',
  'Fan Art',
  'Botanical',
  'Urban',
  'Wildlife',
  'Surreal',
  'Minimalist',
  'Expressionist',
  'Photorealism',
] as const;

const DEFAULT_BLURHASH = '|rF?hV%2WCj[ayj[jt7j[ayj[ayj[ayj[ayj[ayfQfQfQfQfQfQ';

function toggleValue(current: string[], value: string) {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

export default function CreatePostScreen() {
  const insets = useSafeAreaInsets();
  const { isConfigured } = useAuth();
  const joinedCommunitiesQuery = useJoinedCommunities();
  const createPostMutation = useCreatePost();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [communityPickerOpen, setCommunityPickerOpen] = useState(false);
  const [selectedMediumTags, setSelectedMediumTags] = useState<string[]>([]);
  const [selectedSubjectTags, setSelectedSubjectTags] = useState<string[]>([]);
  const [images, setImages] = useState<LocalImageAsset[]>([]);
  const [error, setError] = useState<string | null>(null);

  const joinedCommunities = joinedCommunitiesQuery.data ?? [];
  const selectedCommunity =
    joinedCommunities.find((community) => community.id === selectedCommunityId) ?? null;
  const canSubmit = Boolean(title.trim() && selectedCommunityId && images.length > 0 && isConfigured);
  const maxImageCount = getMaxImageCount();

  const imageSummary = useMemo(() => {
    if (images.length === 0) {
      return 'No images added yet';
    }

    return `${images.length}/${maxImageCount} artwork ${images.length === 1 ? 'image' : 'images'}`;
  }, [images.length, maxImageCount]);

  const handlePickFromLibrary = async () => {
    setError(null);

    try {
      const nextImages = await pickImagesFromLibrary(images);
      setImages(nextImages);
    } catch (pickerError) {
      setError(formatWarmError(pickerError, 'The gallery could not be opened just yet.'));
    }
  };

  const handleCaptureImage = async () => {
    setError(null);

    try {
      const nextImages = await captureImage(images);
      setImages(nextImages);
    } catch (cameraError) {
      setError(formatWarmError(cameraError, 'The camera could not be opened just yet.'));
    }
  };

  const handleRemoveImage = (uri: string) => {
    setImages((current) => current.filter((image) => image.uri !== uri));
  };

  const handlePublish = async () => {
    if (!selectedCommunityId) {
      setError('Choose one of your communities before publishing.');
      return;
    }

    setError(null);

    try {
      const postId = await createPostMutation.mutateAsync({
        title,
        description,
        communityId: selectedCommunityId,
        images,
        mediumTags: selectedMediumTags,
        subjectTags: selectedSubjectTags,
      });

      setTitle('');
      setDescription('');
      setSelectedCommunityId(null);
      setCommunityPickerOpen(false);
      setSelectedMediumTags([]);
      setSelectedSubjectTags([]);
      setImages([]);

      router.push(`/post/${postId}`);
    } catch (publishError) {
      setError(
        formatWarmError(
          publishError,
          'Your post did not publish yet. Try once more after a breath.',
        ),
      );
    }
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
        style={styles.keyboardFrame}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: Math.max(theme.spacing[4], insets.bottom + theme.spacing[2]),
            },
          ]}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Badge label="Create" variant="terracotta" />
            <Text style={textStyles.screenTitle}>Share New Work</Text>
            <Text style={styles.copy}>
              Build a strong first impression with clear artwork, a concise title, and the right
              community context.
            </Text>
          </View>

          {!isConfigured ? (
            <Card style={styles.card} variant="muted">
              <Text style={textStyles.sectionTitle}>Backend setup still needs attention</Text>
              <Text style={styles.copy}>
                Add valid Supabase environment values before publishing from the app.
              </Text>
            </Card>
          ) : null}

          {error ? (
            <Card style={styles.card} variant="muted">
              <Text style={textStyles.sectionTitle}>Publishing needs another pass</Text>
              <Text style={styles.copy}>{error}</Text>
            </Card>
          ) : null}

          <Card style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={textStyles.sectionTitle}>Artwork</Text>
              <Text style={styles.caption}>{imageSummary}</Text>
            </View>

            <View style={styles.imageActions}>
              <Button
                fullWidth
                iconLeft={<Feather color={theme.colors.text.inverse} name="image" size={16} />}
                onPress={() => void handlePickFromLibrary()}
                style={styles.actionButton}
              >
                Add From Gallery
              </Button>
              <Button
                fullWidth
                iconLeft={<Feather color={theme.colors.text.primary} name="camera" size={16} />}
                onPress={() => void handleCaptureImage()}
                style={styles.actionButton}
                variant="surface"
              >
                Use Camera
              </Button>
            </View>

            {images.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.previewRow}>
                  {images.map((image, index) => (
                    <View key={image.uri} style={styles.previewWrap}>
                      <Image
                        cachePolicy="memory-disk"
                        contentFit="cover"
                        placeholder={{ blurhash: DEFAULT_BLURHASH }}
                        source={image.uri}
                        style={styles.previewImage}
                        transition={150}
                      />
                      <View style={styles.previewBadge}>
                        <Text style={styles.previewBadgeCopy}>{index + 1}</Text>
                      </View>
                      <Pressable
                        android_ripple={{ color: 'transparent' }}
                        onPress={() => handleRemoveImage(image.uri)}
                        style={({ pressed }) => [styles.removeButton, pressed && styles.removeButtonPressed]}
                      >
                        <Feather color={theme.colors.text.inverse} name="x" size={14} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View style={styles.imageEmptyState}>
                <Feather color={theme.colors.text.tertiary} name="image" size={22} />
                <Text style={styles.caption}>
                  Add up to {maxImageCount} images. The first one becomes the feed preview.
                </Text>
              </View>
            )}
          </Card>

          <Card style={styles.card}>
            <Text style={textStyles.sectionTitle}>Post Details</Text>
            <Input
              label="Title"
              maxLength={120}
              onChangeText={setTitle}
              placeholder="Evening wash study in ultramarine"
              value={title}
            />
            <Input
              hint="Optional, but useful when you want to share process, context, or intent."
              label="Description"
              maxLength={600}
              multiline
              onChangeText={setDescription}
              placeholder="What were you exploring here?"
              value={description}
            />
          </Card>

          <Card style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={textStyles.sectionTitle}>Community</Text>
              <Text style={styles.caption}>Only communities you have joined appear here.</Text>
            </View>

            {joinedCommunitiesQuery.isLoading ? (
              <Text style={styles.caption}>Loading your communities...</Text>
            ) : joinedCommunities.length === 0 ? (
              <View style={styles.emptyCommunityState}>
                <Text style={styles.copy}>
                  Join at least one community before publishing. That keeps the post directed and
                  makes the feed filter useful from day one.
                </Text>
                <Button onPress={() => router.push('/(tabs)/communities')} variant="surface">
                  Browse Communities
                </Button>
              </View>
            ) : (
              <View style={styles.communityPickerWrap}>
                <Pressable
                  android_ripple={{ color: 'transparent' }}
                  onPress={() => setCommunityPickerOpen((current) => !current)}
                  style={({ pressed }) => [
                    styles.communityTrigger,
                    pressed && styles.communityTriggerPressed,
                  ]}
                >
                  <View style={styles.communityTriggerCopy}>
                    <Text style={textStyles.bodyMedium}>
                      {selectedCommunity
                        ? `${selectedCommunity.icon_emoji} ${selectedCommunity.name}`
                        : 'Choose a community'}
                    </Text>
                    <Text style={styles.caption}>
                      {selectedCommunity?.description ?? 'Select where this piece belongs.'}
                    </Text>
                  </View>
                  <Feather
                    color={theme.colors.text.secondary}
                    name={communityPickerOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                  />
                </Pressable>

                {communityPickerOpen ? (
                  <View style={styles.communityList}>
                    {joinedCommunities.map((community) => {
                      const selected = community.id === selectedCommunityId;

                      return (
                        <Pressable
                          key={community.id}
                          android_ripple={{ color: 'transparent' }}
                          onPress={() => {
                            setSelectedCommunityId(community.id);
                            setCommunityPickerOpen(false);
                          }}
                          style={({ pressed }) => [
                            styles.communityOption,
                            selected && styles.communityOptionSelected,
                            pressed && styles.communityOptionPressed,
                          ]}
                        >
                          <View style={styles.communityOptionCopy}>
                            <Text style={styles.communityOptionTitle}>
                              {community.icon_emoji} {community.name}
                            </Text>
                            <Text style={styles.caption}>{community.description}</Text>
                          </View>
                          {selected ? (
                            <Feather color={theme.colors.action.primary} name="check" size={18} />
                          ) : null}
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            )}
          </Card>

          <Card style={styles.card}>
            <Text style={textStyles.sectionTitle}>Medium Tags</Text>
            <Text style={styles.copy}>
              Choose the materials or toolchain that best describes the piece.
            </Text>
            <View style={styles.tagWrap}>
              {mediumOptions.map((option) => (
                <Tag
                  key={option}
                  label={option}
                  onPress={() => setSelectedMediumTags((current) => toggleValue(current, option))}
                  variant={selectedMediumTags.includes(option) ? 'selected' : 'default'}
                />
              ))}
            </View>
          </Card>

          <Card style={styles.card}>
            <Text style={textStyles.sectionTitle}>Subject Tags</Text>
            <Text style={styles.copy}>
              Add the visual subject or style cues that help the right viewers find it.
            </Text>
            <View style={styles.tagWrap}>
              {subjectOptions.map((option) => (
                <Tag
                  key={option}
                  label={option}
                  onPress={() => setSelectedSubjectTags((current) => toggleValue(current, option))}
                  variant={selectedSubjectTags.includes(option) ? 'selected' : 'default'}
                />
              ))}
            </View>
          </Card>

          <Button
            disabled={!canSubmit || joinedCommunities.length === 0}
            fullWidth
            loading={createPostMutation.isPending}
            onPress={() => void handlePublish()}
            size="lg"
          >
            Publish Post
          </Button>
        </ScrollView>
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
  content: {
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
    paddingTop: theme.spacing[2],
  },
  header: {
    gap: theme.spacing[1],
  },
  copy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  caption: {
    ...textStyles.caption,
    color: theme.colors.text.secondary,
  },
  card: {
    gap: theme.spacing[2],
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  imageActions: {
    gap: 12,
  },
  actionButton: {
    alignSelf: 'stretch',
  },
  previewRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: theme.spacing[1],
  },
  previewWrap: {
    height: 148,
    position: 'relative',
    width: 128,
  },
  previewImage: {
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    height: '100%',
    width: '100%',
  },
  previewBadge: {
    backgroundColor: theme.colors.overlay.strong,
    borderRadius: theme.radius.pill,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    top: 10,
  },
  previewBadgeCopy: {
    color: theme.colors.text.inverse,
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontSize: theme.typography.size.meta,
  },
  removeButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.action.secondary,
    borderRadius: theme.radius.round,
    height: 26,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 26,
  },
  removeButtonPressed: {
    opacity: 0.88,
  },
  imageEmptyState: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.base,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderStyle: 'dashed',
    borderWidth: 1,
    gap: 10,
    justifyContent: 'center',
    minHeight: 144,
    padding: theme.spacing[2],
  },
  emptyCommunityState: {
    gap: theme.spacing[2],
  },
  communityPickerWrap: {
    gap: 10,
  },
  communityTrigger: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.base,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    minHeight: 60,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  communityTriggerPressed: {
    opacity: 0.92,
  },
  communityTriggerCopy: {
    flex: 1,
    gap: 4,
  },
  communityList: {
    gap: 8,
  },
  communityOption: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.base,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  communityOptionSelected: {
    borderColor: theme.colors.action.primary,
    backgroundColor: theme.colors.background.surface,
  },
  communityOptionPressed: {
    opacity: 0.92,
  },
  communityOptionCopy: {
    flex: 1,
    gap: 4,
  },
  communityOptionTitle: {
    ...textStyles.bodyMedium,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
