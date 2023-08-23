import userPermissions from './loggedInUserPermissions';
import {adminEdit,adminView,accountingEdit,accountingView} from './permissions'

export const canViewInaiaBankAccount=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminView)>-1 || permissions.indexOf(accountingView) > -1);
}
export const canEditInaiaBankAccount=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminEdit)>-1 || permissions.indexOf(accountingEdit)>-1);
}
