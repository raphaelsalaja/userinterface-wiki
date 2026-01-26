"use client";

import { useEffect, useRef, useState } from "react";
import Snd from "snd-lib";
import { Button } from "@/components/button";
import styles from "./styles.module.css";

export function ButtonSoundDemo() {
  const sndRef = useRef<Snd | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const snd = new Snd();
    sndRef.current = snd;

    snd.load(Snd.KITS.SND01).then(() => {
      setIsLoaded(true);
    });

    return () => {
      sndRef.current = null;
    };
  }, []);

  const handleSoundClick = () => {
    if (sndRef.current && isLoaded) {
      sndRef.current.play(Snd.SOUNDS.TAP);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <Button sound={false} data-variant="silent">
          Click Me
        </Button>
      </div>

      <div className={styles.divider} />

      <div className={styles.column}>
        <Button data-variant="sound" onClick={handleSoundClick}>
          Click Me
        </Button>
      </div>
    </div>
  );
}
