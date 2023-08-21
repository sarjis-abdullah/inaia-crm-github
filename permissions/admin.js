import userPermissions from './loggedInUserPermissions';
import {adminEdit,adminView} from './permissions'

export const canViewAdmin=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminView)>-1);
}
export const canEditAdmin=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminEdit)>-1);
}
