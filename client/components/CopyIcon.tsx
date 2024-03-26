import type { Tooltip } from "bootstrap";
import { useEffect, useRef } from "react";
import { Copy } from "react-bootstrap-icons";
import styles from "./copyIcon.module.scss";

export default function CopyIcon(props: {
  textToCopy: string;
  popupDirection: "top" | "right" | "bottom" | "left";
}) {
  const tooltipHtmlElementRef = useRef<HTMLButtonElement>(null);
  const tooltipObjectRef = useRef<Tooltip | null>(null);
  const tooltipShownFlagRef = useRef<boolean>(false);
  const hideEmailCopiedBadgeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Initialize the email copied tooltip and add an event listener for a click outside of the copy
   * email button to close the tooltip if it is currently displayed.
   */
  useEffect(() => {
    // @ts-ignore: This is a valid path for Bootstrap javascript
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
      if (!tooltipHtmlElementRef.current) {
        console.error("Tooltip reference for copy icon is null");
        return;
      }
      tooltipObjectRef.current = new bootstrap.Tooltip(tooltipHtmlElementRef.current);

      function hideEmailCopiedTooltip(mouseEvent: MouseEvent) {
        if (!(mouseEvent.target instanceof Element)) return;
        const closestCopyEmailButton = mouseEvent.target.closest("#copyEmailButton");
        /**
         * Returns if the email copied tooltip is not displayed or the copy email button was clicked.
         */
        if (!tooltipObjectRef.current || !tooltipShownFlagRef.current || closestCopyEmailButton)
          return;
        if (hideEmailCopiedBadgeTimeoutRef.current)
          clearTimeout(hideEmailCopiedBadgeTimeoutRef.current);
        tooltipObjectRef.current.hide();
        tooltipShownFlagRef.current = false;
      }

      document.addEventListener("click", hideEmailCopiedTooltip);
      return () => document.removeEventListener("click", hideEmailCopiedTooltip);
    });
  }, []);

  function setHideEmailCopiedTimeout() {
    hideEmailCopiedBadgeTimeoutRef.current = setTimeout(() => {
      /**
       * Returns if the email copied tooltip is not displayed.
       */
      if (!tooltipObjectRef.current || !tooltipShownFlagRef.current) return;
      tooltipObjectRef.current.hide();
      tooltipShownFlagRef.current = false;
    }, 1500);
  }

  return (
    <button
      id="copyEmailButton"
      className={`btn p-0 border-0 d-flex ${styles.copyIcon}`}
      onClick={() => {
        navigator.clipboard.writeText(props.textToCopy);
        if (hideEmailCopiedBadgeTimeoutRef.current)
          clearTimeout(hideEmailCopiedBadgeTimeoutRef.current);
        /**
         * Trigger tooltip display for email copied only when it is not displayed.
         */
        if (tooltipObjectRef.current && !tooltipShownFlagRef.current) {
          tooltipObjectRef.current.show();
          tooltipShownFlagRef.current = true;
        }
        setHideEmailCopiedTimeout();
      }}
      data-bs-toggle="tooltip"
      data-bs-placement={props.popupDirection}
      data-bs-trigger="manual"
      data-bs-title="Copied"
      ref={tooltipHtmlElementRef}
    >
      <Copy />
    </button>
  );
}
