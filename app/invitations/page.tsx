"use client";

import HiddenInvitationList from "client/components/invitations/HiddenInvitationList";
import InvitationList from "client/components/invitations/InvitationList";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import { useLayoutEffect, useRef, useState } from "react";

export default function Invitations() {
  const [openTab, setOpenTab] = useState<"invitations" | "hiddenInvitations">("invitations");
  const invitationsRadioButtonRef = useRef<HTMLInputElement>(null);
  const hiddenInvitationsRadioButtonRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!invitationsRadioButtonRef.current || !hiddenInvitationsRadioButtonRef.current) {
      console.error("One of radio button refs for invitation list was not found");
      return;
    }
    if (invitationsRadioButtonRef.current.checked) setOpenTab("invitations");
    if (hiddenInvitationsRadioButtonRef.current.checked) setOpenTab("hiddenInvitations");
  }, []);

  return (
    <div className={`vstack gap-3 pt-4`}>
      <div
        className={`btn-group d-flex mt-3 ${DEFAULT_HORIZONTAL_ALIGNMENT}`}
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <div className="btn-group col-6" role="group">
          <input
            type="radio"
            className="btn-check"
            name="invitationList"
            id="invitationListInvitations"
            autoComplete="off"
            onChange={() => setOpenTab("invitations")}
            checked={openTab == "invitations"}
            ref={invitationsRadioButtonRef}
          />
          <label className="btn btn-outline-primary" htmlFor="invitationListInvitations">
            Invitations
          </label>
        </div>
        <div className="btn-group col-6" role="group">
          <input
            type="radio"
            className="btn-check"
            name="invitationList"
            id="invitationListHiddenInvitations"
            autoComplete="off"
            onChange={() => setOpenTab("hiddenInvitations")}
            checked={openTab == "hiddenInvitations"}
            ref={hiddenInvitationsRadioButtonRef}
          />
          <label className="btn btn-outline-primary" htmlFor="invitationListHiddenInvitations">
            Hidden invitations
          </label>
        </div>
      </div>
      <div className="mb-sm-3 mb-md-4">
        {openTab == "invitations" ? <InvitationList /> : null}
        {openTab == "hiddenInvitations" ? <HiddenInvitationList /> : null}
      </div>
    </div>
  );
}
