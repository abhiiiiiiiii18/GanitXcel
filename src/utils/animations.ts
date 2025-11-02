import anime from 'animejs/lib/anime.es.js';

/**
 * Fade in animation
 */
export const fadeIn = (targets: string | HTMLElement, delay: number = 0) => {
  return anime({
    targets,
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    delay,
    easing: 'easeOutCubic',
  });
};

/**
 * Slide in from left
 */
export const slideInLeft = (targets: string | HTMLElement, delay: number = 0) => {
  return anime({
    targets,
    translateX: [-100, 0],
    opacity: [0, 1],
    duration: 600,
    delay,
    easing: 'easeOutExpo',
  });
};

/**
 * Slide in from right
 */
export const slideInRight = (targets: string | HTMLElement, delay: number = 0) => {
  return anime({
    targets,
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 600,
    delay,
    easing: 'easeOutExpo',
  });
};

/**
 * Scale up animation
 */
export const scaleUp = (targets: string | HTMLElement, delay: number = 0) => {
  return anime({
    targets,
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 500,
    delay,
    easing: 'easeOutBack',
  });
};

/**
 * Bounce animation
 */
export const bounce = (targets: string | HTMLElement) => {
  return anime({
    targets,
    translateY: [
      { value: -10, duration: 200 },
      { value: 0, duration: 200 },
      { value: -5, duration: 150 },
      { value: 0, duration: 150 },
    ],
    easing: 'easeOutQuad',
  });
};

/**
 * Pulse animation (for notifications, live indicators)
 */
export const pulse = (targets: string | HTMLElement) => {
  return anime({
    targets,
    scale: [1, 1.1, 1],
    duration: 1000,
    loop: true,
    easing: 'easeInOutQuad',
  });
};

/**
 * Rotate animation (for loading, icons)
 */
export const rotate = (targets: string | HTMLElement) => {
  return anime({
    targets,
    rotate: '1turn',
    duration: 2000,
    loop: true,
    easing: 'linear',
  });
};

/**
 * Stagger fade in for lists
 */
export const staggerFadeIn = (targets: string | HTMLElement | NodeListOf<Element> | Element[]) => {
  return anime({
    targets,
    opacity: [0, 1],
    translateY: [20, 0],
    delay: anime.stagger(100), // 100ms delay between each item
    duration: 600,
    easing: 'easeOutCubic',
  });
};

/**
 * Card flip animation
 */
export const flipCard = (targets: string | HTMLElement) => {
  return anime({
    targets,
    rotateY: [0, 180],
    duration: 600,
    easing: 'easeInOutQuad',
  });
};

/**
 * Success checkmark animation
 */
export const drawCheckmark = (targets: string | HTMLElement) => {
  return anime({
    targets,
    strokeDashoffset: [anime.setDashoffset, 0],
    duration: 800,
    easing: 'easeInOutQuad',
  });
};

/**
 * Number counter animation
 */
export const animateNumber = (
  element: HTMLElement,
  finalValue: number,
  duration: number = 1000
) => {
  const obj = { value: 0 };
  return anime({
    targets: obj,
    value: finalValue,
    duration,
    round: 1,
    easing: 'easeOutExpo',
    update: () => {
      element.textContent = obj.value.toString();
    },
  });
};

/**
 * Shake animation (for errors)
 */
export const shake = (targets: string | HTMLElement) => {
  return anime({
    targets,
    translateX: [
      { value: -10, duration: 100 },
      { value: 10, duration: 100 },
      { value: -10, duration: 100 },
      { value: 10, duration: 100 },
      { value: 0, duration: 100 },
    ],
    easing: 'easeInOutSine',
  });
};

/**
 * Floating animation (for hero elements)
 */
export const float = (targets: string | HTMLElement) => {
  return anime({
    targets,
    translateY: [-10, 10],
    duration: 2000,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutSine',
  });
};

/**
 * Ripple effect
 */
export const ripple = (targets: string | HTMLElement) => {
  return anime({
    targets,
    scale: [0, 2],
    opacity: [0.8, 0],
    duration: 600,
    easing: 'easeOutQuad',
  });
};

/**
 * Progress bar fill animation
 */
export const fillProgressBar = (targets: string | HTMLElement, percentage: number) => {
  return anime({
    targets,
    width: `${percentage}%`,
    duration: 1500,
    easing: 'easeInOutQuad',
  });
};

/**
 * Glowing animation (for streak fire, achievements)
 */
export const glow = (targets: string | HTMLElement) => {
  return anime({
    targets,
    boxShadow: [
      '0 0 5px rgba(255, 165, 0, 0.5)',
      '0 0 20px rgba(255, 165, 0, 0.8)',
      '0 0 5px rgba(255, 165, 0, 0.5)',
    ],
    duration: 1500,
    loop: true,
    easing: 'easeInOutQuad',
  });
};

/**
 * Confetti explosion effect
 */
export const confettiExplosion = (container: HTMLElement) => {
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
    container.appendChild(confetti);

    anime({
      targets: confetti,
      translateX: anime.random(-200, 200),
      translateY: anime.random(-200, 200),
      scale: [1, 0],
      opacity: [1, 0],
      duration: anime.random(1000, 1500),
      easing: 'easeOutExpo',
      complete: () => confetti.remove(),
    });
  }
};

/**
 * Page transition animation
 */
export const pageTransition = (targets: string | HTMLElement) => {
  return anime.timeline().add({
    targets,
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 600,
    easing: 'easeOutExpo',
  });
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
  
  button.appendChild(ripple);

  anime({
    targets: ripple,
    scale: [0, 4],
    opacity: [1, 0],
    duration: 600,
    easing: 'easeOutExpo',
    complete: () => ripple.remove(),
  });
};
