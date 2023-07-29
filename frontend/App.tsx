import 'react-native-gesture-handler';
import AuthRouter from './src/routers/AuthRouter';
import { StatusBar } from 'react-native';
import { colors } from './src/configs/Theme';
import { useFonts, ComicNeue_400Regular, ComicNeue_700Bold } from '@expo-google-fonts/comic-neue';

export default function App() {

  let [fontsLoaded] = useFonts({
    ComicNeue_400Regular,
    ComicNeue_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <StatusBar backgroundColor={colors.mainColor}/>
      <AuthRouter />
    </>
  )
}
