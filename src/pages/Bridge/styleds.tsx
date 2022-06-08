import styled from 'styled-components'

export const BridgePageView = styled.div`
  width: 100%;
  //background: #f8f9fa;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
  input:focus,
  input:active {
    border: 0;
    outline: medium;
  }
  input {
    border: 0;
    background: transparent;
  }
  padding: 10px;
  .bridge-page {
    max-width: 500px;
    min-height: 400px;
    background: ${({ theme }) => theme.bg1};
    border-radius: 20px;
    margin: 50px auto;
    padding: 20px;
    color: ${({ theme }) => theme.text1};
    box-shadow: 0px 0px 1px rgb(0 0 0 / 1%), 0px 4px 8px rgb(0 0 0 / 4%), 0px 16px 24px rgb(0 0 0 / 4%), 0px 24px 32px rgb(0 0 0 / 1%);;
    .bridge-from {
      border: 1px solid ${({ theme }) => theme.borderLine};
      border-radius: 10px;
      margin-bottom: 10px;
      .bridge-from-title {
        display: flex;
        padding: 20px;
        border-bottom: 1px solid ${({ theme }) => theme.borderLine};
        div:nth-child(1) {
        }
        div:nth-last-child(1) {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          strong {
            margin-left: 5px;
          }
        }
      }
      .bridge-from-input {
        display: flex;
        & > div {
          &:nth-child(1) {
            padding: 20px 40px;
            display: flex;
            align-items: center;
            border-right: 1px solid ${({ theme }) => theme.borderLine};
          }
          &:nth-last-child(1) {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 0 10px;
            & > div {
              flex: 1;
              input {
                width: 100%;
              }
            }
            button {
              border: 0;
              background: transparent;
              margin-left: 10px;
            }
          }
        }
      }
    }
    .bridge-to {
      display: flex;
      background: ${({ theme }) => theme.bridgeToBg};
      padding: 10px 20px;
      border-radius: 10px;
      & > div {
        &:nth-child(1) {
        }
        &:nth-last-child(1) {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          strong {
            margin-left: 5px;
          }
        }
      }
    }
    .transfer-btn {
      width: 100%;
      height: 40px;
      border: 0;
      border-radius: 8px;
      background: #017bff;
      color: #ffffff;
      cursor: pointer;
      margin: 40px 0 20px 0;
    }
    .chain-show {
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        width: 28px;
        margin-right: 5px;
      }
      .chain-show-arrow {
        width: 20px;
        height: 20px;
        margin-left: 5px;
      }
    }
  }
`

export const ChainListView = styled.div`
  background: ${({ theme }) => theme.popoverBg};
  color: ${({ theme }) => theme.text1};
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.1), 5px 30px 71px rgba(20, 37, 63, 0.08);
  padding: 10px 10px;
  border-radius: 10px;
  & > div {
    display: flex;
    align-items: center;
    margin: 10px 0;
    padding: 5px 10px;
    cursor: pointer;
    img {
      width: 28px;
      margin-right: 5px;
    }
    &:hover {
      background-color: ${({ theme }) => theme.popoverHoverBg};
    }
  }
`
export const TokenListView = styled(ChainListView)`
  max-height: 300px;
  overflow-y: auto;
`
