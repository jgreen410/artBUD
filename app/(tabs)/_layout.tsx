import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { theme } from '@/lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.action.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background.surface,
          borderTopColor: theme.colors.border.subtle,
          height: 76,
          paddingBottom: 14,
          paddingTop: 12,
        },
        sceneStyle: {
          backgroundColor: theme.colors.background.base,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="home-variant-outline" size={size + 1} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-feed"
        options={{
          title: 'My Feed',
          tabBarAccessibilityLabel: 'My Feed',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="account-group-outline" size={size + 1} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Post',
          tabBarAccessibilityLabel: 'Create Post',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              color={focused ? theme.colors.text.inverse : theme.colors.text.primary}
              name="brush"
              size={28}
            />
          ),
          tabBarIconStyle: {
            backgroundColor: theme.colors.action.primary,
            borderRadius: theme.radius.round,
            height: 40,
            justifyContent: 'center',
            marginTop: -6,
            width: 40,
          },
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: 'Communities',
          tabBarAccessibilityLabel: 'Communities',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="palette-outline" size={size + 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="account-circle-outline" size={size + 2} />
          ),
        }}
      />
    </Tabs>
  );
}
