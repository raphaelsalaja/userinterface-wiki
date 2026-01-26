"use client";

import { Popover } from "@base-ui/react/popover";
import chroma from "chroma-js";
import { getNearestPantone } from "pantone-tcx";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import styles from "./styles.module.css";

const DEFAULT_HEX = "#5A5B9F";

export function Timing() {
  const [isSnappy, setIsSnappy] = useState(true);
  const [colorHex, setColorHex] = useState(DEFAULT_HEX);

  useEffect(() => {
    setColorHex(chroma.random().hex());
  }, []);

  const pantone = getNearestPantone(colorHex);

  const hex = chroma(pantone.hex).hex().toUpperCase();
  const _hsl = chroma(pantone.hex)
    .hsl()
    .map((v) => v.toFixed(2))
    .join(", ");
  const lab = chroma(pantone.hex)
    .lab()
    .map((v) => v.toFixed(2))
    .join(", ");

  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <Popover.Root>
          <Popover.Trigger
            className={styles.trigger}
            style={{ "--hex": hex } as React.CSSProperties}
          >
            <div className={styles.swatch} />
            <span className={styles.label}>{pantone.name}</span>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={16} side="top">
              <Popover.Popup
                className={styles.popup}
                data-animation-state={isSnappy ? "snappy" : "sluggish"}
                style={{ "--hex": hex } as React.CSSProperties}
              >
                <Popover.Title className={styles.title}>
                  PANTONE® {pantone.tcx} TCX
                </Popover.Title>
                <hr className={styles.divider} />
                <Popover.Description className={styles.description}>
                  <span>HEX</span>
                  <span>{hex}</span>
                  <span>LAB</span>
                  <span>{lab}</span>
                </Popover.Description>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <Controls>
        <Button onClick={() => setIsSnappy((prev) => !prev)}>
          {isSnappy ? "Snappy (120ms)" : "Sluggish (800ms)"}
        </Button>
      </Controls>
    </div>
  );
}
