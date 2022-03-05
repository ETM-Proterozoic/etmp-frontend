import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color

  // backgrounds / greys
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color
  bg6: Color
  bg7: Color
  bgd1: Color

  bg8: Color
  bg9: Color
  bg10: Color
  bg11: Color
  bg12: Color
  bg13: Color
  text6: Color
  text7: Color
  text8: Color
  text9: Color
  gradual1: Color
  gradual2: Color
  gradual3: Color
  gradual4: Color
  gradual5: Color
  gradual6: Color
  gradual7: Color
  gradual8: Color
  gradual9: Color
  gradual10: Color
  gradual11: Color
  border1: Color
  border2: Color
  shaw1: Color
  disabled: Color
  disabled2: Color
  disabled3: Color
  disabled4: Color
  disabled5: Color
  mask1: Color
  mask2: Color
  shadow1: Color
  shadow2: Color
  shadow3: Color
  shadow4: Color
  grayscale1: string

  modalBG: Color
  advancedBG: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color

  primaryText1: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  red1: Color
  red2: Color
  red3: Color
  green1: Color
  yellow1: Color
  yellow2: Color
  blue1: Color

  menuActiveBg: Color
  borderLine: Color
  cardTitleColor: Color
  stakingBg: any
  stakingBannerColor: Color
  bridgeToBg: Color
  popoverHoverBg: Color
  popoverBg: Color
  themeSwitchBg: Color
  connectWalletBg: Color
  closeXColor: Color
  accountBtnBg: Color
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    grids: Grids

    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToVerySmall: ThemedCssFunction<DefaultTheme>
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
