
export default  ()=>{
    const userToken = 'inaiaUserToken'
    const initUser      = JSON.parse(localStorage.getItem(userToken));
    let permissions = [];
    if(initUser && initUser.account &&  Array.isArray(initUser.account.roles)){
        initUser.account.roles.forEach(role => {
            if(role.permissions && role.permissions.length > 0){
                role.permissions.forEach(permission => {
                    if(permission && permission.is_active == 1){
                        permissions.push(permission.short_name)
                    }
                });
            }
        });
    }
    return permissions;
}