import React, { useMemo } from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'
import StakingPageBG from '../assets/svg/staking/bg.png'

export * from './components'

const MEDIA_WIDTHS = {
  upToVerySmall: 320,
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: darkMode ? '#FFFFFF' : '#000000',
    text2: darkMode ? '#ffffff' : '#017BFF',
    text3: darkMode ? '#ffffff' : '#135658',
    text4: darkMode ? '#4B9395' : '#4B9395',
    text5: darkMode ? '#3F4E50' : '#3F4E50',
    text8: darkMode ? '#FFF4DF' : '#FFF4DF',
    text9: darkMode ? '#4e5969' : '#4e5969',

    // backgrounds / greys
    bg1: darkMode ? '#212429' : '#FFFFFF',
    bg2: darkMode ? '#2C2F36' : '#F8F9FA',
    bg3: darkMode ? '#40444F' : '#EDEEF2',
    bg4: darkMode ? '#565A69' : '#CED0D9',
    bg5: darkMode ? '#6C7284' : '#888D9B',
    bg6: darkMode ? '#40444F' : '#f2f8f0',
    bg7: darkMode ? '#F1F5F5' : '#F1F5F5',
    bgd1: darkMode ? '#F8F9FA' : '#F8F9FA',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(33,36,41,0.95)' : 'rgba(255,255,255,0.95)',

    //primary colors
    primary1: darkMode ? '#3680E7' : '#495AFF',
    primary2: darkMode ? '#3680E7' : '#495AFF',
    primary3: darkMode ? '#4D8FEA' : '#495AFF',
    primary4: darkMode ? '#2172E5' : '#3285FF',
    primary5: darkMode ? '#153d6f70' : '#c1d5f3',

    // color text
    primaryText1: darkMode ? '#6da8ff' : '#3285FF',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#2172E5',
    secondary2: darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: darkMode ? '#17000b26' : '#FDEAF1',

    // other
    red1: '#FD4040',
    red2: '#F82D3A',
    red3: '#D60000',
    green1: '#27AE60',
    yellow1: '#F5C02B',
    yellow2: '#F3841E',
    blue1: '#2172E5',

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
    bg8: darkMode ? '#40444F' : '#F1F5F8',
    bg9: darkMode ? '#CED0D9' : '#565A69',
    bg10: darkMode ? '#2C2F36' : '#EAF2FB',
    bg11: darkMode ? '#c7cccd' : '#F1F5F8',
    bg12: darkMode ? '#F6F2ED' : '#F6F2ED',
    bg13: darkMode ? '#121212' : '#f3f3f3',
    text6: darkMode ? '#3285FF' : '#3285FF',
    text7: darkMode ? '#C3C5CB' : '#ffffff',
    gradual1: darkMode ? '#065163' : '#0ACFFE',
    gradual2: darkMode ? '#222a71' : '#495AFF',
    gradual3: darkMode ? 'rgba(10, 207, 254, 0.3)' : 'rgba(10, 207, 254, 0.3)',
    gradual4: darkMode ? 'rgba(73, 90, 255, 0.3)' : 'rgba(73, 90, 255, 0.3)',
    gradual5: darkMode ? 'rgb(52,52,52, 1)' : 'rgba(255,255,255,1)',
    gradual6: darkMode ? 'rgba(52,52,52,0.8)' : 'rgba(255,255,255,0.8)',
    gradual7: darkMode ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,0)',
    gradual8: darkMode ? '#945b5e' : '#FF9A9E',
    gradual9: darkMode ? '#866d7e' : '#FECFEF',
    gradual10: darkMode ? '#9482a7' : '#E0C3FC',
    gradual11: darkMode ? '#6184a7' : '#8EC5FC',
    border1: darkMode ? '#DAE3EB' : '#DAE3EB',
    border2: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
    shaw1: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(30, 68, 89, 0.12)',
    disabled: darkMode ? '#6c6c6c' : '#9A9CA4',
    disabled2: darkMode ? 'rgba(86, 90, 105, 0.6)' : 'rgba(86, 90, 105, 0.6)',
    disabled3: darkMode ? '#A1BCBD' : '#A1BCBD', //
    disabled4: darkMode ? '#D3D9D3' : '#D3D9D3', //
    disabled5: darkMode ? '#E9ECE9' : '#E9ECE9', //
    mask1: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
    mask2: darkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)',
    shadow1: darkMode ? '#89aaab' : '#89aaab', //
    shadow2: darkMode ? '#427779' : '#427779', //
    shadow3: darkMode ? '#C8C5C3' : '#C8C5C3', //
    shadow4: darkMode ? '#404037' : '#eae8d6', //
    grayscale1: darkMode ? '0.3' : '0', ////////////
    menuActiveBg: darkMode ? '#4c4c4c94' : '#f8f9fa',
    borderLine: darkMode ? '#6e6e6e' : '#f2f2f2',
    cardTitleColor: darkMode ? '#ffffff' : '#061024',
    stakingBg: darkMode ? '#061024' : StakingPageBG,
    stakingBannerColor: darkMode ? '#ffffff' : '#2d316a',
    bridgeToBg: darkMode ? '#0000008f' : '#faf9ff',
    popoverHoverBg: darkMode ? 'rgba(255,255,255,0.13)' : '#F8F9FA',
    popoverBg: darkMode ? 'rgba(0,0,0,0.95)' : '#ffffff',
    themeSwitchBg: darkMode ? '#4D4D4D' : '#4D4D4D',
    connectWalletBg: darkMode ? '#4C4D4D' : '#27272E',
    closeXColor: darkMode ? '#cccccc' : '#27272E',
    accountBtnBg: darkMode ? '#4D4D4D' : '#F4F5F6',
    placeholderColor: darkMode ? '#969696' : '#cccccc'
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'blue1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`
  html, input, textarea, button {
    font-family: 'Inter', sans-serif;
    font-display: fallback;
  }

  @supports (font-variation-settings: normal) {
    html, input, textarea, button {
      font-family: 'Inter var', sans-serif;
    }
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  a {
    color: ${colors(false).blue1};
  }

  * {
    box-sizing: border-box;
  }

  button {
    user-select: none;
  }

  html {
    font-size: 16px;
    font-variant: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;

  }
  .ant-popover-content{
    padding: 0!important;
    z-index: 2;
    .ant-popover-inner-content{
      padding: 0!important;
    }
    .ant-popover-inner{
      border-radius: 20px!important;
    }
  }
`

export const ThemedGlobalStyle = createGlobalStyle`
  html {
    color: ${({ theme }) => theme.text3};
    background-color: ${({ theme }) => theme.bg10};
  }

  body {
    min-height: 100vh;
    background-position: 0 -30vh;
    background: ${({ theme }) => theme.bg10};
  }
`
export const FlexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`
export const FlexCenterH = css`
  display: flex;
  align-items: center;
`
