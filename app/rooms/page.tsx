"use client";

import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import { showFirstSignInPopover } from "client/components/Header";
import DeletedRoomList from "client/components/rooms/DeletedRoomList";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import User from "common/clientModels/user.model";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import NewRoom from "../../client/components/rooms/NewRoom";
import RoomList from "../../client/components/rooms/RoomList";

export default function Rooms() {
  const [user, setUser] = useState<User | null>(null);
  const [openTab, setOpenTab] = useState<"rooms" | "deletedRooms">("rooms");
  const newRoomModalButton = useRef<HTMLButtonElement>(null);
  const roomsRadioButtonRef = useRef<HTMLInputElement>(null);
  const deletedRoomsRadioButtonRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!roomsRadioButtonRef.current || !deletedRoomsRadioButtonRef.current) {
      console.error("One of radio button refs for room list was not found");
      return;
    }
    if (roomsRadioButtonRef.current.checked) setOpenTab("rooms");
    if (deletedRoomsRadioButtonRef.current.checked) setOpenTab("deletedRooms");
  }, []);

  useEffect(() => {
    const currentUserSubscription = listenCurrentUser().subscribe((nextUser) => {
      setUser(nextUser);
      if (
        nextUser &&
        !nextUser.isBotUserDocument &&
        nextUser.workspaceIds.length == 0 &&
        nextUser.workspaceInvitationIds.length == 0
      ) {
        const firstSignInPopoverShown = localStorage.getItem("firstSignInPopoverShown");
        if (!firstSignInPopoverShown) {
          showFirstSignInPopover();
          try {
            localStorage.setItem("firstSignInPopoverShown", "true");
          } catch (error) {}
        }
      }
    });
    return () => currentUserSubscription.unsubscribe();
  }, []);

  return (
    <div className={`vstack gap-3 pt-4`}>
      <NewRoom ref={newRoomModalButton} />
      <div
        className={`btn-group d-flex mt-3 ${DEFAULT_HORIZONTAL_ALIGNMENT}`}
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <div className="btn-group col-6" role="group">
          <input
            type="radio"
            className="btn-check"
            name="roomList"
            id="roomListRooms"
            autoComplete="off"
            onChange={() => setOpenTab("rooms")}
            checked={openTab == "rooms"}
            ref={roomsRadioButtonRef}
          />
          <label className="btn btn-outline-primary" htmlFor="roomListRooms">
            Rooms
          </label>
        </div>
        <div className="btn-group col-6" role="group">
          <input
            type="radio"
            className="btn-check"
            name="roomList"
            id="roomListDeletedRooms"
            autoComplete="off"
            onChange={() => setOpenTab("deletedRooms")}
            checked={openTab == "deletedRooms"}
            ref={deletedRoomsRadioButtonRef}
          />
          <label className="btn btn-outline-primary" htmlFor="roomListDeletedRooms">
            Deleted rooms
          </label>
        </div>
      </div>
      {user && user.workspaceIds.length == 0 && openTab == "rooms" ? (
        <button
          type="button"
          className="btn btn-success btn-lg mx-auto"
          style={{ marginTop: "15vh" }}
          onClick={() => {
            if (newRoomModalButton.current) newRoomModalButton.current.click();
          }}
        >
          Create first room
        </button>
      ) : (
        <div className="mb-sm-3 mb-md-4">
          {openTab == "rooms" ? <RoomList /> : null}
          {openTab == "deletedRooms" ? <DeletedRoomList /> : null}
        </div>
      )}
    </div>
  );
}
