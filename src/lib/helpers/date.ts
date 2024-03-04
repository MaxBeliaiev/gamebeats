import moment from "moment/moment";
export const getUtcStartOfMonth = (removeDays= 0) => moment().utc()
  .subtract(removeDays,'months').startOf('month').toDate()
export const getUtcStartOfDay = () => moment().utc().startOf('day').toDate()