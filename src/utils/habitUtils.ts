import { dateWithoutTime } from "./date";

interface DateCompleted {
  date: number;
  complete: boolean;
}

export const streakByDay = (habit: any, date: Date): number => {
  let _date = new Date(dateWithoutTime(date));

  let calendar = new Date(_date.getTime());

  let datesCompleted: any[] = habit.datesCompleted || [];
  datesCompleted.sort((o1: any, o2: any) => (o2.date - o1.date < 0 ? -1 : 1));
  let streak = 0;

  var BreakException = {};

  try {
    datesCompleted.forEach((item) => {
      let itemDate = item.date;

      if (itemDate <= _date.getTime()) {
        while (calendar.getTime() != itemDate) {
          calendar.setDate(calendar.getDate() - 1);

          if (calendar.getTime() == itemDate) break;

          if (plannedForDay(habit, calendar)) {
            return streak;
          }
        }
        if (item.complete) {
          streak++;
        } else if (
          itemDate != _date.getTime() &&
          plannedForDay(habit, new Date(itemDate))
        ) {
          throw BreakException;
        }
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }

  for (let index = 0; index < 10; index++) {
    let d = new Date();
    d.setDate(new Date().getDate() - index);
  }

  return streak;
};

export const plannedForDay = (habit: any, date: Date): boolean => {
  let weekday = date.getDay();
  return (habit.daysRepeat & Math.pow(weekday, 2)) === Math.pow(weekday, 2);
};

export const getDateCompleted = (habit: any, date: Date): DateCompleted => {
  let dateOfDayWithoutTime = dateWithoutTime(date);
  habit.datesCompleted = habit.datesCompleted || [];
  let datesCompleted: DateCompleted[] = habit.datesCompleted;
  let founds = datesCompleted.filter((d) => dateOfDayWithoutTime == d.date);
  let found = founds && founds.length ? founds[0] : null;

  if (found == null) {
    let newDateCompleted: DateCompleted = {
      date: dateOfDayWithoutTime,
      complete: false,
    };
    habit.datesCompleted.push(newDateCompleted);
    if (dateOfDayWithoutTime == dateWithoutTime(new Date()))
      habit.elapsedTime = 0;
    return newDateCompleted;
  }

  return found;
};

export const setStateForDay = (habit: any, state: boolean, date: Date) => {
  let dateCompleted = getDateCompleted(habit, date);
  dateCompleted.complete = state;
};

export const setDaysRepeat = (habit: any, daysRepeat: boolean[]) => {
  habit.daysRepeat = arrayRepeatToInt(daysRepeat);
};

export const isCompleteOnDay = (habit: any, date: Date): boolean => {
  return getDateCompleted(habit, date).complete;
};

export const arrayRepeatToInt = (daysRepeat: boolean[]): number => {
  let repeat = 0;
  daysRepeat.forEach((day, i) => {
    if (day) repeat += Math.pow(2, i);
  });

  return repeat;
};

export const getDaysRepeatAsArray = (habit: any): boolean[] => {
  let days = [false, false, false, false, false, false, false];
  days.forEach((day, i) => {
    days[i] = (habit.daysRepeat & Math.pow(2, i)) == Math.pow(2, i);
  });

  return days;
};
