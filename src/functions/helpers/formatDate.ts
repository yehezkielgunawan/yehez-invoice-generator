export const formatDate = (date: string | Date, time: boolean = true) => {
  const convertedDate = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const optionsWithoutTime: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return convertedDate.toLocaleDateString(
    "en-EN",
    time ? options : optionsWithoutTime,
  );
};
