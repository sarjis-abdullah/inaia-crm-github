export const getCurrencySymbol=(curr)=>{
    const currency = curr || process.env.APP_CURRENCY;
    console.log(process.env.CURRENT_APP);
    switch (currency) {
        case undefined:
            return '€';
        case "GBP":
            return '£';
        case "EUR":
            return '€';
        case "USD":
            return '$';
        default:
            return '€';
    }
}
export const getCurrencyName=()=>{
    let currency = process.env.APP_CURRENCY;
    switch (currency) {
        case undefined:
            return '€';
        case "GBP":
            return "GBP";
        case "EUR":
            return "EUR";
        case "USD":
            return "USD";
        default:
            return "EUR";
    }
}