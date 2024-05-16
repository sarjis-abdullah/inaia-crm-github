import userPermissions from './loggedInUserPermissions';
import {adminEdit,adminView,statisticView} from './permissions'

export const canViewStatistics=()=>{
    const permissions = userPermissions();
    return (permissions.indexOf(adminView)>-1 && permissions.indexOf(adminEdit) > -1) || permissions.indexOf(statisticView) > -1;
}