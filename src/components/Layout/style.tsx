import styled from 'styled-components'

export const LayoutView = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  .layout-main {
    flex: 1;
    display: flex;
    overflow: hidden;
    .layout-box {
      flex: 1;
      overflow: hidden;
      position: relative;
      background: ${({ theme }) => theme.bg2};
    }
  }
`
