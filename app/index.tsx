import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-12 pb-4 px-6 bg-background border-b border-border">
        <Text className="text-2xl font-bold text-foreground">
          IdeaPile
        </Text>
        <Text className="text-sm text-muted-foreground mt-1">
          Suas ideias brilhantes
        </Text>
      </View>

      {/* Content Area */}
      <View className="flex-1 px-6 py-4">
        <Text className="text-center text-muted-foreground mt-20">
          Nenhuma ideia ainda.{'\n'}
          Toque no + para começar!
        </Text>
      </View>

      {/* Floating Action Button placeholder */}
      <View className="absolute bottom-6 right-6">
        <View className="w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg">
          <Text className="text-primary-foreground text-2xl font-light">+</Text>
        </View>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}
