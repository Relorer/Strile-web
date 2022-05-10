import { dateWithoutTime } from "../utils/date";
import DaysMenuItem from "./DaysMenuItem";

const DaysMenu = (dates: Date[], selected: number) =>
  dates.map((el, index) => {
    return (
      <DaysMenuItem
        date={el}
        key={dateWithoutTime(el).toString()}
        selected={selected == index}
      />
    );
  });

export default DaysMenu;
