import { RefObject, useState } from "react";
import { useEffect } from "react";

/**
 * Checks whether an referenced object or other DOM element has been clicked.
 * Updates returned state, so this hook re-renders component. State is set to
 * true when given element has been clicked, false otherwise.
 *
 * @param ref Reference to DOM element from React.useRef\<HTMLElement\>.
 * @returns State depending on whether the given DOM element was clicked.
 * False is default.
 */
export default function useClickAlerter(ref: RefObject<HTMLElement | null>) {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (ref && ref.current && !ref.current.contains(event.target as Element)) {
        setIsClicked(false);
      }
    }

    function handleInsideClick(event: MouseEvent) {
      if (ref && ref.current && ref.current.contains(event.target as Element)) {
        setIsClicked(true);
      }
    }

    // Bind the event listeners
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("click", handleInsideClick);
    return () => {
      // Unbind the event listeners on clean up
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("click", handleInsideClick);
    };
  }, [ref]);

  return isClicked;
}
