import userPermissions from './loggedInUserPermissions';
import {adminEdit,adminView,assetView,assetEdit} from './permissions'

export const canViewBatchProcess=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminView)>-1 || permissions.indexOf(assetView) > -1);
}
export const canEditBatchProcess=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminEdit)>-1 || permissions.indexOf(assetEdit)>-1);
}