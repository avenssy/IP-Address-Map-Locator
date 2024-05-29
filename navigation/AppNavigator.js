import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen.js';
import SignupScreen from '../screens/SignupScreen.js';
import HomeScreen from '../screens/HomeScreen.js';

const AppNavigator = createSwitchNavigator(
  {
    Login: LoginScreen,
    Signup: SignupScreen,
    Home: HomeScreen
  },
  {
    initialRouteName: 'Login'
  }
);

export default createAppContainer(AppNavigator);
