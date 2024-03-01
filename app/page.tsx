"use client";

import ToggleButton from "react-bootstrap/esm/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/esm/ToggleButtonGroup";

export default function Home() {
  // getSignedInUserId();

  // const pathname = usePathname();
  // if (getSignedInUserId() === null && pathname !== "/login") {
  //   console.log("tree");
  // }

  return (
    <main>
      <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
        <ToggleButton variant="outline-success" id="tbg-radio-1" value={1}>
          Radio 1 (pre-checked)
        </ToggleButton>
        <ToggleButton variant="outline-success" id="tbg-radio-2" value={2}>
          Radio 2
        </ToggleButton>
        <ToggleButton variant="outline-success" id="tbg-radio-3" value={3}>
          Radio 3
        </ToggleButton>
      </ToggleButtonGroup>
      <div className="text-bg-light">message text</div>
    </main>
  );
}
