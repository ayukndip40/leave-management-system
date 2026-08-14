export const formatDate = (
  date: string | Date
): string => {

  const value = new Date(date);

  return value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

};

export const formatShortDate = (
  date: string | Date
): string => {

  const value = new Date(date);

  return value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

};

export const formatDateRange = (
  startDate: string | Date,
  endDate: string | Date
): string => {

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    start.getFullYear() === end.getFullYear()
  ) {

    return `${formatShortDate(start)} → ${formatDate(end)}`;

  }

  return `${formatDate(start)} → ${formatDate(end)}`;

};