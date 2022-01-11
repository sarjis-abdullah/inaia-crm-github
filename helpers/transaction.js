
export function transactionType(transaction) {
    if (transaction.transaction_type) {
        return transaction.transaction_type.name_translation_key
    } else if (transaction.direction) {
        return transaction.direction
    } else {
        return 'n/a'
    }
}

export function transactionDirection(transaction) {
    if (transaction.direction && transaction.direction === 'DEBIT') {
        return '+'
    } else if (transaction.transaction_type && ['gold_sell', 'gold_withdrawal'].includes(transaction.transaction_type.name_translation_key)) {
        return '+'
    }
    return '-'
}

export function transactionStatus(transaction) {
    if (transaction.lifecycle_status) {
        return transaction.lifecycle_status
    } else if (transaction.order && transaction.order.order_status) {
        return transaction.order.order_status
    }
    return 'n/a'
}

export function isGoldTransaction(transaction) {
    if (transaction.transaction_type 
        && ['gold_purchase', 'gold_withdrawal', 'gold_sell'].includes(transaction.transaction_type.name_translation_key)) {
        return true
    }
    return false
}

export function isTransactionPending(transaction) {
    if (transaction.lifecycle_status && transaction.lifecycle_status !== 'COMPLETE') {
        return true
    } else if (transaction.order && transaction.order.order_status && transaction.order.order_status.name_translation_key === 'order_status_pending') {
        return true
    }
    return false
}

export function isGoldSellTransaction(transaction) {
    if (transaction.transaction_type && ['gold_withdrawal', 'gold_sell'].includes(transaction.transaction_type.name_translation_key)) {
        return true
    }
    return false
}

export function isGoldPurchaseTransaction(transaction) {
    if (transaction.transaction_type && transaction.transaction_type.name_translation_key === 'gold_purchase') {
        return true
    }
    return false
}
