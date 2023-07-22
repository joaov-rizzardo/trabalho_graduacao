import 'react-native-gesture-handler';
import AuthRouter from './src/routers/AuthRouter';
import { StatusBar } from 'react-native';
import { colors } from './src/configs/theme';

export default function App() {
  return (
    <>
      <StatusBar backgroundColor={colors.mainColor}/>
      <AuthRouter />
    </>
  )
}
