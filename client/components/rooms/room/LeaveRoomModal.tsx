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
  const [modalRoomTitle, setModalRoomTitle] = useState("");
  const [modalHtmlId, setModalHtmlId] = useState(`${props.modalIdPrefix}${props.roomId}`);
  const roomsRef = useRef<WorkspaceSummary[]>([]);
  const modalRoomRef = useRef<WorkspaceSummary | null>(null);
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
      modalRoomRef.current = nextModalRoom || null;
      setModalRoomTitle(nextModalRoom?.title || "");
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
                Confirm room leaving
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h5 className="text-truncate mb-3">{modalRoomTitle}</h5>
              <div>
                Your username and email will no longer be visible to other room members. However,
                your sent messages will still be visible.
              </div>
            </div>
            <div className="modal-footer justify-content-around">
              <button
                type="button"
                className={`btn btn-danger ${styles.buttonWidth}`}
                data-bs-dismiss="modal"
                onClick={() => {
                  if (modalRoomRef.current?.id !== props.roomId || !userRef.current) return;
                  leaveWorkspace(props.roomId);
                  setNextWorkspaceSummaries(
                    roomsRef.current.filter((room) => room.id != props.roomId),
                    [{ type: "removed", doc: modalRoomRef.current }]
                  );
                  setNextCurrentUser({
                    ...userRef.current,
                    workspaceIds: userRef.current.workspaceIds.filter(
                      (workspaceId) => workspaceId != props.roomId
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
