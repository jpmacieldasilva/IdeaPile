import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="capture" />
      <Stack.Screen name="settings" />
      <Stack.Screen 
        name="idea/[id]" 
        options={{
          headerShown: true,
          headerTitle: 'Detalhes da Ideia',
          headerBackTitle: 'Voltar',
        }}
      />
    </Stack>
  );
}
