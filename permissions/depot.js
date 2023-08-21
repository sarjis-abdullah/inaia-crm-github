import userPermissions from './loggedInUserPermissions';
import {adminEdit,adminView,assetView,assetEdit,SalesAdvisorView,SalesAdvisorEdit} from './permissions'

export const canViewDepot=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminView)>-1  || permissions.indexOf(assetView) > -1);
}
export const canEditDepot=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminEdit)>-1 || permissions.indexOf(assetEdit)>-1);
}
export const canModifySavingPlanStatus = ()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminEdit)>-1 || permissions.indexOf(assetEdit)>-1 || permissions.indexOf(SalesAdvisorEdit)>-1);
}