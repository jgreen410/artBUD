import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Badge, Button, Card, Input, KeyboardAwareScrollView, Tag } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Community } from '@/lib/types';
import { textStyles, theme } from '@/lib/theme';

export default function OnboardingScreen() {
  const { completeOnboarding, isConfigured, profile, signOut, user } = useAuth();
  const [username, setUsername] = useState(profile?.username ?? '');
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunityIds, setSelectedCommunityIds] = useState<string[]>([]);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const displayNameRef = useRef<TextInput | null>(null);
  const avatarUrlRef = useRef<TextInput | null>(null);
  const bioRef = useRef<TextInput | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCommunities = async () => {
      if (!isConfigured) {
        setIsLoadingCommunities(false);
        return;
      }

      setIsLoadingCommunities(true);

      const { data, error: communitiesError } = await supabase
        .from('communities')
        .select('*')
        .eq('is_launched', true)
        .order('name', { ascending: true });

      if (!isMounted) {
        return;
      }

      if (communitiesError) {
        setError(communitiesError.message);
        setIsLoadingCommunities(false);
        return;
      }

      setCommunities((data as Community[]) ?? []);
      setIsLoadingCommunities(false);
    };

    void loadCommunities();

    return () => {
      isMounted = false;
    };
  }, [isConfigured]);

  const toggleCommunity = (communityId: string) => {
    setSelectedCommunityIds((current) =>
      current.includes(communityId)
        ? current.filter((id) => id !== communityId)
        : [...current, communityId],
    );
  };

  const handleContinue = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await completeOnboarding({
        username,
        displayName,
        avatarUrl,
        bio,
        joinedCommunityIds: selectedCommunityIds,
      });
    } catch (onboardingError) {
      setError(
        onboardingError instanceof Error
          ? onboardingError.message
          : 'We could not save your profile just yet.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content} extraBottomPadding={theme.spacing[3]}>
        <View style={styles.header}>
          <Badge label="Onboarding" variant="neutral" />
          <Text style={textStyles.screenTitle}>Build your profile</Text>
          <Text style={styles.copy}>
            Choose how you appear to the community, then join at least one launch community before
            you land in the app.
          </Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.identityRow}>
            <Avatar name={displayName || user?.email || 'Art Bud'} size={64} uri={avatarUrl || undefined} />
            <View style={styles.identityCopy}>
              <Text style={textStyles.sectionTitle}>{displayName || 'Your display name'}</Text>
              <Text style={styles.caption}>{user?.email ?? 'Signed in artist'}</Text>
            </View>
            <Button onPress={() => void signOut()} size="sm" variant="ghost">
              Sign out
            </Button>
          </View>

          {!isConfigured ? <Text style={styles.notice}>Add valid Supabase keys in `.env` before finishing onboarding.</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Input
            autoCapitalize="none"
            hint="Lowercase letters, numbers, and underscores only."
            label="Username"
            onChangeText={setUsername}
            onSubmitEditing={() => displayNameRef.current?.focus()}
            placeholder="marisolatelier"
            returnKeyType="next"
            value={username}
          />
          <Input
            label="Display name"
            onChangeText={setDisplayName}
            onSubmitEditing={() => avatarUrlRef.current?.focus()}
            placeholder="Marisol Vale"
            ref={displayNameRef}
            returnKeyType="next"
            value={displayName}
          />
          <Input
            autoCapitalize="none"
            hint="Optional for now. You can upload a proper avatar later."
            label="Avatar URL"
            onChangeText={setAvatarUrl}
            onSubmitEditing={() => bioRef.current?.focus()}
            placeholder="https://..."
            ref={avatarUrlRef}
            returnKeyType="next"
            value={avatarUrl}
          />
          <Input
            hint="Keep it warm and concise. 280 characters max."
            label="Bio"
            multiline
            onChangeText={setBio}
            placeholder="Tell Art Bud what kind of work you make."
            ref={bioRef}
            value={bio}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.section}>Choose your communities</Text>
          <Text style={styles.copy}>
            Join at least one launch community. You can change this later from the communities hub.
          </Text>
          {isLoadingCommunities ? (
            <Text style={styles.caption}>Loading launch communities...</Text>
          ) : (
            <View style={styles.tagWrap}>
              {communities.map((community) => (
                <Tag
                  key={community.id}
                  label={`${community.icon_emoji} ${community.name}`}
                  onPress={() => toggleCommunity(community.id)}
                  variant={selectedCommunityIds.includes(community.id) ? 'selected' : 'default'}
                />
              ))}
            </View>
          )}

          <Button
            disabled={!isConfigured || !username.trim() || !displayName.trim() || selectedCommunityIds.length < 1}
            loading={isSaving}
            onPress={() => void handleContinue()}
          >
            Finish onboarding
          </Button>
        </Card>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background.base,
    flex: 1,
  },
  content: {
    gap: theme.spacing[2],
    padding: theme.spacing[3],
  },
  header: {
    gap: theme.spacing[1],
  },
  copy: {
    ...textStyles.body,
    color: theme.colors.text.secondary,
  },
  card: {
    gap: theme.spacing[2],
  },
  identityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  identityCopy: {
    flex: 1,
    gap: 2,
  },
  section: {
    ...textStyles.sectionTitle,
  },
  caption: {
    ...textStyles.caption,
  },
  notice: {
    ...textStyles.caption,
  },
  error: {
    ...textStyles.caption,
    color: theme.colors.state.danger,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
