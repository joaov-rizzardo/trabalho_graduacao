import 'react-native-gesture-handler';
import AuthRouter from './src/routers/AuthRouter';
import { StatusBar } from 'react-native';
import { colors } from './src/configs/Theme';
import { useFonts, ComicNeue_400Regular, ComicNeue_700Bold } from '@expo-google-fonts/comic-neue';
import { AuthProvider } from './src/contexts/AuthContext';
import * as SplashScreen from 'expo-splash-screen'
import { PopupProvider } from './src/contexts/PopupContext';
import PopupElements from './src/components/PopupElements';

SplashScreen.preventAutoHideAsync()

export default function App() {
  let [fontsLoaded] = useFonts({
    ComicNeue_400Regular,
    ComicNeue_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <AuthProvider>
      <StatusBar backgroundColor={colors.mainColor}/>
      <PopupProvider>
        <PopupElements />
        <AuthRouter />
      </PopupProvider>
    </AuthProvider>
  )
}
