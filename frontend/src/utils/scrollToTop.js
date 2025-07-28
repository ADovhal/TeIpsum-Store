/**
 * Utility to scroll to top of page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

/**
 * Instant scroll to top without animation
 */
export const scrollToTopInstant = () => {
  window.scrollTo(0, 0);
}; 