import moveWorkspaceToRecycleBin from "client/api/workspace/moveWorkspaceToRecycleBin.api";
import { getOpenWorkspaceId } from "client/api/workspace/openWorkspaceId.utils";
import listenWorkspaceSummaries, {
  setNextWorkspaceSummaries,
} from "client/api/workspaceSummary/listenWorkspaceSummaries.api";
import WorkspaceSummary from "common/clientModels/workspaceSummary.model";
import { WORKSPACE_DAYS_IN_BIN } from "common/constants/timeToRetrieveFromBin.constants";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./room.module.scss";

/**
 * @param modalIdPrefix Set to make the modal id unique. The modal id is created by
 * `${modalIdPrefix}${roomId}`. Usually set to the name of the component that uses
 * the modal.
 */
export default function DeleteRoomModal(props: { roomId: string; modalIdPrefix: string }) {
  const [modalRoomTitle, setModalRoomTitle] = useState("");
  const [modalHtmlId, setModalHtmlId] = useState(`${props.modalIdPrefix}${props.roomId}`);
  const roomsRef = useRef<WorkspaceSummary[]>([]);
  const modalRoomRef = useRef<WorkspaceSummary | null>(null);
  const { push } = useRouter();

  useEffect(
    () => setModalHtmlId(`${props.modalIdPrefix}${props.roomId}`),
    [props.modalIdPrefix, props.roomId]
  );

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
        className="btn btn-danger px-5"
        data-bs-toggle="modal"
        data-bs-target={`#deleteRoomModal${modalHtmlId}`}
      >
        Delete Room
      </button>
      <div
        className="modal fade"
        id={`deleteRoomModal${modalHtmlId}`}
        tabIndex={-1}
        aria-labelledby={`deleteRoomModalLabel${modalHtmlId}`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger" id={`deleteRoomModalLabel${modalHtmlId}`}>
                Confirm room deletion
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div>
                {`The room can be restored within ${WORKSPACE_DAYS_IN_BIN} days. ` +
                  `All invitations to the room will be cancelled.`}
              </div>
              <h5 className="text-truncate text-danger mt-3">{modalRoomTitle}</h5>
            </div>
            <div className="modal-footer justify-content-around">
              <button
                type="button"
                className={`btn btn-danger ${styles.buttonWidth}`}
                data-bs-dismiss="modal"
                onClick={() => {
                  if (
                    modalRoomRef.current?.id !== props.roomId ||
                    modalRoomRef.current?.id !== getOpenWorkspaceId()
                  )
                    return;
                  moveWorkspaceToRecycleBin();
                  modalRoomRef.current.placingInBinTime = new Date();
                  setNextWorkspaceSummaries(
                    [...roomsRef.current],
                    [{ type: "modified", doc: modalRoomRef.current }]
                  );
                  push("/rooms");
                }}
              >
                Delete room
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
}
