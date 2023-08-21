import moment from "moment/moment";

export const getUtcStartOfMonth = () => moment().utc().startOf('month').toDate()