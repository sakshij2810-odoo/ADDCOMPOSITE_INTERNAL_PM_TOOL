import moment from "moment";
import { DataTableV2DateTypes } from "../preDefinedPlugins/DataTableV2Date/DataTableV2Date.types";

export const dataTableV2DatesFilter = (format = "YYYY-MM-DD") => {
  const today = moment().format(format);
  const tommorow = moment().add(1, "days").format(format);
  const yesterday = moment().subtract(1, "days").format(format);
  const lastweek = moment().subtract(1, "weeks").format(format);
  const lastMonth = moment().subtract(1, "month").format(format);
  const last28Days = moment().subtract(28, "days").format(format);
  const last90Days = moment().subtract(90, "days").format(format);
  const last7Days = moment().subtract(6, "days").format(format);
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
    last7Days,
    startDateOfMonth,
    allTimesStartDate
  };
};

export const getDataTablev2InitialDate = (type: DataTableV2DateTypes, format?: string) => {
    const {
      today,
      tommorow,
      lastweek,
      startDateOfMonth,
      yesterday,
      last28Days,
      last90Days,
      last7Days,
      thisWeekStartDate,
      thisWeekEndDate,
      allTimesStartDate,
    } = dataTableV2DatesFilter(format);
    if (type === "yesterday") {
      return { fromDate: yesterday, toDate: yesterday };
    } else if (type === "lastWeek") {
      return { fromDate: lastweek, toDate: today };
    } else if (type === "thisMonth") {
      return { fromDate: startDateOfMonth, toDate: today };
    } else if (type === "last28Days") {
      return { fromDate: last28Days, toDate: today };
    } else if (type === "last90Days") {
      return { fromDate: last90Days, toDate: today };
    }else if (type === "last7Days") {
      return { fromDate: last7Days, toDate: today };
    } 
    else if (type === "thisWeek") {
      return { fromDate: thisWeekStartDate, toDate: thisWeekEndDate };
    }
    else if (type === "allTimes") {
      return { fromDate: allTimesStartDate, toDate: today };
    }
    return { fromDate: today, toDate: tommorow };
  };
  
