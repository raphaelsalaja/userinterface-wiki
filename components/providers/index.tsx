import type { LenisRef } from "lenis/react";
import { ReactLenis } from "lenis/react";
import { cancelFrame, frame } from "motion/react";
import React, { useEffect, useRef } from "react";

const LenisProvider = () => {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  return <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />;
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <LenisProvider />
      {children}
    </React.Fragment>
  );
};
