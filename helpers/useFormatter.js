export function useFormatter()
{
    const numberToFixed     = (num, digits=2) => num.toFixed(digits)
    const centToEur         = (value) => numberToFixed(Number(value) / 100)
    const eurToCent         = (value) => numberToFixed(Math.round(Number(value) * 100))


    return {
        numberToFixed,
        eurToCent,
        centToEur
    }
}
