import listenCurrentUser, { setNextCurrentUser } from "client/api/user/listenCurrentUser.api";
import leaveWorkspace from "client/api/workspace/leaveWorkspace.api";
import listenWorkspaceSummaries, {
  setNextWorkspaceSummaries,
} from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import User from "common/clientModels/user.model";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { usePathname, useRouter } from "next/navigation";
import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import styles from "./room.module.scss";

/**
 * @param modalIdPrefix Set to make the modal id unique. The modal id is created by
 * `${modalIdPrefix}${roomId}`. Usually set to the name of the component that uses
 * the modal.
 */
const LeaveRoomModal = forwardRef(function LeaveRoomModal(
  props: {
    roomId: string;
    modalIdPrefix: string;
    buttonClassName?: string;
    hidden?: boolean;
  },
  outerRef: ForwardedRef<HTMLButtonElement>
) {
  const [modalRoom, setModalRoom] = useState<WorkspaceSummary | null>(null);
  const [modalHtmlId, setModalHtmlId] = useState(`${props.modalIdPrefix}${props.roomId}`);
  const roomsRef = useRef<WorkspaceSummary[]>([]);
  const userRef = useRef<User | null>(null);
  const pathname = usePathname();
  const { push } = useRouter();

  useEffect(
    () => setModalHtmlId(`${props.modalIdPrefix}${props.roomId}`),
    [props.modalIdPrefix, props.roomId]
  );

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
        data-bs-target={`#leaveRoomModal${modalHtmlId}`}
        ref={outerRef}
        hidden={props.hidden}
      >
        Leave Room
      </button>
      <div
        className="modal fade"
        id={`leaveRoomModal${modalHtmlId}`}
        tabIndex={-1}
        aria-labelledby={`leaveRoomModalLabel${modalHtmlId}`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`leaveRoomModalLabel${modalHtmlId}`}>
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
