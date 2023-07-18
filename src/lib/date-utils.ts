import moment from 'moment'

const dateTimeFormat = 'DD/MM/YYYY H:mm'

export const formatDateTime = (date: any, format = dateTimeFormat) =>
  moment(date).format(format)
