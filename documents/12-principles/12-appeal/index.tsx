"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as Media from "@/components/media";
import styles from "./styles.module.css";

export function Appeal() {
  const [index, setIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollDelta = useRef(0);

  const prev = () => setIndex((i) => (i === 0 ? clips.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === clips.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollDelta.current += e.deltaY;

      if (Math.abs(scrollDelta.current) >= 100) {
        if (scrollDelta.current > 0) next();
        else prev();
        scrollDelta.current = 0;
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  });

  return (
    <div ref={containerRef} className={styles.container}>
      {clips.map((clip, i) => {
        let offset = i - index;
        const half = clips.length / 2;
        if (offset > half) offset -= clips.length;
        if (offset < -half) offset += clips.length;
        if (offset < -1 || offset > 4) return null;

        return (
          <motion.div
            key={clip.link}
            className={styles.frame}
            initial={false}
            animate={{
              y: offset * -16,
              scale: 1 - offset * 0.05,
              opacity: offset < 0 ? 0 : 1,
              filter: offset < 0 ? "blur(1px)" : "blur(0px)",
            }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              zIndex: 100 - offset,
              pointerEvents: offset === 0 ? "auto" : "none",
            }}
          >
            <div className={styles["frame-content"]}>
              <video
                src={clip.video}
                autoPlay
                muted
                loop
                playsInline
                className={styles.video}
              />
              <a className={styles.details} href={clip.link}>
                <Image
                  src={clip.user.avatar}
                  alt={`${clip.user.name}'s avatar`}
                  width={48}
                  height={48}
                  className={styles.avatar}
                  unoptimized
                />
                <span className={styles.name}>{clip.user.name}</span>
              </a>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

const folders = {
  avatar: "/media/library/12-principles-of-animation/avatars/",
  video: "/media/library/12-principles-of-animation/tweets/",
};

export const clips = [
  {
    user: {
      name: "John Phamous",
      handle: "@JohnPhamous",
      avatar: `${folders.avatar}john.png`,
    },
    video: `${folders.video}john.mp4`,
    link: "https://x.com/JohnPhamous",
  },
  {
    user: {
      name: "Gustav Ekerot",
      handle: "@designgurra",
      avatar: `${folders.avatar}gustav.jpg`,
    },
    video: `${folders.video}gustav.mp4`,
    link: "https://x.com/designgurra",
  },
  {
    user: {
      name: "Abhijeet Singh",
      handle: "@abjt14",
      avatar: `${folders.avatar}abhijeet.jpg`,
    },
    video: `${folders.video}abhijeet.mp4`,
    link: "https://x.com/abjt14",
  },
  {
    user: {
      name: "Mint",
      handle: "@smintfy",
      avatar: `${folders.avatar}mint.jpg`,
    },
    video: `${folders.video}mint.mp4`,
    link: "https://x.com/smintfy",
  },
  {
    user: {
      name: "Xavier (Jack)",
      handle: "@KMkota0",
      avatar: `${folders.avatar}xavier.jpg`,
    },
    video: `${folders.video}xavier.mp4`,
    link: "https://x.com/KMkota0",
  },
  {
    user: {
      name: "Florian",
      handle: "@flornkm",
      avatar: `${folders.avatar}florian.jpg`,
    },
    video: `${folders.video}florian.mp4`,
    link: "https://x.com/flornkm",
  },
  {
    user: {
      name: "Lochie Axon",
      handle: "@lochieaxon",
      avatar: `${folders.avatar}lochie.jpg`,
    },
    video: `${folders.video}lochie.mp4`,
    link: "https://x.com/lochiexon",
  },
  {
    user: {
      name: "Pranathi Peri",
      handle: "@pranathiperii",
      avatar: `${folders.avatar}pran.jpg`,
    },
    video: `${folders.video}pran.mp4`,
    link: "https://x.com/pranathiperii",
  },
  {
    user: {
      name: "Jakub Krehel",
      handle: "@jakubkrehel",
      avatar: `${folders.avatar}jakub.jpg`,
    },
    video: `${folders.video}jakub.mp4`,
    link: "https://x.com/jakubkrehel",
  },
  {
    user: {
      name: "Henry Heffernan",
      handle: "@henryheffernan",
      avatar: `${folders.avatar}henry.jpg`,
    },
    video: `${folders.video}henry.mp4`,
    link: "https://x.com/henryheffernan",
  },
];
