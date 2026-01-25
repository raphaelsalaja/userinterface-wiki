"use client";

import { useState } from "react";
import {
  type IconName,
  iconNames,
  MorphingIcon,
  type SpringPreset,
} from "@/components/morphing-icon";
import styles from "./styles.module.css";

interface SequenceItem {
  id: string;
  icon: IconName;
}

const springPresetOptions: SpringPreset[] = ["snappy", "smooth", "bouncy"];

let sequenceCounter = 0;

export default function MorphingIconsTestPage() {
  const [currentIcon, setCurrentIcon] = useState<IconName>("menu");
  const [spring, setSpring] = useState<SpringPreset>("smooth");
  const [sequence, setSequence] = useState<SequenceItem[]>([]);

  const handleIconClick = (icon: IconName) => {
    setCurrentIcon(icon);
  };

  const handleAddToSequence = (icon: IconName) => {
    sequenceCounter += 1;
    setSequence((prev) => [...prev, { id: `seq-${sequenceCounter}`, icon }]);
  };

  const handleClearSequence = () => {
    setSequence([]);
  };

  const handlePlaySequence = () => {
    if (sequence.length === 0) return;

    let index = 0;
    setCurrentIcon(sequence[0].icon);

    const interval = setInterval(() => {
      index = (index + 1) % sequence.length;
      setCurrentIcon(sequence[index].icon);
    }, 800);

    // Store interval ID for cleanup
    return () => clearInterval(interval);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Morphing Icons</h1>
        <p className={styles.description}>
          Click any icon to morph. Icons in the same rotation group (arrows,
          chevrons) rotate smoothly. Cross-group transitions morph coordinates.
        </p>
      </header>

      <section className={styles.preview}>
        <div className={styles["preview-icon"]}>
          <MorphingIcon
            icon={currentIcon}
            size={64}
            strokeWidth={2}
            spring={spring}
          />
        </div>
        <span className={styles["preview-label"]}>{currentIcon}</span>
        <div className={styles["spring-controls"]}>
          {springPresetOptions.map((preset) => (
            <button
              key={preset}
              type="button"
              className={styles["spring-button"]}
              data-active={spring === preset}
              onClick={() => setSpring(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.grid}>
        {iconNames.map((icon) => (
          <button
            key={icon}
            type="button"
            className={styles["icon-button"]}
            data-active={currentIcon === icon}
            onClick={() => handleIconClick(icon)}
            onDoubleClick={() => handleAddToSequence(icon)}
          >
            <MorphingIcon icon={icon} size={20} spring={spring} />
            <span className={styles["icon-label"]}>{icon}</span>
          </button>
        ))}
      </section>

      <section className={styles.sequencer}>
        <div className={styles["sequencer-header"]}>
          <h2 className={styles["sequencer-title"]}>Sequencer</h2>
          <p className={styles["sequencer-hint"]}>
            Double-click icons to add to sequence
          </p>
        </div>

        <div className={styles["sequence-track"]}>
          {sequence.length === 0 ? (
            <span className={styles["sequence-empty"]}>
              No icons in sequence
            </span>
          ) : (
            sequence.map((item) => (
              <div key={item.id} className={styles["sequence-item"]}>
                <MorphingIcon icon={item.icon} size={16} />
              </div>
            ))
          )}
        </div>

        <div className={styles["sequencer-controls"]}>
          <button
            type="button"
            className={styles.button}
            onClick={handlePlaySequence}
            disabled={sequence.length === 0}
          >
            Play
          </button>
          <button
            type="button"
            className={styles.button}
            data-variant="secondary"
            onClick={handleClearSequence}
            disabled={sequence.length === 0}
          >
            Clear
          </button>
        </div>
      </section>
    </div>
  );
}
