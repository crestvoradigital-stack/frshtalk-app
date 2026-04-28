// Animation utilities for smooth transitions and effects

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideInRight = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
  transition: { duration: 0.3 }
};

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 0.2 }
};

export const bounceIn = {
  initial: { scale: 0.3, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  exit: { scale: 0.3, opacity: 0 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const shimmer = {
  animate: {
    backgroundPosition: ["-200% 0", "200% 0"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Button press animation
export const buttonPress = {
  whileTap: { scale: 0.95 },
  transition: { duration: 0.1 }
};

// Hover animations
export const hoverLift = {
  whileHover: { y: -2 },
  transition: { duration: 0.2 }
};

export const hoverGlow = {
  whileHover: {
    boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)",
    transition: { duration: 0.2 }
  }
};

// Loading animations
export const spin = {
  animate: { rotate: 360 },
  transition: { duration: 1, repeat: Infinity, ease: "linear" }
};

export const dots = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

// Card animations
export const cardHover = {
  whileHover: {
    y: -5,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.2 }
  }
};

// Notification animations
export const notificationSlide = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 300, opacity: 0 },
  transition: { type: "spring", stiffness: 300, damping: 30 }
};

// Modal animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

export const modalContent = {
  initial: { scale: 0.9, opacity: 0, y: 20 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.9, opacity: 0, y: 20 },
  transition: { type: "spring", stiffness: 300, damping: 30 }
};