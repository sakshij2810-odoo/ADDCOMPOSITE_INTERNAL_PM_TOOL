import dayjs from "dayjs";
import { DatePickerFormat } from "./format-time";


export const STANDARD_APP_DATE_FORMAT = "MM/DD/YYYY";
export const STANDARD_APP_TIME_FORMAT = "hh:mm A";
export const STANDARD_APP_DATE_TIME_FORMAT = "MM/DD/YYYY hh:mm A";


export const app_date_time_format = {
    standard_date: STANDARD_APP_DATE_FORMAT,
    standard_time: STANDARD_APP_TIME_FORMAT,
    standard_date_time: STANDARD_APP_DATE_TIME_FORMAT,

}

// standard output: MM/DD/YYYY
export function fDate(date: DatePickerFormat, format?: string) {
    if (!date) return null;
    const isValid = dayjs(date).isValid();

    return isValid ? dayjs(date).format(format ?? STANDARD_APP_DATE_FORMAT) : 'Invalid Date Value';
}

// custom Date Function
export function cDate(date: DatePickerFormat) {
    if (!date) return null;
    const isValid = dayjs(date).isValid();
    return isValid ? dayjs(date).format("MMM DD, YYYY") : 'Invalid Date Value';
}

const isISODate = (dateString: string) => {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;
    return isoRegex.test(dateString);
};
// // Example usage
// console.log(isISODate('2025-01-15T10:20:30Z')); // true
// console.log(isISODate('2025-01-15'));           // false
// console.log(isISODate('Invalid Date'));         // false

const isISOString = (val: string) => {
    const d = new Date(val);
    return !Number.isNaN(d.valueOf()) && d.toISOString() === val;

    //  OR
    //     const date = new Date(dateString);
    //   return date.toISOString() === dateString;
};
// // Example usage
// isISOString("2020-10-12T10:10:10.000Z"); // true
// isISOString("2020-10-12"); // false

// const isDayJsISODate = (dateString: string) => {
//     return dayjs(dateString, dayjs.ISO_8601, true).isValid();
// };
// Example usage
// console.log(isISODate('2025-01-15T10:20:30Z')); // true
// console.log(isISODate('2025-01-15'));           // false
// console.log(isISODate('Invalid Date'));         // false