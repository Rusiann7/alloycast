// app/utils/dateBounds.js

/**
 * Calculates start and end dates based on a relative range string.
 * @param {string} dateRange - e.g., "Last 7 Days", "This Month", "Last Month", "Annual"
 * @returns {{ startDate: Date, endDate: Date }}
 */
export const getDateBounds = (dateRange) => {
  // dateRange = "Last 7 Days/This Month/Last Month/Annual"
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();

  switch (dateRange) {
    case "Last 7 Days":
      startDate.setDate(now.getDate() - 7); // today - 7 days
      break;
    case "This Month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // start from day 1 of current calendar year & month
      break;
    case "Last Month":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1); // 1st day of previous month
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59); // last day of previous month
      break;
    case "Annual":
      startDate = new Date(now.getFullYear(), 0, 1); // January 1st
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59); // December 31th
      break;
    default:
      startDate.setDate(now.getDate() - 30); // previous 30 days from current day & date
  }
  return { startDate, endDate };
};
