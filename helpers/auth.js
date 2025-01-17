export function hasAdminLoginAccess(account) {
    if (hasMaxAccess(account) || account.accounting_access || account.adminpanel_access || account.goldadmin_access || account.crm_access) {
        return true
    }
    return hasAccountAdminLoginAccess(account)
}

export function hasRoleAccess(account, operation) {
    let foundAccess = false
    if (Array.isArray(account.roles)) {
        account.roles.find( role => {
            if (!foundAccess && role.is_active && Array.isArray(role.permissions)) {
                role.permissions.find( permission => {
                    if (!foundAccess && permission.is_active && permission.short_name === operation) {
                        foundAccess = true
                    }
                })
            }
        })
    }
    return foundAccess
}

export function hasAccountAdminLoginAccess(account) {
    if (account.type.value.indexOf('customer') > -1) {
        return false
    }
    return true
}

export function getAppsAccess(account) {
    if (!account) {
        return null
    }
    return {
        accounting_access:  account.accounting_access,
        adminpanel_access:  account.adminpanel_access,
        goldadmin_access:   account.goldadmin_access,
        crm_access:         account.crm_access
    }
}

export function isSuperAdmin(account) {
    let foundAccess = false
    if (Array.isArray(account.roles)) {
        account.roles.find( role => {
            if (!foundAccess && role.is_active && role.short_name === 'superadmin') {
                foundAccess = true
            }
        })
    }
    return foundAccess
}

export function isAdmin(account) {
    let foundAccess = false
    if (Array.isArray(account.roles)) {
        account.roles.find( role => {
            if (!foundAccess && role.is_active && role.short_name.indexOf('admin') > -1) {
                foundAccess = true
            }
        })
    }
    return foundAccess
}
export function isSalesAdvisor(account){
    let result = false;
    if(Array.isArray(account.roles)){
        const role = account.roles.find(role=>(role.is_active && role.short_name == 'sales_advisor'))
        if(role)
            return true;
    }
    return result;
}
export function hasMaxAccess(account) {
    return isAdmin(account)
}

export function hasAppAccess(account) {
    if (account.crm_access || hasMaxAccess(account)) {
        return true
    }
    return false
}

export async function logout(store) {
    return await store.dispatch('auth/logout')
        .catch(err => {})
        .finally(() => {
            //window.location.href    = process.env.universalLogin + '/logout'
            this.$router.push('/logout')
        })
}

export function holdingActivePermissionIds(holdingPermissionIds, availablePermissions) {
    let holdingActivePermissionIds = []
    if (Array.isArray(holdingPermissionIds) && Array.isArray(availablePermissions)) {
        holdingPermissionIds.forEach( pid => {
            if (availablePermissions.find( p => p.id === pid )) {
                holdingActivePermissionIds.push(pid)
            }
        })
    }
    return holdingActivePermissionIds
}

export function holdingActiveRoleIds(holdingRoleIds, availableRoles) {
    let holdingActiveRoleIds = []
    if (Array.isArray(holdingRoleIds) && Array.isArray(availableRoles)) {
        holdingRoleIds.forEach( rid => {
            if (availableRoles.find( r => r.id === rid )) {
                holdingActiveRoleIds.push(rid)
            }
        })
    }
    return holdingActiveRoleIds
}

export function getEmployeeTypeId(types) {
    return types['employee']
}

export function redirectPost(url, data) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = url;
    for (var name in data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = data[name];
        form.appendChild(input);
    }
    form.submit();
}

export function anonymousUserAvatar(gender = null) {
    if (gender === 'female' || gender === 'f') {
        return '/img/theme/avatar_f.png'
    }
    return '/img/theme/avatar_m.png'
}

export function avatar(loggedInUser = null) {
    let gender = null
    if (loggedInUser) {
        if (loggedInUser.avatar) {
            return loggedInUser.avatar
            // return process.env.s3BucketUri + loggedInUser.avatar
        } else if (loggedInUser.person_data) {
            gender = loggedInUser.person_data.gender.toLowerCase()
        }
    }
    return anonymousUserAvatar(gender)
}

export function notifyError(err, notify) {
    let response = err.response
    if (response.status === 403) {
        notify({type: 'danger', timeout: 7000, message: response.data.message })
    } else {
        notify({type: 'danger', timeout: 7000, message: err.message })
    }
}
