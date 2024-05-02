import moment from "moment/moment";
export const getUtcStartOfMonth = (removeMonths= 0) => moment().utc()
  .subtract(removeMonths,'months').startOf('month').toDate()
export const getUtcStartOfDay = () => moment().utc().startOf('day').toDate()