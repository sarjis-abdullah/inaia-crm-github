import {canViewOrder,
    canViewDepot, canViewBatchProcess,canViewStocks, canViewCustomers,canViewSupportTicket,canViewInaiaBankAccount,canViewClaims,canViewSalesCimmission,canViewMarketing,canViewAdmin} from '~/permissions'
export default function({ route, redirect }) {
    const pathName = route.name;
    console.log(pathName);
    switch (pathName) {
        case 'customers':
            if(!canViewCustomers()) return redirect(404, '/Error404')
            break;
        case 'customers-details-id':
            if(!canViewCustomers()) return redirect(404, '/Error404')
            break;
        case "support-tickets":
            if(!canViewSupportTicket()) return redirect(404, '/Error404')
            break;
        case "depots":
            if(!(canViewDepot() || canViewSalesCimmission())) return redirect(404, '/Error404')
            break;
        case 'depots-details-id':
            if(!canViewDepot() && !canViewSalesCimmission()) return redirect(404, '/Error404')
            break;
        case "orders":
            if(!canViewOrder()) return redirect(404, '/Error404')
            break;
        case "orders-batch-processing":
            if(!canViewBatchProcess()) return redirect(404, '/Error404')
            break;
        case "orders-batch-processing-details-id":
            if(!canViewBatchProcess()) return redirect(404, '/Error404')
            break;
        case "stocks":
            if(!canViewStocks()) return redirect(404, '/Error404')
            break;
        case "stocks-transactions":
            if(!canViewStocks()) return redirect(404, '/Error404')
            break;
        case "accounting-inaia-account":
            if(!canViewInaiaBankAccount()) return redirect(404, '/Error404')
            break;
        case "accounting-claims":
            if(!canViewClaims()) return redirect(404, '/Error404')
            break;
        case "accounting-claims-details-month":
            if(!canViewClaims()) return redirect(404, '/Error404')
            break;
        case "sales-commission":
            if(!canViewSalesCimmission()) return redirect(404, '/Error404')
            break;
        case "news-feeds":
            if(!canViewMarketing()) return redirect(404, '/Error404')
            break;
        case "news-feeds-edit-id":
            if(!canViewMarketing()) return redirect(404, '/Error404')
            break;
        case "users":
            if(!canViewAdmin()) return redirect(404, '/Error404')
            break;
        case "users-add":
            if(!canViewAdmin()) return redirect(404, '/Error404')
            break;
        case "users-edit-id":
            if(!canViewAdmin()) return redirect(404, '/Error404')
            break;
        case "users-assign-roles-id":
            if(!canViewAdmin()) return redirect(404, '/Error404')
            break;
        case "roles":
            if(!canViewAdmin()) return redirect(404, '/Error404')
            break;
        case "roles-add":
            if(!canViewAdmin()) return redirect(404, '/Error404')
            break;
        case "roles-edit-id":
            if(!canViewAdmin()) return redirect(404, '/Error404')
            break;
        default:
            break;
    }
}