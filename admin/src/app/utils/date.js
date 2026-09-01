// expectedDelivery is a calendar date stored at UTC midnight, so it must be
// read and rendered in UTC. Formatting it in local time would shift it to the
// previous day for anyone behind UTC.

// "2026-09-15T00:00:00.000Z" -> "2026-09-15", the format <input type="date"> needs.
export const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

// "2026-09-15" -> "Sep 15, 2026"
export const formatDeliveryDate = (value) => {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};
