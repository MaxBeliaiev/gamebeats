import { format, parseISO } from 'date-fns'

const dateTimeFormat = 'dd/MM/yyyy H:mm'

export const formatDateTime = (date: any, formatStr = dateTimeFormat) =>
  date instanceof Date ? format(date, formatStr) : format(parseISO(date), formatStr)
