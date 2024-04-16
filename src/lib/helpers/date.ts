import moment from "moment/moment";
export const getUtcStartOfMonth = (removeMonths= 0, addMonth = 0) => moment().utc()
  .subtract(removeMonths,'months').add(addMonth, 'months').startOf('month').toDate()
export const getUtcStartOfDay = () => moment().utc().startOf('day').toDate()