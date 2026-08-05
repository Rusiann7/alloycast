// app/helpers/dashboardHelpers.js

/**
 * Aggregates POS revenue into chart data points based on date range.
 */
export const aggregateRevenue = (posData, dateRange, currentYear) => {
  let sumRev = 0;
  
  // For daily views, it groups items by date strings ("YYYY-MM-DD")
  // and aggregates the total revenue for each day.
  const dailyRevenue = {};
  posData.forEach((res) => {
    if (res.Inventory?.price) {
      const rev = res.quantity * res.Inventory.price;
      sumRev += rev;
      const dateStr = res.created_at.split("T")[0];
      dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + rev;
    }
  });

  // Sorts the accumulated daily revenue data chronologically,
  // formats the date labels nicely (like "Mar 14"),
  // and outputs the complete structured dataset.
  const chartData = Object.keys(dailyRevenue)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((dateStr) => ({
      name: new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      }),
      revenue: dailyRevenue[dateStr],
    }));
  return { totalRevenue: sumRev, chartData };
};

/**
 * Computes top-selling product percentages from POS records.
 */
export const computeTopProducts = (posData, limit = 5) => {
  const productCounts = {};
  let totalReserved = 0;

  // Iterates through every entry.
  // If the linked product asset data exists,
  // it maps its total quantities to its name and adds to the total volume tracker.
  posData.forEach((res) => {
    const name = res.Inventory?.item_name;
    if (name) {
      productCounts[name] = (productCounts[name] || 0) + res.quantity;
      totalReserved += res.quantity;
    }
  });

  // Maps the product data into an array with relative market percentages,
  // sorts them from highest volume to lowest,
  // and returns only the top entries based on your limit (e.g., top 5)
  return Object.keys(productCounts)
    .map((name) => ({
      name,
      units: productCounts[name],
      percentage:
        totalReserved > 0
          ? Math.round((productCounts[name] / totalReserved) * 100)
          : 0,
    }))
    .sort((a, b) => b.units - a.units)
    .slice(0, limit);
};

/**
 * Merges activity ledger reservations with customer profile lookups.
 */
export const mergeCustomerDetails = (activityData, customerData) => {
  // Performs an in-memory merge of your reservation and customer tables using a lookup loop.
  // This links user profiles directly to reservation logs
  // without running heavy database query combinations.
  if (!activityData || !customerData) return [];
  return activityData.map((res) => {
    const customer = customerData.find((c) => c.user_id === res.user_id);
    return {
      ...res,
      customer_name: customer
        ? `${customer.firstname} ${customer.lastname}`
        : "Unknown Customer",
      customer_email: res.Users?.email || "No Email Provided",
    };
  });
};
