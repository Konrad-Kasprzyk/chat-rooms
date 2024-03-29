import listenWorkspaceUsers from "client/api/user/listenWorkspaceUsers.api";
import inviteUserToWorkspace from "client/api/workspace/inviteUserToWorkspace.api";
import listenOpenWorkspace from "client/api/workspace/listenOpenWorkspace.api";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import Workspace from "common/clientModels/workspace.model";
import equal from "fast-deep-equal/es6";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import RoomInvitations from "./RoomInvitations";
import RoomMembers from "./RoomMembers";
import UsersHistoryList from "./UsersHistoryList";

export default function RoomUsersTab() {
  const roomMemberEmailsRef = useRef<string[]>([]);
  const invitedUserEmailsRef = useRef<string[]>([]);
  const openRoomRef = useRef<Workspace | null>(null);
  const [openTab, setOpenTab] = useState<"members" | "invitations" | "history">("members");
  const [emailToInvite, setEmailToInvite] = useState("");
  const [formValidSubmit, setFormValidSubmit] = useState<boolean | null>(null);
  const [awaitingApiResponse, setAwaitingApiResponse] = useState<boolean>(false);
  const [invalidEmailFeedback, setInvalidEmailFeedback] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const roomMembersSubscription = listenWorkspaceUsers().subscribe((nextRoomMembers) => {
      const nextRoomMemberEmailsToCompare = nextRoomMembers.docs.map((userDoc) => userDoc.email);
      if (!equal(nextRoomMemberEmailsToCompare, roomMemberEmailsRef.current))
        roomMemberEmailsRef.current = nextRoomMemberEmailsToCompare;
    });
    return () => roomMembersSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    const openRoomSubscription = listenOpenWorkspace().subscribe((nextRoom) => {
      openRoomRef.current = nextRoom;
      const nextInvitedUserEmailsToCompare = nextRoom ? nextRoom.invitedUserEmails : [];
      if (!equal(nextInvitedUserEmailsToCompare, invitedUserEmailsRef.current))
        invitedUserEmailsRef.current = nextInvitedUserEmailsToCompare;
    });
    return () => openRoomSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!modalRef.current) {
      console.error("Modal ref to invite new user is null.");
      return;
    }

    function clearInput() {
      setEmailToInvite("");
      setFormValidSubmit(null);
    }

    const modalElement = modalRef.current;
    modalElement.addEventListener("hidden.bs.modal", clearInput);
    return () => modalElement.removeEventListener("hidden.bs.modal", clearInput);
  }, []);

  function handleInviteUserSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = emailToInvite.trim();
    if (
      !trimmedEmail ||
      !openRoomRef.current ||
      roomMemberEmailsRef.current.includes(trimmedEmail) ||
      invitedUserEmailsRef.current.includes(trimmedEmail)
    ) {
      let nextInvalidEmailFeedback = "Please provide an email.";
      if (trimmedEmail) {
        if (roomMemberEmailsRef.current.includes(trimmedEmail))
          nextInvalidEmailFeedback = "The user belongs to the open room.";
        if (invitedUserEmailsRef.current.includes(trimmedEmail))
          nextInvalidEmailFeedback = "The user is already invited.";
      }
      setInvalidEmailFeedback(nextInvalidEmailFeedback);
      setFormValidSubmit(false);
      return;
    }
    setFormValidSubmit(true);
    setAwaitingApiResponse(true);
    inviteUserToWorkspace(emailToInvite)
      .then(() => {
        setAwaitingApiResponse(false);
      })
      .catch(() => {
        setAwaitingApiResponse(false);
        setInvalidEmailFeedback("User with provided email was not found.");
        setFormValidSubmit(false);
      });
  }

  return (
    <>
      <div
        className={`vstack flex-grow-0 gap-3 gap-md-4 ${DEFAULT_HORIZONTAL_ALIGNMENT} px-3 px-sm-5`}
      >
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
          <input
            type="radio"
            className="btn-check"
            name="roomUsersTab"
            id="roomUsersTabMembers"
            autoComplete="off"
            onChange={() => setOpenTab("members")}
            defaultChecked
          />
          <label className="btn btn-outline-secondary" htmlFor="roomUsersTabMembers">
            Members
          </label>
          <input
            type="radio"
            className="btn-check"
            name="roomUsersTab"
            id="roomUsersTabInvitations"
            autoComplete="off"
            onChange={() => setOpenTab("invitations")}
          />
          <label className="btn btn-outline-secondary" htmlFor="roomUsersTabInvitations">
            Invitations
          </label>
          <input
            type="radio"
            className="btn-check"
            name="roomUsersTab"
            id="roomUsersTabHistory"
            autoComplete="off"
            onChange={() => setOpenTab("history")}
          />
          <label className="btn btn-outline-secondary" htmlFor="roomUsersTabHistory">
            History
          </label>
        </div>
        {openTab == "members" || openTab == "invitations" ? (
          <button
            type="button"
            className="btn btn-success px-5 mx-auto"
            data-bs-toggle="modal"
            data-bs-target="#inviteNewUserModal"
          >
            Invite new user
          </button>
        ) : null}
        <div
          className="modal fade"
          id="inviteNewUserModal"
          tabIndex={-1}
          aria-labelledby="inviteNewUserModalLabel"
          aria-hidden="true"
          ref={modalRef}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="inviteNewUserModalLabel">
                  Invite new user
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => handleInviteUserSubmit(e)} noValidate>
                  <div>
                    <label htmlFor="emailToInviteInput" className="form-label">
                      Email
                    </label>
                    <input
                      id="emailToInviteInput"
                      type="email"
                      className={`form-control ${formValidSubmit === true ? "is-valid" : ""}
                      ${formValidSubmit === false ? "is-invalid" : ""}
                      `}
                      placeholder="Email"
                      value={emailToInvite}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setEmailToInvite(e.target.value);
                        setFormValidSubmit(null);
                      }}
                    ></input>
                    {awaitingApiResponse ? null : (
                      <div className="valid-feedback">User invited.</div>
                    )}
                    <div className="invalid-feedback">{invalidEmailFeedback}</div>
                  </div>
                  <div className="d-flex justify-content-around mt-4">
                    <button type="submit" className="btn btn-primary">
                      {awaitingApiResponse ? (
                        <>
                          <span>Inviting</span>
                          <div
                            className="spinner-border spinner-border-sm text-light ms-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </>
                      ) : (
                        <span>Invite user</span>
                      )}
                    </button>
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openTab == "members" ? <RoomMembers /> : null}
      {openTab == "invitations" ? <RoomInvitations /> : null}
      {openTab == "history" ? <UsersHistoryList /> : null}
    </>
  );
}
