import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import linkHandler from "client/utils/components/linkHandler.util";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OpeningRoom(props: { roomId: string }) {
  const [userDoesNotBelongToRoom, setUserDoesNotBelongToRoom] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    const userSubscription = listenCurrentUser().subscribe((user) => {
      if (user && user.workspaceIds.every((roomId) => roomId != props.roomId))
        setUserDoesNotBelongToRoom(true);
    });
    return () => userSubscription.unsubscribe();
  }, [props.roomId]);

  return (
    <div style={{ marginTop: "25vh" }}>
      {userDoesNotBelongToRoom ? (
        <div className="vstack align-items-center">
          <h2 className="text-primary">Room not found</h2>
          <a
            className="btn btn-outline-primary btn-lg mt-3"
            role="button"
            href="/rooms"
            onClick={linkHandler("/rooms", push)}
          >
            <strong>My rooms</strong>
          </a>
        </div>
      ) : (
        <>
          <div className="hstack justify-content-center">
            <h2 className="text-primary">Opening room</h2>
            <div className="spinner-border spinner-border-sm text-primary ms-2 mb-1" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
