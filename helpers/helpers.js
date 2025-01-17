
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
export function mapCountryCode(list){
    let countyList = [];
    list.forEach(item=>{
        if(item.allow && item.calling_code){
            countyList.push({
                id:item.id,
                value:item.calling_code.replace('00','+'),
                text:item.country+" ( "+ item.calling_code.replace('00','+') + " )"
            })
        }
    })
    return countyList;
}
export function extractCountryCode(phone,list)
{
    let phoneNumber = '';
    let countryCode = '';
    list.forEach(item=>{
        if(phone.startsWith(item.value))
        {
            countryCode = item.value;
            phoneNumber = phone.replace(item.value,'');
        }
    })
    return {phoneNumber,countryCode}
}
export function formatWithSpaces(str, n) {
    let ret = [];
    let i;
    let len;

    for(i = 0, len = str.length; i < len; i += n) {
       ret.push(str.substr(i, n))
    }

    return ret.join(' ')
};
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
export function validURL(str) {
    var pattern = new RegExp('(?:(?:https?|ftp|file):\/\/)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])','i'); // fragment locator
    return !!pattern.test(str);
  }
export function isEmail(email)
{
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
export function isPhoneNumber(phone)
{
    phone = String(phone).replace(' ','').replace('+','');
    return !isNaN(phone);
}
export function getMonthName(monthNumber)
{
    const i18nKey = 'i18n_redirected'
    const defaultLocale = 'en'
    const Cookie = process.client ? require('js-cookie') : undefined;
    const locale    = Cookie ? (Cookie.get(i18nKey) ? Cookie.get(i18nKey) : defaultLocale) : defaultLocale;
    var objDate = new Date();
    objDate.setDate(1);
    objDate.setMonth(monthNumber-1);
    const month = objDate.toLocaleString(locale, { month: "long" });
    return month;
}
export function checkIfItIsAccountNumber(number){
    const re = /^GD\d+$/;
    return re.test(number);
}
export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});
export function getUniqueListBy(arr, key) {
	return [...new Map(arr.map(item => [item[key], item])).values()]
}
export function getYearDifference(date1, date2) {
    const start = new Date(date1);
    const end = new Date(date2);

    let yearsDiff = end.getFullYear() - start.getFullYear();

    if (
        end.getMonth() < start.getMonth() || 
        (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
    ) {
        yearsDiff--;
    }

    return yearsDiff;
}

