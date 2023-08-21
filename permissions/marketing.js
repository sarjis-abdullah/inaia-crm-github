import userPermissions from './loggedInUserPermissions';
import {adminEdit,adminView,marketingView,marketingEdit} from './permissions'

export const canViewMarketing=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminView)>-1 || permissions.indexOf(marketingView) > -1);
}
export const canEditMarketing=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminEdit)>-1 || permissions.indexOf(marketingEdit)>-1);
}
