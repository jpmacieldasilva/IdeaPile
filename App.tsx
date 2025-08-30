import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import './global.css';

export default function App() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-foreground text-xl font-medium">
        IdeaPile
      </Text>
      <Text className="text-muted-foreground text-base mt-2">
        Capture e expanda suas ideias com IA
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}