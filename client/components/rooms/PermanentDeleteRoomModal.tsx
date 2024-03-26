import listenCurrentUser, { setNextCurrentUser } from "client/api/user/listenCurrentUser.api";
import markWorkspaceDeleted from "client/api/workspace/markWorkspaceDeleted.api";
import listenWorkspaceSummaries, {
  setNextWorkspaceSummaries,
} from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import User from "common/clientModels/user.model";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import styles from "./permanentDeleteRoomModal.module.scss";

const PermanentDeleteRoomModal = forwardRef(function PermanentDeleteRoomModal(
  props: {
    roomId: string;
  },
  outerRef: ForwardedRef<HTMLButtonElement>
) {
  const [modalRoomTitle, setModalRoomTitle] = useState("");
  const roomsRef = useRef<WorkspaceSummary[]>([]);
  const modalRoomRef = useRef<WorkspaceSummary | null>(null);
  const userRef = useRef<User | null>(null);

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
        className="btn"
        data-bs-toggle="modal"
        data-bs-target="#permanentlyDeleteRoomModal"
        ref={outerRef}
        hidden
      ></button>
      <div
        className="modal fade"
        id="permanentlyDeleteRoomModal"
        tabIndex={-1}
        aria-labelledby="permanentlyDeleteRoomModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger" id="permanentlyDeleteRoomModalLabel">
                Confirm permanent room deletion
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h5 className="text-truncate text-danger">{modalRoomTitle}</h5>
            </div>
            <div className="modal-footer justify-content-around">
              <button
                type="button"
                className={`btn btn-danger ${styles.deleteButtonWidth}`}
                data-bs-dismiss="modal"
                onClick={() => {
                  if (modalRoomRef.current?.id !== props.roomId || !userRef.current) return;
                  markWorkspaceDeleted(props.roomId);
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
                }}
              >
                Permanent delete room
              </button>
              <button
                type="button"
                className={`btn btn-secondary ${styles.cancelButtonWidth}`}
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

export default PermanentDeleteRoomModal;
