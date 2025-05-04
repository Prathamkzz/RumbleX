// utils.js
import dayjs from 'dayjs';

// Function to add suffix (st, nd, rd, th) to the day of the month
const getDayWithSuffix = (day) => {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const mod = day % 10;
  const exception = (day % 100 >= 11 && day % 100 <= 13) ? 0 : mod;
  return `${day}${suffix[exception] || suffix[0]}`;
};

// Function to format the date as "11th MAY 2025"
export const formatDate = (dateString) => {
  const date = dayjs(dateString);
  const dayWithSuffix = getDayWithSuffix(date.date());
  const formattedDate = `${dayWithSuffix} ${date.format('MMMM YYYY').toUpperCase()}`;
  return formattedDate;
};
