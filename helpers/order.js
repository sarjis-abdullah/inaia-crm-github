export const ORDER_STATUS_PENDING = 'order_status_pending';
export const ORDER_STATUS_PAYMENT_IN_PROGRESS = 'order_status_payment_inprogress';
export const ORDER_STATUS_PAID = 'order_status_paid';
export const ORDER_STATUS_PAYMENT_OUTSTANDING = 'order_status_payment_outstanding';
export const ORDER_STATUS_EXECUTED = 'order_status_executed';
export const ORDER_STATUS_CANCELED = 'order_status_canceled';
export const ORDER_STATUS_REJECTED = 'order_status_rejected';
export const ORDER_STATUS_PAYMENT_FAILED = 'order_status_payment_failed';
export const ORDER_STATUS_REFUND = 'order_status_refund';
export const ORDER_STATUS_REFUNDED = 'order_status_refunded';
export const ORDER_STATUS_COMPLETED = 'order_status_completed';
export const ORDER_STATUS_REVERTED = 'order_status_reverted';
export const ORDER_STATUS_OUTSTANDING = "order_status_payment_outstanding";

export const GOLD_PURCHASE_TYPE = "gold_purchase";
export const GOLD_SELL_TYPE = "gold_sell";
export const GOLD_PURCHASE_INTERVAL_TYPE = "gold_purchase_interval";
export const GOLD_DELIVERY_TYPE = "gold_delivery";
export const GOLD_GIFT_TYPE = "gold_gift";
export const SILVER_GIFT_TYPE = "silver_gift";
export const SILVER_PURCHASE_TYPE = "silver_purchase";
export const SILVER_SELL_TYPE = "silver_sell";
export const SILVER_PURCHASE_INTERVAL_TYPE = "silver_purchase_interval";
export const SILVER_DELIVERY_TYPE = "silver_delivery";
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
export function isOrderGoldDelivery(order) {
    return order.order_type.name_translation_key==GOLD_DELIVERY_TYPE;
}
export function isOrderSilverPurchase(order){
    return order.order_type.name_translation_key==SILVER_PURCHASE_TYPE;
}
export function isOrderSilverPurchaseInterval(order){
    return order.order_type.name_translation_key==SILVER_PURCHASE_INTERVAL_TYPE;
}
export function isOrderSilverSale(order){
    return order.order_type.name_translation_key==SILVER_SELL_TYPE;
}
export function isOrderSilverDelivery(order) {
    return order.order_type.name_translation_key==SILVER_DELIVERY_TYPE;
}
export function isPurchaseOrder(order){
    return isOrderGoldPurchase(order) || isOrderSilverPurchase(order)
}
export function isSellOrder(order){
    return isOrderGoldSale(order) || isOrderSilverSale(order);
}
export function isIntervalPurchaseOrder(order){
    return isOrderGoldPurchaseInterval(order) || isOrderSilverPurchaseInterval(order);
}
export function isDeliveryOrder(order){
    return isOrderGoldDelivery(order) || isOrderSilverDelivery(order);
}
export function isPaymentInProgressOrder(order){
    if (order.order_status && order.order_status.name_translation_key === ORDER_STATUS_PAYMENT_IN_PROGRESS) {
        return true
    }
    return false
}
export function isGoldGift(order){
    return order && order.order_type && (order.order_type.name_translation_key==GOLD_GIFT_TYPE || order.order_type.name_translation_key==SILVER_GIFT_TYPE);
}
export function isOrderCanceled(order){
    return order && order.order_status && order.order_status.name_translation_key == ORDER_STATUS_CANCELED
}
export function getOrderStatus(status) {
    switch (status) {
        case ORDER_STATUS_PENDING:
            return 'pending';
        case ORDER_STATUS_PAYMENT_IN_PROGRESS:
            return 'payment_inprogress';
        case ORDER_STATUS_PAID:
            return 'paid';
        case ORDER_STATUS_PAYMENT_OUTSTANDING:
            return 'payment_outstanding';
        case ORDER_STATUS_EXECUTED:
            return 'executed';
        case ORDER_STATUS_CANCELED:
            return 'canceled';
        case ORDER_STATUS_REJECTED:
            return 'rejected';
        case ORDER_STATUS_PAYMENT_FAILED:
            return 'payment_failed';
        case ORDER_STATUS_REFUND:
            return 'refund';
        case ORDER_STATUS_REFUNDED:
            return 'refunded';
        case ORDER_STATUS_COMPLETED:
            return 'completed';
        case ORDER_STATUS_REVERTED:
            return 'reverted';
        default:
            return 'unknown';
    }
}
