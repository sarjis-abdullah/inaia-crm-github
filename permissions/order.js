import userPermissions from './loggedInUserPermissions';
import {adminEdit,adminView,assetView,assetEdit,SalesAdvisorView} from './permissions'

export const canViewOrder=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminView)>-1 || permissions.indexOf(assetView) > -1);
}
export const canEditOrder=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminEdit)>-1 || permissions.indexOf(assetEdit)>-1);
}