import type { Variants } from "framer-motion";

export const motionDuration = {
  hover: 0.15,
  button: 0.18,
  standard: 0.3,
  structural: 0.5,
} as const;

const ease = [0.22, 1, 0.36, 1] as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motionDuration.standard, ease },
  },
};

export const fadeOut: Variants = {
  visible: { opacity: 1 },
  hidden: {
    opacity: 0,
    transition: { duration: motionDuration.button, ease },
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDuration.standard, ease },
  },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDuration.standard, ease },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: motionDuration.standard, ease },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export const hoverInteraction = {
  whileHover: { y: -2, transition: { duration: motionDuration.hover, ease } },
} as const;

export const pressInteraction = {
  whileTap: { scale: 0.98, transition: { duration: motionDuration.button } },
} as const;

export const pageTransition = {
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  variants: fadeIn,
} as const;

export const modalTransition = {
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  variants: scaleIn,
} as const;
