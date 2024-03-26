import cancelUserInvitationToWorkspace from "client/api/workspace/cancelUserInvitationToWorkspace.api";
import listenOpenWorkspace, {
  setNextOpenWorkspace,
} from "client/api/workspace/listenOpenWorkspace.api";
import Workspace from "common/clientModels/workspace.model";
import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";

/**
 * @param modalIdPrefix Set to make the modal id unique. The modal id is created by
 * `${modalIdPrefix}${email}`. Usually set to the name of the component that uses
 * the modal.
 */
const CancelInvitationModal = forwardRef(function CancelInvitationModal(
  props: {
    email: string;
    modalIdPrefix: string;
  },
  outerRef: ForwardedRef<HTMLButtonElement>
) {
  const [modalHtmlId, setModalHtmlId] = useState(`${props.modalIdPrefix}${props.email}`);
  const openRoomRef = useRef<Workspace | null>(null);

  useEffect(
    () => setModalHtmlId(`${props.modalIdPrefix}${props.email}`),
    [props.modalIdPrefix, props.email]
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
        data-bs-target={`#cancelInvitationModal${modalHtmlId}`}
        ref={outerRef}
        hidden
      ></button>
      <div
        className="modal fade"
        id={`cancelInvitationModal${modalHtmlId}`}
        tabIndex={-1}
        aria-labelledby={`cancelInvitationModalLabel${modalHtmlId}`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`cancelInvitationModalLabel${modalHtmlId}`}>
                Confirm invitation cancel
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h5 className="text-truncate mt-2">{props.email}</h5>
            </div>
            <div className="modal-footer justify-content-around">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => {
                  if (!props.email || !openRoomRef.current) return;
                  cancelUserInvitationToWorkspace(props.email);
                  setNextOpenWorkspace({
                    ...openRoomRef.current,
                    invitedUserEmails: openRoomRef.current.invitedUserEmails.filter(
                      (email) => email != props.email
                    ),
                  });
                }}
              >
                Cancel invitation
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

export default CancelInvitationModal;
