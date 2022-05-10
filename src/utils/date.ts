export const nowWithoutTime = () => {
  let date = new Date(Date.now());
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const dateWithoutTime = (date: Date) => {
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const getWeekDays = (
  locale: string,
  type: "short" | "long"
): string[] => {
  var baseDate = new Date(Date.UTC(2017, 0, 2)); // just a Monday
  var weekDays = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(baseDate.toLocaleDateString(locale, { weekday: type }));
    baseDate.setDate(baseDate.getDate() + 1);
  }
  return weekDays;
};
