export const formatCurrency = (amount, ommitDecimalIfZero = false) => {
  const amountStr = amount == null ? "" : amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })

  return ommitDecimalIfZero ? amountStr.replace('.00', '') : amountStr
}
