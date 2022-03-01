import styled from 'styled-components'

export const BridgePage = styled.div`
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
  .bridge-page {
    max-width: 500px;
    min-height: 400px;
    background: ${({ theme }) => theme.bg1};
    border-radius: 20px;
    margin: 50px auto;
    padding: 20px;
    color: ${({ theme }) => theme.text1};
    .bridge-from {
      border: 1px solid ${({ theme }) => theme.borderLine};
      border-radius: 10px;
      margin-bottom: 10px;
      .bridge-from-title {
        display: flex;
        padding: 20px 30px;
        border-bottom: 1px solid ${({ theme }) => theme.borderLine};
        div:nth-child(1) {
          flex: 1;
          display: flex;
          align-items: center;
          img {
            width: 28px;
            margin-right: 5px;
          }
        }
        div:nth-last-child(1) {
          display: flex;
          align-items: center;
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
            input {
              flex: 1;
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
      padding: 10px;
      border-radius: 10px;
      & > div {
        &:nth-child(1) {
          flex: 1;
          display: flex;
          align-items: center;
        }
        &:nth-last-child(1) {
          display: flex;
          align-items: center;
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
      border-radius: 30px;
      background: #4c43fd;
      color: #ffffff;
      cursor: pointer;
      margin: 40px 0 20px 0;
    }
  }
`
