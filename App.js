import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StackNavigation from './StackNavigation';
import { LoginScreen, LikedSongsScreen, SongInfoScreen } from './screens';
import { PlayerContext } from './PlayerContext';
import { ModalPortal } from 'react-native-modals';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PlayerContext>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={StackNavigation} />
          <Stack.Screen name="Liked" component={LikedSongsScreen} />
          <Stack.Screen name="Info" component={SongInfoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <ModalPortal/>
    </PlayerContext>
  );
}
