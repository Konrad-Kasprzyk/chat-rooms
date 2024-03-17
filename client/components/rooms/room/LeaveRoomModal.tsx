import listenCurrentUser, { setNextCurrentUser } from "client/api/user/listenCurrentUser.api";
import leaveWorkspace from "client/api/workspace/leaveWorkspace.api";
import listenWorkspaceSummaries, {
  setNextWorkspaceSummaries,
} from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import User from "common/clientModels/user.model";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { usePathname, useRouter } from "next/navigation";
import { LegacyRef, forwardRef, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./room.module.scss";

const LeaveRoomModal = forwardRef(function LeaveRoomModal(
  props: {
    roomId: string;
    buttonClassName?: string;
    hidden?: boolean;
  },
  ref: LegacyRef<HTMLButtonElement>
) {
  const [modalRoom, setModalRoom] = useState<WorkspaceSummary | null>(null);
  const [modalHtmlUniqueId] = useState(uuidv4());
  const roomsRef = useRef<WorkspaceSummary[]>([]);
  const userRef = useRef<User | null>(null);
  const pathname = usePathname();
  const { push } = useRouter();

  useEffect(() => {
    const currentUserSubscription = listenCurrentUser().subscribe(
      (nextUser) => (userRef.current = nextUser)
    );
    return () => currentUserSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    const workspaceSummariesSubscription = listenWorkspaceSummaries().subscribe((nextRooms) => {
      roomsRef.current = nextRooms.docs;
      const nextModalRoom = nextRooms.docs.find((room) => room.id == props.roomId);
      setModalRoom(nextModalRoom ? { ...nextModalRoom } : null);
    });
    return () => workspaceSummariesSubscription.unsubscribe();
  }, [props.roomId]);

  return (
    <>
      <button
        type="button"
        className={props.buttonClassName || ""}
        data-bs-toggle="modal"
        data-bs-target={`#leaveRoomModal${modalHtmlUniqueId}`}
        ref={ref}
        hidden={props.hidden}
      >
        Leave Room
      </button>
      <div
        className="modal fade"
        id={`leaveRoomModal${modalHtmlUniqueId}`}
        tabIndex={-1}
        aria-labelledby={`leaveRoomModalLabel${modalHtmlUniqueId}`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`leaveRoomModalLabel${modalHtmlUniqueId}`}>
                Please confirm room leaving
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h5 className="text-truncate">{modalRoom?.title}</h5>
            </div>
            <div className="modal-footer justify-content-around">
              <button
                type="button"
                className={`btn btn-danger ${styles.buttonWidth}`}
                data-bs-dismiss="modal"
                onClick={() => {
                  if (!modalRoom || modalRoom.id != props.roomId) return;
                  leaveWorkspace(props.roomId);
                  setNextWorkspaceSummaries(
                    roomsRef.current.filter((room) => room.id != modalRoom.id),
                    [{ type: "removed", doc: modalRoom }]
                  );
                  if (userRef.current)
                    setNextCurrentUser({
                      ...userRef.current,
                      workspaceIds: userRef.current.workspaceIds.filter(
                        (workspaceId) => workspaceId != modalRoom.id
                      ),
                    });
                  if (pathname != "/rooms") push("/rooms");
                }}
              >
                Leave room
              </button>
              <button
                type="button"
                className={`btn btn-secondary ${styles.buttonWidth}`}
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default LeaveRoomModal;
