// app/utils/dateBounds.js

/**
 * Calculates start and end dates based on a relative range string.
 * @param {string} dateRange - e.g., "Last 7 Days", "This Month", "Last Month", "Annual"
 * @returns {{ startDate: Date, endDate: Date }}
 */
export const getDateBounds = (dateRange) => {
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();

  switch (dateRange) {
    case "Last 7 Days":
      startDate.setDate(now.getDate() - 7);
      break;
    case "This Month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "Last Month":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      break;
    case "Annual":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      break;
    default:
      startDate.setDate(now.getDate() - 30);
  }
  return { startDate, endDate };
};
