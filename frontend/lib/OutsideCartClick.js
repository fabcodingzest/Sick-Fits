import { useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
export default function useOutsideAlerter(ref, closeCart) {
  useEffect(() => {
    /**
     * Close cart if clicked on outside of cart
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        closeCart();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, closeCart]);
}
