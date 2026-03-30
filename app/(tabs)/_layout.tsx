import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { theme } from '@/lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.action.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.surface,
          borderTopColor: theme.colors.border.subtle,
          height: 72,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.bodyMedium,
          fontSize: 12,
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
          tabBarIcon: ({ color, size }) => <Feather color={color} name="home" size={size} />,
        }}
      />
      <Tabs.Screen
        name="my-feed"
        options={{
          title: 'My Feed',
          tabBarIcon: ({ color, size }) => <Feather color={color} name="users" size={size} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Post',
          tabBarIcon: ({ focused }) => (
            <Feather
              color={focused ? theme.colors.text.inverse : theme.colors.text.primary}
              name="plus-circle"
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
          tabBarIcon: ({ color, size }) => <Feather color={color} name="grid" size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Feather color={color} name="user" size={size} />,
        }}
      />
    </Tabs>
  );
}
