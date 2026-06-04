// app/helpers/dashboardHelpers.js

/**
 * Aggregates POS revenue into chart data points based on date range.
 */
export const aggregateRevenue = (posData, dateRange, currentYear) => {
  let sumRev = 0;

  if (dateRange === "Annual") {
    const monthlyRevenue = {};
    posData.forEach((res) => {
      if (res.Inventory?.price) {
        const rev = res.quantity * res.Inventory.price;
        sumRev += rev;
        const d = new Date(res.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthlyRevenue[key] = (monthlyRevenue[key] || 0) + rev;
      }
    });

    const chartData = [];
    for (let m = 0; m < 12; m++) {
      const key = `${currentYear}-${String(m + 1).padStart(2, "0")}`;
      const monthName = new Date(currentYear, m, 1).toLocaleDateString(
        "en-US",
        { month: "short" },
      );
      chartData.push({ name: monthName, revenue: monthlyRevenue[key] || 0 });
    }
    return { totalRevenue: sumRev, chartData };
  } else {
    const dailyRevenue = {};
    posData.forEach((res) => {
      if (res.Inventory?.price) {
        const rev = res.quantity * res.Inventory.price;
        sumRev += rev;
        const dateStr = res.created_at.split("T")[0];
        dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + rev;
      }
    });

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
  }
};

/**
 * Computes top-selling product percentages from POS records.
 */
export const computeTopProducts = (posData, limit = 5) => {
  const productCounts = {};
  let totalReserved = 0;

  posData.forEach((res) => {
    const name = res.Inventory?.item_name;
    if (name) {
      productCounts[name] = (productCounts[name] || 0) + res.quantity;
      totalReserved += res.quantity;
    }
  });

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
