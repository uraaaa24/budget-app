import { Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

const TabTwoScreen = () => {
  return (
    <ScreenContainer>
      <Text className="mb-2 text-3xl font-bold text-slate-900">Settings</Text>
      <Text className="mb-6 text-slate-600">Keep app preferences and management tools here.</Text>

      <View className="rounded-2xl border border-slate-200 bg-white p-4">
        <Text className="text-base font-semibold text-slate-900">Starter sections</Text>
        <Text className="mt-2 text-slate-600">- Profile</Text>
        <Text className="text-slate-600">- Notifications</Text>
        <Text className="text-slate-600">- Category management</Text>
      </View>
    </ScreenContainer>
  );
};

export default TabTwoScreen;
