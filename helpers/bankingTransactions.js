export const FUND_TRANSFER = "FUND_TRANSFER";
export const PAYMENT_IN = "PAYMENT_IN";
export const PAYMENT_OUT = "PAYMENT_OUT";
export const WITHDRAWAL = "WITHDRAWAL";
export const REDEMPTION = "REDEMPTION";
export const STATUS = [
    {
        id:1,
        name_translation_key: "APPROVED"
    },
    {
        id:2,
        name_translation_key: "DECLINED"
    },

]
export const TYPES = [
    {
        id:1,
        name_translation_key: FUND_TRANSFER
    },
    {
        id:2,
        name_translation_key: PAYMENT_IN
    },
    {
        id:3,
        name_translation_key: PAYMENT_OUT
    },
    {
        id:4,
        name_translation_key: WITHDRAWAL
    },
    {
        id:5,
        name_translation_key: REDEMPTION
    },

]
export const lifecycle_status = [
    {
        id:1,
        name_translation_key: "COMPLETE"
    },
    {
        id:2,
        name_translation_key: "AUTHORISED"
    },

]
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
