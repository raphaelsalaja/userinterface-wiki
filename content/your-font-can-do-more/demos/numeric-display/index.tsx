"use client";

import { useState } from "react";
import styles from "./styles.module.css";

interface NumericOption {
  id: string;
  label: string;
  property: string;
  value: string;
}

const OPTIONS: NumericOption[] = [
  {
    id: "opt-default",
    label: "Default",
    property: "fontVariantNumeric",
    value: "normal",
  },
  {
    id: "opt-tabular",
    label: "Tabular",
    property: "fontVariantNumeric",
    value: "tabular-nums",
  },
  {
    id: "opt-proportional",
    label: "Proportional",
    property: "fontVariantNumeric",
    value: "proportional-nums",
  },
  {
    id: "opt-oldstyle",
    label: "Oldstyle",
    property: "fontVariantNumeric",
    value: "oldstyle-nums",
  },
  {
    id: "opt-lining",
    label: "Lining",
    property: "fontVariantNumeric",
    value: "lining-nums",
  },
  {
    id: "opt-slashed",
    label: "Slashed Zero",
    property: "fontVariantNumeric",
    value: "slashed-zero",
  },
  {
    id: "opt-fraction",
    label: "Fractions",
    property: "fontVariantNumeric",
    value: "diagonal-fractions",
  },
  {
    id: "opt-ordinal",
    label: "Ordinal",
    property: "fontVariantNumeric",
    value: "ordinal",
  },
];

interface DataRow {
  id: string;
  label: string;
  value: string;
  secondary: string;
}

const DATA: DataRow[] = [
  {
    id: "row-revenue",
    label: "Revenue",
    value: "$1,240,000.00",
    secondary: "+12.4%",
  },
  {
    id: "row-users",
    label: "Active Users",
    value: "3,084,901",
    secondary: "+8.1%",
  },
  { id: "row-orders", label: "Orders", value: "104,330", secondary: "−2.0%" },
  { id: "row-avg", label: "Avg. Order", value: "$11.89", secondary: "+0.3%" },
  { id: "row-conv", label: "Conversion", value: "3/50", secondary: "6.0%" },
  {
    id: "row-rank",
    label: "Ranking",
    value: "1st of 100",
    secondary: "Top 1%",
  },
];

export function NumericDisplay() {
  const [active, setActive] = useState("opt-tabular");

  const current = OPTIONS.find((o) => o.id === active);
  const numericStyle: React.CSSProperties = current
    ? { [current.property]: current.value }
    : {};

  return (
    <div className={styles.container}>
      <div className={styles.pills}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={styles.pill}
            data-active={active === opt.id}
            onClick={() => setActive(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className={styles.table} style={numericStyle}>
        {DATA.map((row) => (
          <div key={row.id} className={styles.row}>
            <span className={styles.label}>{row.label}</span>
            <div className={styles.values}>
              <span className={styles.value}>{row.value}</span>
              <span className={styles.secondary}>{row.secondary}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.output}>
        <code className={styles["output-code"]}>
          {`font-variant-numeric: ${current?.value ?? "normal"};`}
        </code>
      </div>
    </div>
  );
}
