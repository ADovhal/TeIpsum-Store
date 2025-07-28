import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTopInstant } from '../utils/scrollToTop';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTopInstant();
  }, [pathname]);

  return null;
};

export default ScrollToTop; 