import moment from "moment/moment";

// export const getUtcStartOfMonth = () => moment().utc().startOf('month').toDate()
export const getUtcStartOfWeek = () => moment().utc().startOf('isoWeek').toDate()
export const getUtcStartOfDay = () => moment().utc().startOf('day').toDate()