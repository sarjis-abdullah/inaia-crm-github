
export const ORDER_STATUS_PENDING   = 'order_status_pending'

export const ORDER_STATUS_PAID      = 'order_status_paid'
export const ORDER_STATUS_PAYMENT_FAILED      = 'order_status_payment_failed'
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
