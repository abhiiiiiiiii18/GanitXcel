// Simplified animations without animejs dependency issues
// Using CSS transitions and basic JavaScript animations

/**
 * Fade in animation
 */
export const fadeIn = (target: HTMLElement | null, delay: number = 0) => {
  if (!target) return null;
  
  setTimeout(() => {
    target.style.opacity = '0';
    target.style.transform = 'translateY(20px)';
    target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    
    requestAnimationFrame(() => {
      target.style.opacity = '1';
      target.style.transform = 'translateY(0)';
    });
  }, delay);
  
  return null;
};

/**
 * Slide in from left
 */
export const slideInLeft = (target: HTMLElement | null, delay: number = 0) => {
  if (!target) return null;
  
  setTimeout(() => {
    target.style.opacity = '0';
    target.style.transform = 'translateX(-100px)';
    target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    
    requestAnimationFrame(() => {
      target.style.opacity = '1';
      target.style.transform = 'translateX(0)';
    });
  }, delay);
  
  return null;
};

/**
 * Slide in from right
 */
export const slideInRight = (target: HTMLElement | null, delay: number = 0) => {
  if (!target) return null;
  
  setTimeout(() => {
    target.style.opacity = '0';
    target.style.transform = 'translateX(100px)';
    target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    
    requestAnimationFrame(() => {
      target.style.opacity = '1';
      target.style.transform = 'translateX(0)';
    });
  }, delay);
  
  return null;
};

/**
 * Scale up animation
 */
export const scaleUp = (target: HTMLElement | string | null, delay: number = 0) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element || !(element instanceof HTMLElement)) return null;
  
  setTimeout(() => {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';
    element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    });
  }, delay);
  
  return null;
};

/**
 * Bounce animation
 */
export const bounce = (target: HTMLElement | string | null) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element || !(element instanceof HTMLElement)) return null;
  
  element.style.animation = 'bounce 0.7s ease';
  setTimeout(() => {
    element.style.animation = '';
  }, 700);
  
  return null;
};

/**
 * Pulse animation (for notifications, live indicators)
 */
export const pulse = (target: HTMLElement | string | null) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element || !(element instanceof HTMLElement)) return null;
  
  element.style.animation = 'pulse 1s infinite';
  return null;
};

/**
 * Rotate animation (for loading, icons)
 */
export const rotate = (target: HTMLElement | string | null) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element || !(element instanceof HTMLElement)) return null;
  
  element.style.animation = 'spin 2s linear infinite';
  return null;
};

/**
 * Stagger fade in for lists
 */
export const staggerFadeIn = (targets: HTMLElement | NodeListOf<Element> | Element[] | string | null) => {
  let elements: Element[] = [];
  
  if (!targets) return null;
  
  if (typeof targets === 'string') {
    elements = Array.from(document.querySelectorAll(targets));
  } else if (targets instanceof HTMLElement) {
    elements = [targets];
  } else if (targets instanceof NodeList) {
    elements = Array.from(targets);
  } else if (Array.isArray(targets)) {
    elements = targets;
  }
  
  elements.forEach((element, index) => {
    if (element instanceof HTMLElement) {
      setTimeout(() => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
      }, index * 100);
    }
  });
  
  return null;
};

/**
 * Card flip animation
 */
export const flipCard = (target: HTMLElement | string | null) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element || !(element instanceof HTMLElement)) return null;
  
  element.style.transition = 'transform 0.6s';
  element.style.transform = 'rotateY(180deg)';
  
  return null;
};

/**
 * Success checkmark animation
 */
export const drawCheckmark = (target: HTMLElement | string | null) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element || !(element instanceof HTMLElement)) return null;
  
  element.style.animation = 'drawCheck 0.8s ease-out';
  return null;
};

/**
 * Number counter animation
 */
export const animateNumber = (
  element: HTMLElement,
  finalValue: number,
  duration: number = 1000
) => {
  if (!element) return null;
  
  const startValue = 0;
  const startTime = performance.now();
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.floor(startValue + (finalValue - startValue) * progress);
    
    element.textContent = currentValue.toString();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
  return null;
};

/**
 * Shake animation (for errors)
 */
export const shake = (target: HTMLElement | string | null) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element || !(element instanceof HTMLElement)) return null;
  
  element.style.animation = 'shake 0.5s';
  setTimeout(() => {
    element.style.animation = '';
  }, 500);
  
  return null;
};

/**
 * Floating animation (for hero elements)
 */
export const float = (target: HTMLElement | null) => {
  if (!target) return null;
  
  target.style.animation = 'float 2s ease-in-out infinite';
  return null;
};

/**
 * Ripple effect
 */
export const ripple = (target: HTMLElement | string | null) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element || !(element instanceof HTMLElement)) return null;
  
  element.style.animation = 'ripple 0.6s ease-out';
  setTimeout(() => {
    element.style.animation = '';
  }, 600);
  
  return null;
};

/**
 * Progress bar fill animation
 */
export const fillProgressBar = (target: HTMLElement | string | null, percentage: number) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element || !(element instanceof HTMLElement)) return null;
  
  element.style.transition = 'width 1.5s ease-in-out';
  element.style.width = `${percentage}%`;
  
  return null;
};

/**
 * Glowing animation (for streak fire, achievements)
 */
export const glow = (target: HTMLElement | string | null) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element || !(element instanceof HTMLElement)) return null;
  
  element.style.animation = 'glow 1.5s ease-in-out infinite';
  return null;
};

/**
 * Confetti explosion effect
 */
export const confettiExplosion = (container: HTMLElement) => {
  if (!container) return;
  
  const colors = ['#58CC02', '#1CB0F6', '#FFC800', '#FF4B4B', '#CE82FF'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = '50%';
    confetti.style.top = '50%';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    container.appendChild(confetti);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 200 + Math.random() * 200;
    const x = Math.cos(angle) * velocity;
    const y = Math.sin(angle) * velocity;

    confetti.style.transition = 'all 1.5s ease-out';
    requestAnimationFrame(() => {
      confetti.style.transform = `translate(${x}px, ${y}px) scale(0)`;
      confetti.style.opacity = '0';
    });

    setTimeout(() => confetti.remove(), 1500);
  }
};

/**
 * Page transition animation
 */
export const pageTransition = (target: HTMLElement | string | null) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element || !(element instanceof HTMLElement)) return null;
  
  element.style.opacity = '0';
  element.style.transform = 'translateY(50px)';
  element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  
  requestAnimationFrame(() => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  });
  
  return null;
};

/**
 * Button click ripple effect
 */
export const buttonRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement('span');
  
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
  ripple.style.pointerEvents = 'none';
  ripple.style.transform = 'scale(0)';
  ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
  ripple.style.opacity = '1';
  
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);

  requestAnimationFrame(() => {
    ripple.style.transform = 'scale(4)';
    ripple.style.opacity = '0';
  });

  setTimeout(() => ripple.remove(), 600);
};
