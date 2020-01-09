
export function snake2camel(s) {
    return s.replace(/(\-\w)/g, m => m[1].toUpperCase()) // camelized
}

export function snake2pascal(s) {
    let n = snake2camel(s)
    return n[0].toUpperCase() + n.substr(1) // pascalized
}

export function loadViewsComponent(c) {
    let s = snake2pascal(c)
    return import('@/views/components/vuesax/' + c + '/' + s)
}

export function loadViewsFormElement(c) {
    let s = snake2pascal(c)
    return import('@/views/forms/form-elements/' + c + '/' + s)
}

export function loadViewsFormLayout(c) {
    let s = snake2pascal(c)
    return import('@/views/forms/form-layouts/' + c + '/' + s)
}

