import { Currency, ETHER, Token } from '@etmp/sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'ETMP'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
