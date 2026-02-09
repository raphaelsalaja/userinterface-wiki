"use client";

import { MotionConfig, type MotionProps, motion } from "motion/react";
import { type SVGProps, useCallback, useEffect, useState } from "react";
import styles from "./styles.module.css";

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

const animation: MotionProps = {
  initial: { opacity: 0, filter: "blur(8px)", scale: 0.95 },
  animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
  exit: { opacity: 0, filter: "blur(8px)", scale: 0.95 },
  transition: {
    duration: 0.4,
    ease: [0.19, 1, 0.22, 1],
    delay: 0.05,
    opacity: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

function useMeasure<T extends HTMLElement = HTMLElement>(): [
  (node: T | null) => void,
  { width: number; height: number },
] {
  const [element, setElement] = useState<T | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, bounds];
}

const labels = ["Lorem Ipsum", "Ex Amet", "Aliqua Velit"];

function Without() {
  const [index, setIndex] = useState(0);

  return (
    <div className={styles.column}>
      <motion.button
        onClick={() => setIndex((prev) => (prev + 1) % labels.length)}
        className={styles.pill}
      >
        <div className={styles.wrapper}>
          <motion.span
            {...animation}
            key={labels[index]}
            className={styles.label}
          >
            {labels[index]}
          </motion.span>
        </div>
      </motion.button>
      <span className={styles.tag}>
        <CircleXmark />
      </span>
    </div>
  );
}

function With() {
  const [index, setIndex] = useState(0);
  const [ref, bounds] = useMeasure();

  return (
    <div className={styles.column}>
      <MotionConfig
        transition={{
          duration: 0.4,
          ease: [0.19, 1, 0.22, 1],
          delay: 0.05,
        }}
      >
        <motion.button
          animate={{
            width: bounds.width > 0 ? bounds.width : "auto",
          }}
          onClick={() => setIndex((prev) => (prev + 1) % labels.length)}
          className={styles.pill}
        >
          <div ref={ref} className={styles.wrapper}>
            <motion.span
              {...animation}
              key={labels[index]}
              className={styles.label}
            >
              {labels[index]}
            </motion.span>
          </div>
        </motion.button>
        <span className={styles.tag}>
          <CircleCheck />
        </span>
      </MotionConfig>
    </div>
  );
}

export function Comparison() {
  return (
    <div className={styles.container}>
      <Without />
      <With />
    </div>
  );
}

function CircleXmark({
  fill = "var(--red-9)",
  secondaryfill,
  title = "badge 13",
  ...props
}: IconProps) {
  secondaryfill = secondaryfill || fill;

  return (
    <svg
      height="18"
      id="circle-xmark"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <g fill={fill}>
        <path
          d="M9,1C4.589,1,1,4.589,1,9s3.589,8,8,8,8-3.589,8-8S13.411,1,9,1Zm3.28,10.22c.293,.293,.293,.768,0,1.061-.146,.146-.338,.22-.53,.22s-.384-.073-.53-.22l-2.22-2.22-2.22,2.22c-.146,.146-.338,.22-.53,.22s-.384-.073-.53-.22c-.293-.293-.293-.768,0-1.061l2.22-2.22-2.22-2.22c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0l2.22,2.22,2.22-2.22c.293-.293,.768-.293,1.061,0s.293,.768,0,1.061l-2.22,2.22,2.22,2.22Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

function CircleCheck({
  fill = "var(--green-9)",
  secondaryfill,
  title = "badge 13",
  ...props
}: IconProps) {
  secondaryfill = secondaryfill || fill;

  return (
    <svg
      height="18"
      id="circle-check"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <g fill={fill}>
        <path
          d="M9,1C4.589,1,1,4.589,1,9s3.589,8,8,8,8-3.589,8-8S13.411,1,9,1Zm3.843,5.708l-4.25,5.5c-.136,.176-.343,.283-.565,.291-.01,0-.019,0-.028,0-.212,0-.415-.09-.558-.248l-2.25-2.5c-.277-.308-.252-.782,.056-1.06,.309-.276,.781-.252,1.06,.056l1.648,1.832,3.701-4.789c.253-.328,.725-.388,1.052-.135,.328,.253,.388,.724,.135,1.052Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}
