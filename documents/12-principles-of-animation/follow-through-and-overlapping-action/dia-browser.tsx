import { motion, type SVGMotionProps } from "motion/react";
import styles from "./styles.module.css";

export const DiaBrowser = (props: SVGMotionProps<SVGElement>) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 400 300"
      className={styles.dia}
      {...props}
    >
      <title>Browser Window</title>
      <g clipPath="url(#a)">
        <path
          fill="color(display-p3 .9216 .9216 .9216)"
          fillOpacity=".82"
          d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10v280c0 5.523-4.477 10-10 10H10c-5.523 0-10-4.477-10-10z"
        />
        <circle
          cx="24"
          cy="22"
          r="5.75"
          fill="color(display-p3 .9255 .4157 .3686)"
          stroke="color(display-p3 .6902 .3255 .2902)"
          strokeWidth=".5"
        />
        <circle
          cx="44"
          cy="22"
          r="5.75"
          fill="color(display-p3 .9569 .7451 .3098)"
          stroke="color(display-p3 .6824 .549 .3059)"
          strokeWidth=".5"
        />
        <circle
          cx="64"
          cy="22"
          r="5.75"
          fill="color(display-p3 .3843 .7725 .3294)"
          stroke="color(display-p3 .4118 .5804 .3725)"
          strokeWidth=".5"
        />
        <path
          fill="color(display-p3 .9882 .9882 .9882)"
          d="M84 22c0-5.6 0-8.4 1.09-10.54a10 10 0 0 1 4.37-4.37C91.6 6 94.4 6 100 6h68c5.601 0 8.401 0 10.54 1.09a10 10 0 0 1 4.37 4.37C184 13.6 184 16.4 184 22v20H84zM184 30v12h12c-6.627 0-12-5.373-12-12M84 30v12H72c6.627 0 12-5.373 12-12"
        />
        <path
          fill="color(display-p3 .1961 .1961 .1961)"
          fillOpacity=".5"
          d="M372.997 25.26a.806.806 0 0 1-.308-.058.93.93 0 0 1-.269-.192l-4.88-4.989a.726.726 0 0 1-.211-.525.7.7 0 0 1 .103-.378.737.737 0 0 1 .262-.275.741.741 0 0 1 .916.134l4.387 4.496 4.387-4.496a.748.748 0 0 1 .544-.237c.137 0 .261.034.372.103.115.068.204.16.268.275a.7.7 0 0 1 .103.378c0 .205-.073.38-.218.525l-4.88 4.989a.917.917 0 0 1-.269.192.801.801 0 0 1-.307.058"
        />
        <g filter="url(#b)">
          <g clipPath="url(#c)">
            <path
              fill="color(display-p3 .9882 .9882 .9882)"
              d="M6 42h388v40H6z"
            />
            <path
              fill="color(display-p3 .1961 .1961 .1961)"
              fillOpacity=".1"
              d="M394 82v-.5H6v1h388z"
            />
            <path fill="#fff" d="M6 82h388v237.763H6z" />
          </g>
        </g>
      </g>
      <defs>
        <clipPath id="a">
          <path
            fill="#fff"
            d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10v280c0 5.523-4.477 10-10 10H10c-5.523 0-10-4.477-10-10z"
          />
        </clipPath>
        <clipPath id="c">
          <path
            fill="#fff"
            d="M6 51.6c0-3.36 0-5.04.654-6.324a6 6 0 0 1 2.622-2.622C10.56 42 12.24 42 15.6 42h368.8c3.36 0 5.04 0 6.324.654a5.998 5.998 0 0 1 2.622 2.622C394 46.56 394 48.24 394 51.6v232.8c0 3.36 0 5.04-.654 6.324a5.997 5.997 0 0 1-2.622 2.622c-1.284.654-2.964.654-6.324.654H15.6c-3.36 0-5.04 0-6.324-.654a5.998 5.998 0 0 1-2.622-2.622C6 289.44 6 287.76 6 284.4V51.6Z"
          />
        </clipPath>
        <filter
          id="b"
          width="400"
          height="268"
          x="0"
          y="38"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_5_643" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
          <feBlend
            in2="effect1_dropShadow_5_643"
            result="effect2_dropShadow_5_643"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="6" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
          <feBlend
            in2="effect2_dropShadow_5_643"
            result="effect3_dropShadow_5_643"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect3_dropShadow_5_643"
            result="shape"
          />
        </filter>
      </defs>
    </motion.svg>
  );
};
