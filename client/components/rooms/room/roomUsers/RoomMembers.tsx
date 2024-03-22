import listenWorkspaceUsers from "client/api/user/listenWorkspaceUsers.api";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import equal from "fast-deep-equal/es6";
import { useEffect, useState } from "react";
import RoomMember from "./RoomMember";

export default function RoomMembers() {
  const [roomMembers, setRoomMembers] = useState<{ id: string; username: string; email: string }[]>(
    []
  );

  useEffect(() => {
    const roomMembersSubscription = listenWorkspaceUsers().subscribe((nextRoomMembers) => {
      const nextRoomMembersToCompare = nextRoomMembers.docs.map((userDoc) => ({
        id: userDoc.id,
        username: userDoc.username,
        email: userDoc.email,
      }));
      if (!equal(nextRoomMembersToCompare, roomMembers)) setRoomMembers(nextRoomMembersToCompare);
    });
    return () => roomMembersSubscription.unsubscribe();
  }, [roomMembers]);

  return (
    <>
      <ul className={`list-group list-group-flush overflow-auto ${DEFAULT_HORIZONTAL_ALIGNMENT}`}>
        {roomMembers.map((roomMember) => {
          return (
            <RoomMember
              key={roomMember.id}
              userId={roomMember.id}
              username={roomMember.username}
              email={roomMember.email}
            />
          );
        })}
      </ul>
    </>
  );
}
