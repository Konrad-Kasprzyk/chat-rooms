import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import equal from "fast-deep-equal/es6";
import { useCallback, useEffect, useRef, useState } from "react";
import CancelInvitationModal from "./CancelInvitationModal";
import RoomInvitation from "./RoomInvitation";

export default function RoomInvitations() {
  const [invitedUserEmails, setInvitedUserEmails] = useState<string[]>([]);
  const [modalEmail, setModalEmail] = useState("");
  const modalButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const openRoomSubscription = listenOpenWorkspace().subscribe((nextRoom) => {
      const nextEmailsToCompare = nextRoom ? nextRoom.invitedUserEmails : [];
      if (!equal(nextEmailsToCompare, invitedUserEmails)) setInvitedUserEmails(nextEmailsToCompare);
    });
    return () => openRoomSubscription.unsubscribe();
  }, [invitedUserEmails]);

  const showCancelInvitationModal = useCallback((emailToCancelInvitation: string) => {
    if (!modalButtonRef.current) return;
    setModalEmail(emailToCancelInvitation);
    modalButtonRef.current.click();
  }, []);

  return (
    <>
      <ul
        className={`list-group list-group-flush overflow-auto mt-sm-3 ${DEFAULT_HORIZONTAL_ALIGNMENT}`}
      >
        {invitedUserEmails.map((email) => {
          return (
            <RoomInvitation
              key={email}
              email={email}
              showCancelInvitationModal={showCancelInvitationModal}
            />
          );
        })}
      </ul>
      <CancelInvitationModal
        email={modalEmail}
        modalIdPrefix="roomInvitations"
        ref={modalButtonRef}
      />
    </>
  );
}
