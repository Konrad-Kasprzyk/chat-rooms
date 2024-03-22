import listenOpenWorkspace, {
  setNextOpenWorkspace,
} from "client/api/workspace/listenOpenWorkspace.api";
import removeUserFromWorkspace from "client/api/workspace/removeUserFromWorkspace.api";
import Workspace from "common/clientModels/workspace.model";
import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";

/**
 * @param modalIdPrefix Set to make the modal id unique. The modal id is created by
 * `${modalIdPrefix}${username}`. Usually set to the name of the component that uses
 * the modal.
 */
const RemoveUserModal = forwardRef(function RemoveUserModal(
  props: {
    userId: string;
    username: string;
    modalIdPrefix: string;
  },
  outerRef: ForwardedRef<HTMLButtonElement>
) {
  const [modalHtmlId, setModalHtmlId] = useState(`${props.modalIdPrefix}${props.username}`);
  const openRoomRef = useRef<Workspace | null>(null);

  useEffect(
    () => setModalHtmlId(`${props.modalIdPrefix}${props.username}`),
    [props.modalIdPrefix, props.username]
  );

  useEffect(() => {
    const openRoomSubscription = listenOpenWorkspace().subscribe(
      (nextRoom) => (openRoomRef.current = nextRoom)
    );
    return () => openRoomSubscription.unsubscribe();
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn"
        data-bs-toggle="modal"
        data-bs-target={`#removeUserModal${modalHtmlId}`}
        ref={outerRef}
        hidden
      ></button>
      <div
        className="modal fade"
        id={`removeUserModal${modalHtmlId}`}
        tabIndex={-1}
        aria-labelledby={`removeUserModalLabel${modalHtmlId}`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`removeUserModalLabel${modalHtmlId}`}>
                Confirm user removal
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h5 className="text-truncate mt-2">{props.username}</h5>
            </div>
            <div className="modal-footer justify-content-around">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => {
                  if (!props.userId || !openRoomRef.current) return;
                  removeUserFromWorkspace(props.userId);
                  setNextOpenWorkspace({
                    ...openRoomRef.current,
                    userIds: openRoomRef.current.userIds.filter((userId) => userId != props.userId),
                  });
                }}
              >
                Remove user
              </button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default RemoveUserModal;
