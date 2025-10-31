import { HTMLMotionProps, motion, Variants } from "framer-motion";
import { ReactNode } from "react";

type AnimationType =
  | "fade"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scale"
  | "bounce"
  | "flip"
  | "zoom"
  | "pulse"
  | "rotate"
  | "float"
  | "swing"
  | "shake"
  | "tada"
  | "FadeUp"
  | "FadeDown";

interface AnimateProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

interface ProgressBarProps {
  progress: number;
  delay?: number;
  duration?: number;
  className?: string;
  barClassName?: string;
}

const baseTransition = {
  duration: 0.4,
  ease: "easeOut" as const,
};

const animationVariants: Record<AnimationType, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        ...baseTransition,
        duration: 0.4,
      },
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ...baseTransition },
    },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ...baseTransition },
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { ...baseTransition },
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { ...baseTransition },
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        ...baseTransition,
        duration: 0.3,
      },
    },
  },
  bounce: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...baseTransition,
        type: "spring",
        stiffness: 500,
        damping: 10,
      },
    },
  },
  flip: {
    hidden: { opacity: 0, rotateY: 90 },
    visible: {
      opacity: 1,
      rotateY: 0,
      transition: {
        ...baseTransition,
        duration: 0.6,
      },
    },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        ...baseTransition,
        duration: 0.5,
        ease: [0.175, 0.885, 0.32, 1.275],
      },
    },
  },
  pulse: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      scale: [1, 1.05, 1],
      transition: {
        ...baseTransition,
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -10 },
    visible: {
      opacity: 1,
      rotate: 0,
      transition: {
        ...baseTransition,
        duration: 0.5,
      },
    },
  },
  float: {
    hidden: { y: 0 },
    visible: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  },
  swing: {
    hidden: { rotate: 0 },
    visible: {
      rotate: [0, 10, -10, 5, -5, 0],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  },
  shake: {
    hidden: { x: 0 },
    visible: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  },
  tada: {
    hidden: { scale: 1 },
    visible: {
      scale: [1, 0.9, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
      rotate: [0, -3, -3, -3, 3, -3, 3, -3, 3, 0],
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  },
  FadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...baseTransition,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  },
  FadeDown: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...baseTransition,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  },
};

export function Animate({
  children,
  type = "fade",
  delay = 0,
  duration,
  className = "",
  ...props
}: AnimateProps) {
  const variants = animationVariants[type];

  // Apply custom duration and delay if provided

  // Create a new variants object with the updated transition
  const customVariants: Variants = {
    hidden: variants.hidden,
    visible: {
      ...(variants.visible as Record<string, unknown>),
      transition: {
        ...baseTransition,
        ...(duration && { duration: duration / 1000 }),
        ...(delay && { delay: delay / 1000 }),
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={customVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Pre-configured animation components
export const Fade = (props: Omit<AnimateProps, "type">) => (
  <Animate type="fade" {...props} />
);

export const SlideUp = (props: Omit<AnimateProps, "type">) => (
  <Animate type="slideUp" {...props} />
);

export const SlideDown = (props: Omit<AnimateProps, "type">) => (
  <Animate type="slideDown" {...props} />
);

export const SlideLeft = (props: Omit<AnimateProps, "type">) => (
  <Animate type="slideLeft" {...props} />
);

export const SlideRight = (props: Omit<AnimateProps, "type">) => (
  <Animate type="slideRight" {...props} />
);

export const Scale = (props: Omit<AnimateProps, "type">) => (
  <Animate type="scale" {...props} />
);

export const Bounce = (props: Omit<AnimateProps, "type">) => (
  <Animate type="bounce" {...props} />
);

interface FadeUpProps extends Omit<AnimateProps, "type"> {
  delay?: number;
  yOffset?: number;
}

export const FadeUp: React.FC<FadeUpProps> = ({
  children,
  delay = 0,
  yOffset = 20,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: delay / 1000, // Convert ms to seconds for framer-motion
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const FadeDown: React.FC<FadeUpProps> = ({
  children,
  delay = 0,
  yOffset = -20,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: delay / 1000, // Convert ms to seconds for framer-motion
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const Flip = (props: Omit<AnimateProps, "type">) => (
  <Animate type="flip" {...props} />
);

export const Zoom = (props: Omit<AnimateProps, "type">) => (
  <Animate type="zoom" {...props} />
);

export const Rotate = (props: Omit<AnimateProps, "type">) => (
  <Animate type="rotate" {...props} />
);

export const Float = (props: Omit<AnimateProps, "type">) => (
  <Animate type="float" {...props} />
);

export const Swing = (props: Omit<AnimateProps, "type">) => (
  <Animate type="swing" {...props} />
);

export const Shake = (props: Omit<AnimateProps, "type">) => (
  <Animate type="shake" {...props} />
);

export const Tada = (props: Omit<AnimateProps, "type">) => (
  <Animate type="tada" {...props} />
);

export function ProgressBar({
  progress,
  delay = 0,
  duration = 0.8,
  className = "",
  barClassName = "",
}: ProgressBarProps) {
  return (
    <motion.div
      className={`h-2 bg-white/50 rounded-full overflow-hidden ${className}`}
    >
      <motion.div
        className={`h-full rounded-full bg-blue-500 ${barClassName}`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{
          duration: duration,
          delay: delay,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}
