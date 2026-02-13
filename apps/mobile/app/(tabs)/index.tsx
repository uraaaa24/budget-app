import { Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <View className="mb-8">
        <Text className="text-3xl font-bold text-slate-900">Budget App</Text>
        <Text className="mt-2 text-slate-600">Start customizing your screens from this tab.</Text>
      </View>

      <View className="rounded-2xl border border-slate-200 bg-white p-4">
        <Text className="mb-1 text-base font-semibold text-slate-900">Next step</Text>
        <Text className="text-slate-600">Add cards and lists in app/(tabs)/index.tsx.</Text>
      </View>
    </ScreenContainer>
  );
}
