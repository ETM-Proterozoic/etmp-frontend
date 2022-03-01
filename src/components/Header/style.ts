import styled from 'styled-components'

export const HeaderView = styled.div`
  width: 100%;
  height: 64px;
  min-height: 64px;
  position: relative;
  display: flex;
  background: #ffffff;
  //box-shadow: 0 2px 0 0 ${({ theme }) => theme.shadow4};
  background: ${({ theme }) => theme.bg1};
  //margin-bottom: 2px;
  .header-left {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    .menu-tab {
      width: 24px;
      height: 24px;
      margin-left: 16px;
      cursor: pointer;
      &.open {
        transform: rotate(180deg);
      }
      display: none;
      ${({ theme }) => theme.mediaWidth.upToSmall`
      display: block;
    `};
    }
  }
  .header-center {
    flex: 1;
  }
  .header-right {
    display: flex;
    align-items: center;
    .theme-switch{
      margin-right: 20px;
      background: #cccccc;
      transform: scale(1.2);
      min-width: 60px;
    }
  }
`
export const Logo = styled.img`
  width: 96px;
  height: 28px;
  margin-left: 30px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 60px;
    height: auto;
    margin-left: 10px;
  `};
`
