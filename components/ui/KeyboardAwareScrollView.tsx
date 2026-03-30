import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  Text,
  TextInput,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { textStyles, theme } from '@/lib/theme';

export const IOS_KEYBOARD_ACCESSORY_ID = 'artbud-keyboard-accessory-done';

interface KeyboardAwareContextValue {
  inputAccessoryViewID?: string;
  onInputFocus: (input: TextInput | null) => void;
}

const KeyboardAwareContext = createContext<KeyboardAwareContextValue | null>(null);

export function useKeyboardAwareContext() {
  return useContext(KeyboardAwareContext);
}

interface KeyboardAwareScrollViewProps extends Omit<ScrollViewProps, 'contentContainerStyle'> {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  extraBottomPadding?: number;
  keyboardVerticalOffset?: number;
}

export function KeyboardAwareScrollView({
  children,
  contentContainerStyle,
  extraBottomPadding = 0,
  keyboardVerticalOffset,
  keyboardDismissMode = Platform.OS === 'ios' ? 'interactive' : 'on-drag',
  keyboardShouldPersistTaps = 'handled',
  onScroll,
  scrollEventThrottle = 16,
  ...scrollViewProps
}: KeyboardAwareScrollViewProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const focusedInputRef = useRef<TextInput | null>(null);
  const scrollOffsetRef = useRef(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const ensureInputVisible = useCallback(
    (input: TextInput | null) => {
      if (!input || !scrollRef.current) {
        return;
      }

      input.measureInWindow((_, inputTop, __, inputHeight) => {
        const visibleTop = insets.top + theme.spacing[1];
        const visibleBottom =
          Dimensions.get('window').height - Math.max(keyboardHeight, 0) - theme.spacing[2];
        const inputBottom = inputTop + inputHeight;

        if (inputBottom > visibleBottom) {
          const delta = inputBottom - visibleBottom + theme.spacing[2];
          scrollRef.current?.scrollTo({
            y: scrollOffsetRef.current + delta,
            animated: true,
          });
          return;
        }

        if (inputTop < visibleTop) {
          const delta = visibleTop - inputTop + theme.spacing[1];
          scrollRef.current?.scrollTo({
            y: Math.max(0, scrollOffsetRef.current - delta),
            animated: true,
          });
        }
      });
    },
    [insets.top, keyboardHeight],
  );

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);

      if (focusedInputRef.current) {
        setTimeout(() => ensureInputVisible(focusedInputRef.current), 40);
      }
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [ensureInputVisible]);

  const contextValue = useMemo<KeyboardAwareContextValue>(
    () => ({
      inputAccessoryViewID: Platform.OS === 'ios' ? IOS_KEYBOARD_ACCESSORY_ID : undefined,
      onInputFocus: (input) => {
        focusedInputRef.current = input;

        requestAnimationFrame(() => {
          setTimeout(() => ensureInputVisible(input), 40);
        });
      },
    }),
    [ensureInputVisible],
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
    onScroll?.(event);
  };

  return (
    <KeyboardAwareContext.Provider value={contextValue}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset ?? insets.top}
        style={styles.keyboardFrame}
      >
        <ScrollView
          contentContainerStyle={[
            styles.contentContainer,
            {
              paddingBottom: Math.max(extraBottomPadding, insets.bottom + theme.spacing[2]),
            },
            contentContainerStyle,
          ]}
          keyboardDismissMode={keyboardDismissMode}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          onScroll={handleScroll}
          ref={scrollRef}
          scrollEventThrottle={scrollEventThrottle}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </KeyboardAwareContext.Provider>
  );
}

export function KeyboardDismissAccessory() {
  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <InputAccessoryView nativeID={IOS_KEYBOARD_ACCESSORY_ID}>
      <Pressable onPress={Keyboard.dismiss} style={styles.accessoryBar}>
        <Text style={styles.accessoryLabel}>Done</Text>
      </Pressable>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  keyboardFrame: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  accessoryBar: {
    alignItems: 'flex-end',
    backgroundColor: theme.colors.background.surface,
    borderTopColor: theme.colors.border.subtle,
    borderTopWidth: 1,
    minHeight: 44,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 8,
  },
  accessoryLabel: {
    ...textStyles.bodyBold,
    color: theme.colors.action.primary,
  },
});
