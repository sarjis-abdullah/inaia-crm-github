import userPermissions from './loggedInUserPermissions';
import {adminEdit,adminView,SalesAdvisorEdit,SalesAdvisorView} from './permissions'

export const canViewSalesCimmission=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminView)>-1 || permissions.indexOf(SalesAdvisorView)>-1);
}
export const canEditSalesCimmission=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminEdit)>-1 || permissions.indexOf(SalesAdvisorEdit)>-1);
}
export const ifHasSalesAdvisorAccess=()=>{
    const permissions = userPermissions();
    return permissions.indexOf(SalesAdvisorEdit)>-1;
}