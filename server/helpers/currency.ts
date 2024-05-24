export function convertToUSD(value, currency) {
    switch(currency) {
    case 'USD': return value / 1
    case 'ZAR': return value / 18.00
    case 'GBP': return value / 0.79
    case 'BTC': return value / 0.000078
    default: return NaN
    }
}