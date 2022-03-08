import styled from 'styled-components'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { FlexCenterH } from '../../theme'

export const CurrencyInputPanelView = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
  .container {
    border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
    background-color: ${({ theme }) => theme.bg1};
  }
`
export const InputRow = styled.div<{ selected: boolean }>`
  position: relative;

  align-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.bg8};
  border-radius: 20px;
  .input-title {
    width: 100%;
    display: flex;
    font-size: 14px;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.text1};
    .input-title-l {
      flex: 1;
      font-weight: 600;
    }
    .input-title-r {
    }
  }
  .input-box {
    width: 100%;
    display: flex;
    .input-box-l {
      flex: 1;
      .token-amount-input {
        width: 100%;
        height: 40px;
        font-size: 18px;
      }
    }
    .input-box-r {
      ${FlexCenterH}
    }
  }
`
export const CurrencySelect = styled.button<{ selected: boolean }>`
  //width: 168px;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text3};
  background: rgba(0, 0, 0, 0);
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;

  :focus,
  :hover {
    opacity: 0.9;
  }
`
export const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;
  path {
    stroke: ${({ theme }) => theme.text3};
    stroke-width: 1.5px;
  }
`
export const StyledBalanceMax = styled.span`
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 2px;
  color: ${({ theme }) => theme.primary1};
`
