import { memo, useLayoutEffect, useRef, useState } from "react";

const TruncatedEmail = memo(function TruncatedEmail(props: {
  email: string;
  containerToObserveWidthChanges: Element | null;
  textClassName?: string;
}) {
  const [emailPrefix, setEmailPrefix] = useState(props.email.split("@")[0] || "");
  // Set to zero instead of taking container width from props to trigger ResizeObserver.
  const lastContainerWidthRef = useRef(0);
  // Set to empty string instead of email from props to trigger ResizeObserver.
  const lastEmailRef = useRef("");
  const emailPrefixRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!props.containerToObserveWidthChanges) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!emailPrefixRef.current) {
        console.error("Email prefix reference to truncate email not found.");
        return;
      }
      const container = props.containerToObserveWidthChanges;
      if (!container || container.clientWidth == 0) return;
      if (
        container.clientWidth == lastContainerWidthRef.current &&
        props.email == lastEmailRef.current
      )
        return;
      const emailPrefixToTruncate = props.email.split("@")[0] || "";
      const emailElement = emailPrefixRef.current;
      emailElement.innerHTML = emailPrefixToTruncate;
      if (emailElement.scrollWidth > emailElement.clientWidth) {
        emailElement.innerHTML = emailElement.innerHTML + "...";
        // Remove last character before the three-dot suffix while there is text to truncate.
        while (emailElement.scrollWidth > emailElement.clientWidth) {
          emailElement.innerHTML =
            emailElement.innerHTML.slice(0, emailElement.innerHTML.length - 4) + "...";
        }
      }
      lastContainerWidthRef.current = container.clientWidth;
      lastEmailRef.current = props.email;
      setEmailPrefix(emailElement.innerHTML);
    });

    resizeObserver.observe(props.containerToObserveWidthChanges);
    return () => resizeObserver.disconnect();
  }, [props.email, props.containerToObserveWidthChanges]);

  return (
    <span className="hstack" style={{ maxWidth: "100%" }}>
      <span
        className={`${props.textClassName}`}
        style={{ whiteSpace: "nowrap", overflow: "hidden" }}
        ref={emailPrefixRef}
      >
        {emailPrefix}
      </span>
      <span className={`${props.textClassName}`}>@</span>
      <span className={`${props.textClassName}`}>{props.email.split("@")[1] || ""}</span>
    </span>
  );
});

export default TruncatedEmail;
