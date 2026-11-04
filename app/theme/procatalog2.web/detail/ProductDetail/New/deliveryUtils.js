// Helper to calculate delivery dates dynamically based on stock status

export function getDeliveryInfo(singleProd, singleProd1, stockItemArr) {
  const isInStock = Boolean(
    singleProd?.IsInReadyStock === 1 ||
      singleProd1?.IsInReadyStock === 1 ||
      singleProd?.IsInStock === 1 ||
      singleProd1?.IsInStock === 1 ||
      (Array.isArray(stockItemArr) &&
        stockItemArr.length > 0 &&
        stockItemArr[0]?.stat_code !== 1005)
  );

  const now = new Date();

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fullMonthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (isInStock) {
    // Delivery under 7 days: 5 to 7 days from current date
    const dStart = new Date(now);
    dStart.setDate(now.getDate() + 5);

    const dEnd = new Date(now);
    dEnd.setDate(now.getDate() + 7);

    let rangeStr = "";
    if (dStart.getMonth() === dEnd.getMonth()) {
      rangeStr = `${fullMonthNames[dStart.getMonth()]} ${getOrdinal(
        dStart.getDate()
      )}–${getOrdinal(dEnd.getDate())}`;
    } else {
      rangeStr = `${monthNames[dStart.getMonth()]} ${getOrdinal(
        dStart.getDate()
      )} – ${monthNames[dEnd.getMonth()]} ${getOrdinal(dEnd.getDate())}`;
    }

    const shipByStr = `${dayNames[dEnd.getDay()]}, ${
      monthNames[dEnd.getMonth()]
    } ${dEnd.getDate()}`;

    return {
      isInStock: true,
      dateRangeStr: rangeStr,
      shipByStr: shipByStr,
    };
  } else {
    // Make to order: 15 days from current date
    const dMake = new Date(now);
    dMake.setDate(now.getDate() + 15);

    const dateOrdinalStr = `${fullMonthNames[dMake.getMonth()]} ${getOrdinal(
      dMake.getDate()
    )}`;
    const shipByStr = `${dayNames[dMake.getDay()]}, ${
      monthNames[dMake.getMonth()]
    } ${dMake.getDate()}`;

    return {
      isInStock: false,
      dateRangeStr: dateOrdinalStr,
      shipByStr: shipByStr,
    };
  }
}
