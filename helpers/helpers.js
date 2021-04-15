
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

