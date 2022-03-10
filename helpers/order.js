
export const ORDER_STATUS_PENDING   = 'order_status_pending'

export const ORDER_STATUS_PAID      = 'order_status_paid'
export const ORDER_STATUS_PAYMENT_FAILED      = 'order_status_payment_failed'
export const ORDER_STATUS_COMPLETED     = 'order_status_completed'
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
    return order.order_type.name_translation_key=="gold_purchase";
}
export function isOrderGoldPurchaseInterval(order){
    return order.order_type.name_translation_key=="gold_purchase_interval";
}
