
export const ORDER_STATUS_PENDING   = 'order_status_pending'

export const ORDER_STATUS_PAID      = 'order_status_paid'
export const ORDER_STATUS_PAYMENT_FAILED      = 'order_status_payment_failed'
export const ORDER_STATUS_COMPLETED     = 'order_status_completed'
export const ORDER_STATUS_OUTSTANDING = "order_status_payment_outstanding"
export const GOLD_PURCHASE_TYPE = "gold_purchase";
export const GOLD_SELL_TYPE = "gold_sell";
export const GOLD_PURCHASE_INTERVAL_TYPE = "gold_purchase_interval";
export const GOLD_DELIVERY_TYPE = "gold_delivery";

export function isOrderPending(order) {
    if (order.order_status && order.order_status.name_translation_key === ORDER_STATUS_PENDING) {
        return true
    }
    return false
}

export function isOrderPaid(order) {
    if (order.order_status && order.order_status.name_translation_key === ORDER_STATUS_PAID) {
        return true
    }
    return false
}
export function isOrderPaymentFailed(order){
    if (order.order_status && order.order_status.name_translation_key === ORDER_STATUS_PAYMENT_FAILED) {
        return true
    }
    return false
}
export function isOrderCompleted(order){
    if (order.order_status && order.order_status.name_translation_key === ORDER_STATUS_COMPLETED) {
        return true
    }
    return false
}
export function isOrderGoldPurchase(order){
    return order.order_type.name_translation_key==GOLD_PURCHASE_TYPE;
}
export function isOrderGoldPurchaseInterval(order){
    return order.order_type.name_translation_key==GOLD_PURCHASE_INTERVAL_TYPE;
}
export function isOrderGoldSale(order){
    return order.order_type.name_translation_key==GOLD_SELL_TYPE;
}
export function isOrderOutstanding(order){
    return (order.order_status && order.order_status.name_translation_key === ORDER_STATUS_OUTSTANDING)
}
export function isOrderDelivery(order) {
    return order.order_type.name_translation_key==GOLD_DELIVERY_TYPE;
}
