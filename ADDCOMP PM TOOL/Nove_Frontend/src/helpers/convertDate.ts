/* eslint-disable no-else-return */
import moment from 'moment';
import {
  STANDARD_APP_DATE_FORMAT,
  STANDARD_APP_DATE_TIME_FORMAT,
  STANDARD_APP_TIME_FORMAT,
} from '../utils/format-date-time';

export const convertDate = (targetDate: string) => {
  let date = new Date(targetDate);

  date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  console.log(`${date.getFullYear()}-0${date.getMonth()}-${date.getDate()}`);
  console.log(date);

  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export const formatDate = (date: string | null): string => {
  if (date) {
    return moment(date).format(STANDARD_APP_DATE_FORMAT);
  } else {
    return '--';
  }
};

export const formatDateWithTime = (date: string | null) => {
  if (date) {
    return moment(date).format(STANDARD_APP_DATE_TIME_FORMAT);
  } else {
    return '--';
  }
};

export const formatDateTimeWithLocale = (date: string | null) => {
  if (date) {
    return moment(date).format('MMM DD, yyyy hh:mm A');
  } else {
    return '--';
  }
};

export const formatTime = (date: string | null) => {
  if (date) {
    return moment(date).format(STANDARD_APP_TIME_FORMAT);
  } else {
    return '--';
  }
};



export function calculateDurationFromDates(from: string, to: string): string {
  const fromDate = moment(from)
  const toDate = moment(to)

  const years = toDate.diff(fromDate, "years")
  const months = toDate.diff(fromDate.clone().add(years, "years"), "months")

  let parts: string[] = []
  if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`)
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`)

  return parts.length > 0 ? parts.join(" ") : "0 months"
}