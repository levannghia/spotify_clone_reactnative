import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StackNavigation from './StackNavigation';
import { LoginScreen } from './screens';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={StackNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
