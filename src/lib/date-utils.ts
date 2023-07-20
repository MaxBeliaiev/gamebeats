import { format } from 'date-fns'

const dateTimeFormat = 'dd/MM/yyyy H:mm'

export const formatDateTime = (date: any, formatStr = dateTimeFormat) =>
  format(date, formatStr)
