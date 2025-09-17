import moment from "moment";

export const dateFilterDates = (format = "YYYY-MM-DD") => {
  const today = moment().format(format);
  const tommorow = moment().add(1, "days").format(format);
  const yesterday = moment().subtract(1, "days").format(format);
  const lastweek = moment().subtract(1, "weeks").format(format);
  const lastMonth = moment().subtract(1, "month").format(format);
  const last28Days = moment().subtract(28, "days").format(format);
  const last90Days = moment().subtract(90, "days").format(format);
  const currentDate = moment();
  const startDateOfMonth = currentDate.startOf("month").format(format);

  const thisWeekStartDate = moment().clone().startOf("isoWeek").format(format);

  // Get the ending date (Sunday) of this week
  const thisWeekEndDate = moment().clone().endOf("isoWeek").format(format);
  const allTimesStartDate = moment('2000-01-01').format(format);



  return {
    today,
    tommorow,
    yesterday,
    lastweek,
    thisWeekStartDate,
    thisWeekEndDate,
    lastMonth,
    last28Days,
    last90Days,
    startDateOfMonth,
    allTimesStartDate
  };
};
