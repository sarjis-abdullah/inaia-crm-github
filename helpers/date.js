import moment from 'moment'
export const formatDateByMoment = (date, format = 'YYYY-MM-DD') => {
    return moment(date).format(format)
}