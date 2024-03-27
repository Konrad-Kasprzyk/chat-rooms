"use client";

import acceptWorkspaceInvitation from "client/api/user/acceptWorkspaceInvitation.api";
import hideWorkspaceInvitation from "client/api/user/hideWorkspaceInvitation.api";
import listenCurrentUser, { setNextCurrentUser } from "client/api/user/listenCurrentUser.api";
import listenCurrentUserDetails, {
  setNextCurrentUserDetails,
} from "client/api/user/listenCurrentUserDetails.api";
import rejectWorkspaceInvitation from "client/api/user/rejectWorkspaceInvitation.api";
import listenWorkspaceSummaries, {
  setNextWorkspaceSummaries,
} from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import User from "common/clientModels/user.model";
import UserDetails from "common/clientModels/userDetails.model";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { memo, useEffect, useRef } from "react";
import styles from "./invitationItem.module.scss";

const InvitationItem = memo(function InvitationItem(props: {
  roomId: string;
  title: string;
  description: string;
}) {
  const userRef = useRef<User | null>(null);
  const userDetailsRef = useRef<UserDetails | null>(null);
  const allRoomsRef = useRef<WorkspaceSummary[]>([]);
  const roomRef = useRef<WorkspaceSummary | null>(null);

  useEffect(() => {
    const currentUserSubscription = listenCurrentUser().subscribe((nextUser) => {
      userRef.current = nextUser;
    });
    const currentUserDetailsSubscription = listenCurrentUserDetails().subscribe(
      (nextUserDetails) => {
        userDetailsRef.current = nextUserDetails;
      }
    );
    return () => {
      currentUserSubscription.unsubscribe();
      currentUserDetailsSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const workspaceSummariesSubscription = listenWorkspaceSummaries().subscribe((nextRooms) => {
      allRoomsRef.current = nextRooms.docs;
      const nextModalRoom = nextRooms.docs.find((room) => room.id == props.roomId);
      roomRef.current = nextModalRoom || null;
    });
    return () => workspaceSummariesSubscription.unsubscribe();
  }, [props.roomId]);

  return (
    <li className="list-group-item vstack">
      <h5 className="mb-0 mt-1 text-center text-truncate">{props.title}</h5>
      <small className="text-body-secondary text-center text-truncate">{props.description}</small>
      <div className="mb-1 mt-2 hstack justify-content-around">
        <div className="col-4 d-flex justify-content-end">
          <button
            type="button"
            className={`btn btn-primary ${styles.buttonWidth}`}
            onClick={() => {
              if (!userRef.current || roomRef.current?.id !== props.roomId) return;
              acceptWorkspaceInvitation(props.roomId);
              setTimeout(() => {
                if (!userRef.current || roomRef.current?.id !== props.roomId) return;
                userRef.current.workspaceInvitationIds =
                  userRef.current.workspaceInvitationIds.filter(
                    (invitationId) => invitationId != props.roomId
                  );
                userRef.current.workspaceIds = [...userRef.current.workspaceIds, props.roomId];
                setNextCurrentUser({ ...userRef.current });
                roomRef.current.invitedUserIds = roomRef.current.invitedUserIds.filter(
                  (invitedUserId) => invitedUserId != userRef.current?.id
                );
                roomRef.current.userIds = [...roomRef.current.userIds, userRef.current?.id];
                setNextWorkspaceSummaries(
                  [...allRoomsRef.current],
                  [{ type: "modified", doc: roomRef.current }]
                );
              }, 0);
            }}
          >
            Accept
          </button>
        </div>
        <div className="col-4 d-flex justify-content-center">
          <button
            type="button"
            className={`btn btn-secondary ${styles.buttonWidth}`}
            onClick={() => {
              if (!userDetailsRef.current || roomRef.current?.id !== props.roomId) return;
              hideWorkspaceInvitation(props.roomId);
              setTimeout(() => {
                if (!userDetailsRef.current || roomRef.current?.id !== props.roomId) return;
                userDetailsRef.current.hiddenWorkspaceInvitationIds = [
                  ...userDetailsRef.current.hiddenWorkspaceInvitationIds,
                  props.roomId,
                ];
                setNextCurrentUserDetails({ ...userDetailsRef.current });
              }, 0);
            }}
          >
            Hide
          </button>
        </div>
        <div className="col-4 d-flex justify-content-start">
          <button
            type="button"
            className={`btn btn-danger ${styles.buttonWidth}`}
            onClick={() => {
              if (!userRef.current || roomRef.current?.id !== props.roomId) return;
              rejectWorkspaceInvitation(props.roomId);
              setTimeout(() => {
                if (!userRef.current || roomRef.current?.id !== props.roomId) return;
                userRef.current.workspaceInvitationIds =
                  userRef.current.workspaceInvitationIds.filter(
                    (invitationId) => invitationId != props.roomId
                  );
                setNextCurrentUser({ ...userRef.current });
                roomRef.current.invitedUserIds = roomRef.current.invitedUserIds.filter(
                  (invitedUserId) => invitedUserId != userRef.current?.id
                );
                setNextWorkspaceSummaries(
                  [...allRoomsRef.current],
                  [{ type: "modified", doc: roomRef.current }]
                );
              }, 0);
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </li>
  );
});

export default InvitationItem;
