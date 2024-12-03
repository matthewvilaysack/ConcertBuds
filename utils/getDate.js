export const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00'); // Add time component to preserve local date
  const dayOfWeek = date.toLocaleString("en-US", { weekday: "short" });
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return { dayOfWeek, month, day, year };
};
