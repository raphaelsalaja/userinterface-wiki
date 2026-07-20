"use client";

import { Calligraph } from "calligraph";
import { useState } from "react";
import { Button } from "@/components/primitives/button";
import { Controls } from "@/components/primitives/controls";
import styles from "./styles.module.css";

interface DataRow {
  label: string;
  raw: string;
  chunked: string;
}

const DATA: DataRow[] = [
  { label: "Phone", raw: "4158675309", chunked: "415-867-5309" },
  { label: "Card", raw: "4532015112830366", chunked: "4532 0151 1283 0366" },
  { label: "Social", raw: "123456789", chunked: "123-45-6789" },
  { label: "Serial", raw: "AX7B2K9M4R", chunked: "AX7B-2K9M-4R" },
  { label: "Currency", raw: "1234567890", chunked: "$1,234,567,890.00" },
];

export function MillersLaw() {
  const [chunked, setChunked] = useState(true);

  return (
    <div className={styles.container}>
      <Controls position="bottom">
        <Button onClick={() => setChunked(!chunked)} data-active={chunked}>
          <Calligraph drift={{ x: 1 }}>
            {chunked ? "Raw" : "Readable"}
          </Calligraph>
        </Button>
      </Controls>

      <div className={styles.list}>
        {DATA.map((row) => (
          <div key={row.label} className={styles.row}>
            <span className={styles.label}>{row.label}</span>
            <Calligraph className={styles.value}>
              {chunked ? row.chunked : row.raw}
            </Calligraph>
          </div>
        ))}
      </div>
    </div>
  );
}
