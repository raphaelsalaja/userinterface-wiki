"use client";

import { Calligraph } from "calligraph";
import { ForesightManager } from "js.foresight";
import { motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import styles from "./styles.module.css";

const FAKE_LATENCY = 800;
const TRAIL_LENGTH = 8;
const PREDICTION_TIME = 120;
const TILES = ["Home", "About", "Blog", "Docs", "Pricing", "Contact"];

interface Point {
  x: number;
  y: number;
  t: number;
}

function predictTrajectory(trail: Point[]) {
  if (trail.length < 3) return null;
  const oldest = trail[0];
  const newest = trail[trail.length - 1];
  const dt = newest.t - oldest.t;
  if (dt < 1) return null;
  const vx = (newest.x - oldest.x) / dt;
  const vy = (newest.y - oldest.y) / dt;
  const speed = Math.sqrt(vx * vx + vy * vy);
  if (speed < 0.05) return null;
  return {
    x: newest.x + vx * PREDICTION_TIME,
    y: newest.y + vy * PREDICTION_TIME,
    speed,
  };
}

type LanePhase = "idle" | "prefetching" | "ready" | "loading" | "done";

interface Lane {
  phase: LanePhase;
  prefetched: number;
  duration: number;
  elapsed: number | null;
}

const INITIAL_LANE: Lane = {
  phase: "idle",
  prefetched: 0,
  duration: 0,
  elapsed: null,
};

function laneLabel(lane: Lane) {
  if (lane.phase === "done" && lane.elapsed != null) return `${lane.elapsed}ms`;
  switch (lane.phase) {
    case "prefetching":
      return "FETCHING";
    case "ready":
      return "READY";
    case "loading":
      return "WAITING";
    default:
      return "IDLE";
  }
}

function LaneBar({ lane }: { lane: Lane }) {
  if (lane.phase === "idle") {
    return <div className={styles["bar-track"]} />;
  }

  if (lane.phase === "prefetching" || lane.phase === "ready") {
    return (
      <div className={styles["bar-track"]}>
        <div
          className={styles["bar-prefetch-anim"]}
          style={
            lane.phase === "prefetching"
              ? {
                  transform: "scaleX(1)",
                  transition: `transform ${FAKE_LATENCY}ms linear`,
                }
              : { transform: "scaleX(1)" }
          }
        />
      </div>
    );
  }

  const prefetchPct = `${lane.prefetched * 100}%`;

  return (
    <div className={styles["bar-track"]}>
      <div
        className={styles["bar-prefetched"]}
        style={{ width: prefetchPct }}
      />
      {lane.prefetched < 1 && (
        <div className={styles["bar-remaining"]} style={{ left: prefetchPct }}>
          <div
            className={styles["bar-remaining-fill"]}
            data-phase={lane.phase}
            style={
              lane.phase === "loading"
                ? {
                    transform: "scaleX(1)",
                    transition: `transform ${lane.duration}ms linear`,
                  }
                : { transform: "scaleX(1)" }
            }
          />
        </div>
      )}
    </div>
  );
}

export function PredictionComparison() {
  const [clickLane, setClickLane] = useState<Lane>(INITIAL_LANE);
  const [hoverLane, setHoverLane] = useState<Lane>(INITIAL_LANE);
  const [predictLane, setPredictLane] = useState<Lane>(INITIAL_LANE);
  const [racing, setRacing] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const genRef = useRef(0);

  const tileRefs = useRef<(HTMLElement | null)[]>(
    new Array(TILES.length).fill(null),
  );
  const [predictedTiles, setPredictedTiles] = useState<Set<number>>(
    new Set(),
  );
  const [clickedTile, setClickedTile] = useState<number | null>(null);

  const predictionTimesRef = useRef<Record<number, number>>({});
  const hoverTimesRef = useRef<Record<number, number>>({});
  const hoverPrefetchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const predictPrefetchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastHoveredRef = useRef<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<Point[]>([]);
  const [active, setActive] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const predX = useMotionValue(0);
  const predY = useMotionValue(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: resetKey triggers re-registration
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    for (let i = 0; i < TILES.length; i++) {
      const el = tileRefs.current[i];
      if (!el) continue;
      ForesightManager.instance.register({
        element: el,
        callback: () => {
          predictionTimesRef.current[i] = performance.now();
          setPredictedTiles((prev) => new Set(prev).add(i));
          clearTimeout(predictPrefetchTimer.current);
          setPredictLane({
            phase: "prefetching",
            prefetched: 0,
            duration: FAKE_LATENCY,
            elapsed: null,
          });
          predictPrefetchTimer.current = setTimeout(() => {
            setPredictLane((prev) => ({ ...prev, phase: "ready" }));
          }, FAKE_LATENCY);
        },
        hitSlop: 20,
        name: `tile-${i}`,
      });
      cleanups.push(() => ForesightManager.instance.unregister(el));
    }
    return () => {
      for (const fn of cleanups) fn();
    };
  }, [resetKey]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const container = el;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    function handleMove(e: MouseEvent) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const t = performance.now();

      cursorX.set(x);
      cursorY.set(y);
      setActive(true);

      trailRef.current.push({ x, y, t });
      if (trailRef.current.length > TRAIL_LENGTH) trailRef.current.shift();

      const pred = predictTrajectory(trailRef.current);
      if (pred) {
        predX.set(pred.x);
        predY.set(pred.y);
      } else {
        predX.set(x);
        predY.set(y);
      }

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        predX.set(cursorX.get());
        predY.set(cursorY.get());
        trailRef.current = [];
      }, 80);
    }

    function handleLeave() {
      if (idleTimer) clearTimeout(idleTimer);
      setActive(false);
      trailRef.current = [];
    }

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave);
    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, [cursorX, cursorY, predX, predY]);

  function handleTileEnter(i: number) {
    if (racing) return;
    hoverTimesRef.current[i] = performance.now();
    if (lastHoveredRef.current !== i) {
      lastHoveredRef.current = i;
      clearTimeout(hoverPrefetchTimer.current);
      setHoverLane({
        phase: "prefetching",
        prefetched: 0,
        duration: FAKE_LATENCY,
        elapsed: null,
      });
      hoverPrefetchTimer.current = setTimeout(() => {
        setHoverLane((prev) => ({ ...prev, phase: "ready" }));
      }, FAKE_LATENCY);
    }
  }

  function handleTileClick(i: number) {
    if (racing || clickLane.phase !== "idle") return;
    const gen = ++genRef.current;
    const now = performance.now();
    setRacing(true);
    setClickedTile(i);

    clearTimeout(hoverPrefetchTimer.current);
    clearTimeout(predictPrefetchTimer.current);

    setClickLane({
      phase: "loading",
      prefetched: 0,
      duration: FAKE_LATENCY,
      elapsed: null,
    });

    const hoverTime = hoverTimesRef.current[i];
    const hoverElapsed = hoverTime ? now - hoverTime : 0;
    const hoverPrefetched = Math.min(1, hoverElapsed / FAKE_LATENCY);
    const hoverRemaining = Math.max(0, FAKE_LATENCY - hoverElapsed);

    if (hoverRemaining > 0) {
      setHoverLane({
        phase: "loading",
        prefetched: hoverPrefetched,
        duration: hoverRemaining,
        elapsed: null,
      });
    } else {
      setHoverLane({ phase: "done", prefetched: 1, duration: 0, elapsed: 0 });
    }

    const predTime = predictionTimesRef.current[i];
    const predElapsed = predTime ? now - predTime : 0;
    const predPrefetched = Math.min(1, predElapsed / FAKE_LATENCY);
    const predRemaining = Math.max(0, FAKE_LATENCY - predElapsed);

    if (predRemaining > 0) {
      setPredictLane({
        phase: "loading",
        prefetched: predPrefetched,
        duration: predRemaining,
        elapsed: null,
      });
    } else {
      setPredictLane({
        phase: "done",
        prefetched: 1,
        duration: 0,
        elapsed: 0,
      });
    }

    if (predRemaining > 0) {
      setTimeout(() => {
        if (genRef.current !== gen) return;
        setPredictLane((prev) => ({
          ...prev,
          phase: "done",
          elapsed: Math.round(performance.now() - now),
        }));
      }, predRemaining);
    }

    if (hoverRemaining > 0) {
      setTimeout(() => {
        if (genRef.current !== gen) return;
        setHoverLane((prev) => ({
          ...prev,
          phase: "done",
          elapsed: Math.round(performance.now() - now),
        }));
      }, hoverRemaining);
    }

    setTimeout(() => {
      if (genRef.current !== gen) return;
      setClickLane((prev) => ({
        ...prev,
        phase: "done",
        elapsed: Math.round(performance.now() - now),
      }));
      setRacing(false);
    }, FAKE_LATENCY);
  }

  function reset() {
    genRef.current++;
    clearTimeout(hoverPrefetchTimer.current);
    clearTimeout(predictPrefetchTimer.current);
    setClickLane(INITIAL_LANE);
    setHoverLane(INITIAL_LANE);
    setPredictLane(INITIAL_LANE);
    setRacing(false);
    setClickedTile(null);
    setPredictedTiles(new Set());
    predictionTimesRef.current = {};
    hoverTimesRef.current = {};
    lastHoveredRef.current = null;
    setResetKey((k) => k + 1);
  }

  const isIdle = clickLane.phase === "idle";

  return (
    <div className={styles.comparison} ref={containerRef}>
      <div className={styles.grid}>
        {TILES.map((label, i) => (
          <button
            type="button"
            key={label}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            className={styles.tile}
            data-predicted={predictedTiles.has(i) || undefined}
            data-selected={clickedTile === i || undefined}
            disabled={racing}
            onMouseEnter={() => handleTileEnter(i)}
            onClick={() => handleTileClick(i)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.columns}>
        <div className={styles.column}>
          <span className={styles.heading}>Click</span>
          <LaneBar lane={clickLane} />
          <span className={styles.indicator} data-phase={clickLane.phase}>
            <Calligraph>{laneLabel(clickLane)}</Calligraph>
          </span>
        </div>
        <div className={styles.column}>
          <span className={styles.heading}>Hover</span>
          <LaneBar lane={hoverLane} />
          <span className={styles.indicator} data-phase={hoverLane.phase}>
            <Calligraph>{laneLabel(hoverLane)}</Calligraph>
          </span>
        </div>
        <div className={styles.column}>
          <span className={styles.heading} data-accent>
            Predictive
          </span>
          <LaneBar lane={predictLane} />
          <span className={styles.indicator} data-phase={predictLane.phase}>
            <Calligraph>{laneLabel(predictLane)}</Calligraph>
          </span>
        </div>
      </div>

      {active && (
        <svg className={styles.overlay} aria-hidden="true">
          <motion.line
            x1={cursorX}
            y1={cursorY}
            x2={predX}
            y2={predY}
            stroke="var(--blue-9)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="4 4"
            opacity={0.8}
          />
          <motion.circle
            cx={predX}
            cy={predY}
            r={5}
            fill="var(--blue-9)"
            opacity={0.6}
          />
          <motion.circle
            cx={cursorX}
            cy={cursorY}
            r={3}
            fill="var(--gray-12)"
            opacity={0.4}
          />
        </svg>
      )}

      {!isIdle && (
        <div className={styles.footer}>
          <Button variant="ghost" size="small" onClick={reset}>
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}
