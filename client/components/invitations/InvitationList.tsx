"use client";

import listenCurrentUserDetails from "client/api/user/listenCurrentUserDetails.api";
import listenWorkspaceSummaries from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import DEFAULT_LARGE_HORIZONTAL_ALIGNMENT from "client/constants/defaultLargeHorizontalAlignment.constant";
import setNewRoomsIfVisibleChange from "client/utils/components/setNewRoomsIfVisibleChange.util";
import UserDetails from "common/clientModels/userDetails.model";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { useLayoutEffect, useState } from "react";
import InvitationItem from "./InvitationItem";

export default function InvitationList() {
  const [invitations, setInvitations] = useState<WorkspaceSummary[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useLayoutEffect(() => {
    const userDetailsSubscription = listenCurrentUserDetails().subscribe((nextUserDetails) =>
      setUserDetails(nextUserDetails)
    );
    return () => userDetailsSubscription.unsubscribe();
  }, []);

  useLayoutEffect(() => {
    const workspaceSummariesSubscription = listenWorkspaceSummaries().subscribe((nextRooms) =>
      setNewRoomsIfVisibleChange(
        invitations,
        userDetails
          ? nextRooms.docs.filter(
              (room) =>
                room.invitedUserIds.includes(userDetails.id || "") &&
                !userDetails.hiddenWorkspaceInvitationIds.includes(room.id)
            )
          : [],
        setInvitations
      )
    );
    return () => workspaceSummariesSubscription.unsubscribe();
  }, [invitations, userDetails]);

  return userDetails && invitations.length == 0 ? (
    <div className="mt-5">
      <h4 className="text-center">No invitations</h4>
    </div>
  ) : (
    <>
      <ul className={`list-group ${DEFAULT_LARGE_HORIZONTAL_ALIGNMENT} px-1`}>
        {invitations.map((room) => (
          <InvitationItem
            key={room.id}
            roomId={room.id}
            title={room.title}
            description={room.description}
          />
        ))}
      </ul>
    </>
  );
}
