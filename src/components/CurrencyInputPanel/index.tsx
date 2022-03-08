import { Currency, Pair } from '@etm3/sdk'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'

import { Input as NumericalInput } from '../NumericalInput'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { CurrencyInputPanelView, InputRow, CurrencySelect, StyledDropDown, Aligner, StyledBalanceMax } from './style'

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  14px;
`
interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  maxAmount?: string
  showMax?: boolean
  inputTitle?: string
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  maxAmount,
  showMax = true,
  inputTitle
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])
  return (
    <CurrencyInputPanelView id={id}>
      <div className="container">
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={!!currency && !!account}>
          <div className="input-title">
            <div className="input-title-l">{inputTitle}</div>
            {account && currency ? (
              <div className="input-title-r">
                Balance: {Number(maxAmount) > 0 ? Number(Number(maxAmount).toFixed(6)) * 1 : maxAmount}
              </div>
            ) : (
              '-'
            )}
          </div>
          <div className="input-box">
            <div className="input-box-l">
              {!hideInput && (
                <NumericalInput
                  className="token-amount-input"
                  value={value}
                  align="left"
                  bgTransparent
                  onUserInput={val => {
                    onUserInput(val)
                  }}
                />
              )}
            </div>
            <div className="input-box-r">
              {label !== 'To' && showMax && account && currency && (
                <StyledBalanceMax onClick={onMax}>Max</StyledBalanceMax>
              )}
              <CurrencySelect
                selected={!!currency}
                className="open-currency-select-button"
                onClick={() => {
                  if (!disableCurrencySelect) {
                    setModalOpen(true)
                  }
                }}
              >
                <Aligner>
                  {pair ? (
                    <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
                  ) : currency ? (
                    <CurrencyLogo currency={currency} size={'24px'} />
                  ) : null}
                  {pair ? (
                    <StyledTokenName className="pair-name-container">
                      {pair?.token0.symbol}:{pair?.token1.symbol}
                    </StyledTokenName>
                  ) : (
                    <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                      {(currency && currency.symbol && currency.symbol.length > 20
                        ? currency.symbol.slice(0, 4) +
                          '...' +
                          currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                        : currency?.symbol) || t('selectToken')}
                    </StyledTokenName>
                  )}
                  {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
                </Aligner>
              </CurrencySelect>
            </div>
          </div>
        </InputRow>
      </div>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </CurrencyInputPanelView>
  )
}
