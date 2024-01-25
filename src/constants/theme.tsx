import {Dimensions} from 'react-native';

export const COLORS = {
  background: '#0e0e10',
  cards: '#202123',
  grayDark: '#38393b',
  blue: '#0258f9',
  blueDark: '#2b4292',
  purple: '#462963',
  white: '#FFFFFF',
  black: '#000000',
  lightWhite: '#e1e1e1',
};

export const SCREEN_HEIGHT = Dimensions.get('screen').height;
export const SCREEN_WIDTH = Dimensions.get('screen').width;

export const FONT = {
  notoSansBlack: 'NotoSans-Black',
  notoSansBold: 'NotoSans-Bold',
  notoSansExtraBold: 'NotoSans-ExtraBold',
  notoSansExtraLight: 'NotoSans-ExtraLight',
  notoSansLight: 'NotoSans-Light',
  notoSansMedium: 'NotoSans-Medium',
  notoSansRegular: 'NotoSans-Regular',
  notoSansSemiBold: 'NotoSans-SemiBold',
  notoSansThin: 'NotoSans-Thin',
};
const appTheme = {COLORS, FONT, SCREEN_HEIGHT, SCREEN_WIDTH};

export default appTheme;
