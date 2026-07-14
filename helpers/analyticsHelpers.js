/**
 * Calculates in-store POS revenue and potential reservation revenue.
 */

// Defines a pure function that isolates the direct comparison of your two distinct
// income pipelines (completed point-of-sale store purchases vs. pending/committed web reservations).
// Providing empty array defaults prevents runtime application crashes
// if a network request occasionally returns a null response.
export const calculateChannelRevenues = (
  // [] fallbacks for undefined results
  postData = [],
  reservationData = [],
) => {
  // Instantiates local accumulator variables to hold tracking numbers in memory
  // before the loops begin summing up your database figures.
  let posRevenue = 0;
  let approvedReservationRevenue = 0;

  // Iterates over actual completed sales transactions.
  // Optional chaining (Inventory?.price) serves as a critical structural safeguard,
  // ensuring that if an old model item gets wiped or archived out of your database,
  // your dashboard safely skips it instead of throwing a total page error.
  postData.forEach((item) => {
    if (item.Inventory?.price) {
      posRevenue += item.quantity * item.Inventory.price;
    }
  });

  // Isolates your pending reservation data pool.
  // It screens out canceled, declined, or sitting requests, calculating strictly
  // what inventory is currently committed to valid, physically approved client pick-up requests.
  reservationData.forEach((res) => {
    if (res.Inventory.price && res.status === "Approved") {
      approvedReservationRevenue += res.quantity * res.Inventory.price;
    }
  });

  // Packages both financial calculations cleanly into an organized data object,
  // ready to be immediately un-packaged by the view page layout via structural destructuring.
  return { posRevenue, approvedReservationRevenue };
};

/**
 * Aggregates POS revenue based on date range (Annual or daily).
 */
export const aggregateRevenueChartData = (posData = [], dateRange) => {
  // Allocates an empty tracking dictionary (aggregatedRevenue)
  // to handle arbitrary dates dynamically alongside
  //  a running gross baseline variable to feed your primary high-level numeric metrics.
  const aggregatedRevenue = {};
  let totalRevenue = 0;

  // Tallies up individual order row lines into a single master financial value
  // used to draw your primary statistical dashboard cards.
  posData.forEach((res) => {
    if (res.Inventory?.price) {
      const rev = res.quantity * res.Inventory.price;
      totalRevenue += rev;

      // Dynamically switches data organization modes.
      // If viewing a complete year, it extracts and groups timestamps by month strings (YYYY-MM).
      // For shorter focus windows (7 Days or current Month), it drops the precise hours/minutes
      // and groups rows using clean calendar days (YYYY-MM-DD).
      let groupKey;
      if (dateRange === "Annual") {
        const dateObj = new Date(res.created_at);
        groupKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
      } else {
        groupKey = res.created_at.split("T")[0];
      }
      // Uses a short-circuit lookup tool to build out your timeline.
      // If a calendar date is hit for the first time, it initializes it at zero
      // before appending the cash value; if the day already has transactions,
      // it cleanly increments the ongoing daily value.
      aggregatedRevenue[groupKey] = (aggregatedRevenue[groupKey] || 0) + rev;
    }
  });

  // Re-orders your grouped date values.
  // Because network data tables don't guarantee strict sequential chronological delivery,
  // this step ensures your final Recharts graph timeline line flows smoothly from left to right
  // instead of jumping erratically between dates.
  const chartData = Object.keys(aggregatedRevenue)
    .sort((a, b) => new Date(a) - new Date(b))
    // Transforms internal database coordinate keys into beautiful user-facing dashboard names.
    // It maps technical string lookups into abbreviated local text keys like "Jan", "Feb", or "Oct 14".
    .map((key) => {
      if (dateRange === "Annual") {
        const [year, month] = key.split("-");
        return {
          name: new Date(year, month - 1).toLocaleDateString("en-US", {
            month: "short",
          }),
          revenue: aggregatedRevenue[key],
        };
      } else {
        return {
          name: new Date(key).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          }),
          revenue: aggregatedRevenue[key],
        };
      }
    });

  // Solves an empty-data rendering issue common in charts.
  // If your diecast store had no sales in Month,
  // standard databases simply skip returning records for that timeframe.
  // This loop forces all 12 calendar months to appear on your chart axis,
  // padding empty periods with a zero value so your line charts stay continuous and accurate.
  if (dateRange === "Annual") {
    const fullYearData = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(currentYear, i).toLocaleDateString("en-US", {
        month: "short",
      });
      const existingMonth = chartData.find((d) => d.name === monthName);
      fullYearData.push(existingMonth || { name: monthName, revenue: 0 });
    }
    return { totalRevenue, chartData: fullYearData };
  }
  // Finalizes data aggregation output,
  // delivering cleanly plotted tracking points back to your client interface.
  return { totalRevenue, chartData };
};

