import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  return (
    <BlurView
      tint={colorScheme === 'dark' ? 'dark' : 'light'}
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function BlurTabBarBackground() {
  return (
    <BlurView
      tint="dark"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}