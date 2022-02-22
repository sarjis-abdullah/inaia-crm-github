
// export function snake2camel(s) {
//     return s.replace(/(\-\w)/g, m => m[1].toUpperCase()) // camelized
// }

// export function snake2pascal(s) {
//     let n = snake2camel(s)
//     return n[0].toUpperCase() + n.substr(1) // pascalized
// }

// export function loadViewsComponent(c) {
//     let s = snake2pascal(c)
//     return import('@/views/components/vuesax/' + c + '/' + s)
// }

// export function loadViewsFormElement(c) {
//     let s = snake2pascal(c)
//     return import('@/views/forms/form-elements/' + c + '/' + s)
// }

// export function loadViewsFormLayout(c) {
//     let s = snake2pascal(c)
//     return import('@/views/forms/form-layouts/' + c + '/' + s)
// }

export function mapCountriesNationalities(list) {
    const countryList       = []
    const nationalityList   = []
    list.forEach(item => {
        if (item.allow) {
            countryList[countryList.length] = {
                text: item.name_translation_key,
                value: item.id
            }
        }
        nationalityList[nationalityList.length] = {
            text: item.nationality_translation_key,
            value: item.id
        }
    })
    return {countryList, nationalityList}
}

export function notifyError(err, notify) {
    let response = err.response
    if (response.status === 403) {
        notify({type: 'danger', timeout: 7000, message: response.data.message })
    } else {
        notify({type: 'danger', timeout: 7000, message: err.message })
    }
}

export function parseFixed(num, fractionDigits=2) {
    return parseFloat(parseFloat(num).toFixed(fractionDigits))
}

export function paddingFractionTo2(n) {
    let l = n ? n.toString().length : 0
    if (!l) {
        return '00'
    } else if (l < 2) {
        return n + '0'
    } else if (l > 2) {
        return n.toString().substr(0, 2)
    }
    return n;
}

export function paddingFractionTo3(n) {
    let l = n ? (n).toString().length : 0
    if (!l) {
        return '000'
    } else if (l < 2) {
        return n + '00'
    } else if (l < 3) {
        return n + '0'
    } else if (l > 3) {
        return n.toString().substr(0, 3)
    }
    return n;
}
export function getOrderTypeTitle(order_type_translation_key) {

}
export function formatDateToApiFormat(date)
{
    if(!date)
        return null;
    let month = date.getMonth()+1;
    if(month<10)
    {
        month ="0"+month;
    }
    let day = date.getDate();
    if(day<10)
    {
        day = "0"+day;
    }
    return date.getFullYear()+"-"+month+"-"+day;
}

