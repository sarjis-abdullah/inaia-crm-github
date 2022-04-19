export const FUND_TRANSFER = "FUND_TRANSFER";
export const PAYMENT_IN = "PAYMENT_IN";
export const PAYMENT_OUT = "PAYMENT_OUT";
export const WITHDRAWAL = "WITHDRAWAL";
export const REDEMPTION = "REDEMPTION";
export function isFundTransfer(type)
{
    return type == FUND_TRANSFER;
}
export function isPaymentIn(type)
{
    return type == PAYMENT_IN;
}
export function isPaymentOut(type)
{
    return type == PAYMENT_OUT;
}
export function isWithDrawal(type)
{
    return type == WITHDRAWAL;
}
export function isRedemption(type)
{
    return type == REDEMPTION;
}
