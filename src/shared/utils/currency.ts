export const formatNumberToCurrency = (
  value?: number,
  fractionDigits: number = 2,
  currencyCode: string = 'USD'
) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    currencySign: 'accounting',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return formatter.format(value ?? 0);
};

export const getCurrencyStringTitleForChart = (value: number) => {
  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    signDisplay: 'never',
  });
  const prefix = value >= 0 ? '$' : '-$';
  return `${prefix}${formatter.format(value)}`;
};