/**
 * Processes reservation data to find top-selling and low-selling items.
 */
export const computeProductStats = (
  reservationData = [],
  posData = [],
  inventoryData = [],
  limit = 6,
) => {
  // Sets up local variables to calculate relative physical sales metrics,
  // tracking individual unit totals alongside overall inventory velocity.
  const productCounts = {};
  let totalReserved = 0;

  // Initialize all inventory items with 0 sales to include them in the statistics
  inventoryData.forEach((item) => {
    if (item.item_name) {
      productCounts[item.item_name] = 0;
    }
  });

  // Aggregates order quantities by individual scale model item names from Reservation
  reservationData.forEach((res) => {
    const name = res.Inventory?.item_name;
    if (name) {
      productCounts[name] = (productCounts[name] || 0) + res.quantity;
      totalReserved += res.quantity;
    }
  });

  // Aggregates order quantities by individual scale model item names from POS
  posData.forEach((pos) => {
    const name = pos.Inventory?.item_name;
    if (name) {
      productCounts[name] = (productCounts[name] || 0) + pos.quantity;
      totalReserved += pos.quantity;
    }
  });

  // Builds an analytics-ready dataset. It maps product keys to readable objects,
  // computes their exact market share percentage, and sorts the entire catalog
  // from highest volume to lowest.
  const sortedProducts = Object.keys(productCounts)
    .map((name) => ({
      name,
      units: productCounts[name],
      percentage:
        totalReserved > 0
          ? Math.round((productCounts[name] / totalReserved) * 100)
          : 0,
    }))
    .sort((a, b) => b.units - a.units);

  // Simultaneously derives your high and low performance brackets from the same pre-sorted dataset.
  // Top Selling Products must have at least 5 orders and never 0 orders.
  const topProducts = sortedProducts.filter((p) => p.units >= 5).slice(0, limit);
  // Low Selling Products must have 0 or 1 orders.
  const lowProducts = [...sortedProducts]
    .reverse()
    .filter((p) => p.units <= 1)
    .slice(0, limit);

  return { topProducts, lowProducts };
};

/**
 * Computes market share percentage by product brand.
 */

export const aggregateBrandMarketShare = (
  reservationData = [],
  brandColors = [],
) => {
  // Prepares structural tracking dictionaries to group diecast inventory analytics specifically
  // by brand manufacturing lines (e.g., Hot Wheels, Matchbox, Inno64) instead of individual item models.
  const brandCounts = {};
  let brandTotal = 0;

  // Tallies total units ordered under each distinct brand column tag
  // to calculate their performance metrics.
  reservationData.forEach((res) => {
    const brand = res.Inventory?.brand;
    if (brand) {
      brandCounts[brand] = (brandCounts[brand] || 0) + res.quantity;
      brandTotal += res.quantity;
    }
  });

  // Converts your grouped brand metrics into a standardized format optimized for Recharts Pie slices.
  // The modulo operator assignment (index % brandColors.length) loops through your style palette
  // infinitely, applying clean accent colors even if your inventory expands to include more unique
  // brands than your color theme has colors.
  return Object.keys(brandCounts)
    .map((brand, index) => ({
      name: brand,
      units: brandCounts[brand],
      percentage:
        brandTotal > 0
          ? Math.round((brandCounts[brand] / brandTotal) * 100)
          : 0,
      color: brandColors[index % brandColors.length] || "#94A3B8",
    }))
    .sort((a, b) => b.units - a.units);
};

/**
 * Computes counts for each fulfillment status pipeline state.
 */
export const aggregatePipelineCounts = (reservationData = []) => {
  // Generates a strict, hard-coded baseline object mapping all valid legal status lifecycle states
  // your database system accepts. This guarantees that your UI metric cards always render safely
  // with a zero value even if there are currently no records for a specific state.
  const statusCounts = {
    Pending: 0,
    Approved: 0,
    Declined: 0,
    Cancelled: 0,
  };

  // Loops over order listings, dynamically matching values to your status keys.
  // The safety check hasOwnProperty filters out any unexpected database inputs,
  // protecting your dashboard from processing corrupted metadata tags.
  reservationData.forEach((res) => {
    const status = res.status || "Pending";
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status] += 1;
    }
  });

  // Ships the finalized operational status pipeline counts back out to drive your UI progress bars
  // and metrics tracking display cards.
  return statusCounts;
};
