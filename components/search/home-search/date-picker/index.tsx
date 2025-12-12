import { DayPicker } from "react-day-picker";

import styles from "./styles.module.css";

export interface DatePickerSectionProps {
  dateType: "before" | "after" | "during";
  isNegated: boolean;
  onSelect: (
    date: Date,
    dateType: "before" | "after" | "during",
    isNegated: boolean,
  ) => void;
}

export function DatePickerSection({
  dateType,
  isNegated,
  onSelect,
}: DatePickerSectionProps) {
  return (
    <div className={styles.datepicker}>
      <DayPicker
        mode="single"
        onSelect={(date) => {
          if (date) {
            onSelect(date, dateType, isNegated);
          }
        }}
      />
    </div>
  );
}
