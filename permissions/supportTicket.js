import userPermissions from './loggedInUserPermissions';
import {adminEdit,adminView,crmView,crmEdit,SalesAdvisorView,supportEdit,supportView} from './permissions'

export const canViewSupportTicket=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminView)>-1 || permissions.indexOf(SalesAdvisorView)>-1 || permissions.indexOf(crmView) > -1  || permissions.indexOf(supportView)>-1);
}
export const canEditSupportTicket=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminEdit)>-1 || permissions.indexOf(crmEdit)>-1 || permissions.indexOf(SalesAdvisorView)>-1 || permissions.indexOf(supportEdit)>-1);
}