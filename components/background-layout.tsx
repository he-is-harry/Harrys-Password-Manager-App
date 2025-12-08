import { ImageBackground, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { GlobalStyles } from '@/constants/styles';

interface BackgroundLayoutProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function BackgroundLayout({ children, style }: BackgroundLayoutProps) {
  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={GlobalStyles.background}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}
