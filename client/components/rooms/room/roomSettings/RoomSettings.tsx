import changeWorkspaceDescription from "client/api/workspace/changeWorkspaceDescription.api";
import changeWorkspaceTitle from "client/api/workspace/changeWorkspaceTitle.api";
import listenOpenWorkspace, {
  setNextOpenWorkspace,
} from "client/api/workspace/listenOpenWorkspace.api";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import Workspace from "common/clientModels/workspace.model";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import DeleteRoomModal from "../DeleteRoomModal";
import LeaveRoomModal from "../LeaveRoomModal";
import styles from "../room.module.scss";

export default function RoomSettings() {
  const [roomId, setRoomId] = useState("");
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isTitleUpdated, setIsTitleUpdated] = useState<boolean | null>(null);
  const [isDescriptionUpdated, setIsDescriptionUpdated] = useState<boolean | null>(null);
  const openRoomRef = useRef<Workspace | null>(null);

  useEffect(() => {
    const openRoomSubscription = listenOpenWorkspace().subscribe((nextRoom) => {
      if (!nextRoom) return;
      openRoomRef.current = nextRoom;
      // This is true only for first component render. If the room is changed, the component will be removed.
      if (roomId != nextRoom.id) {
        setRoomId(nextRoom.id);
        setNewTitle(nextRoom.title);
        setNewDescription(nextRoom.description);
      }
      if (title != nextRoom.title) {
        setTitle(nextRoom.title);
      }
      if (description != nextRoom.description) {
        setDescription(nextRoom.description);
      }
    });
    return () => openRoomSubscription.unsubscribe();
  }, [roomId, title, description]);

  function handleTitleUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!openRoomRef.current) return;
    if (!newTitle) {
      setIsTitleUpdated(false);
      return;
    }
    changeWorkspaceTitle(newTitle);
    setIsTitleUpdated(true);
    setNextOpenWorkspace({ ...openRoomRef.current, title: newTitle });
  }

  function handleDescriptionUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!openRoomRef.current) return;
    changeWorkspaceDescription(newDescription);
    setIsDescriptionUpdated(true);
    setNextOpenWorkspace({ ...openRoomRef.current, description: newDescription });
  }

  return (
    <div className={`vstack gap-3 ${DEFAULT_HORIZONTAL_ALIGNMENT}`}>
      <form className="mt-md-3" onSubmit={(e) => handleTitleUpdateSubmit(e)} noValidate>
        <div>
          <label htmlFor="roomSettingsTitleInput" className="form-label ms-1">
            Title
          </label>
          <input
            id="roomSettingsTitleInput"
            type="text"
            className={`form-control  ${isTitleUpdated === true ? "is-valid" : ""} ${
              isTitleUpdated === false ? "is-invalid" : ""
            }`}
            placeholder="Title*"
            value={newTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewTitle(e.target.value);
              setIsTitleUpdated(null);
            }}
          ></input>
          <div className="invalid-feedback">Please provide a title.</div>
          <div className="valid-feedback">Title updated</div>
        </div>
        <div className="hstack justify-content-around mt-2 mt-md-3">
          <button
            type="submit"
            className={`btn btn-primary ${styles.buttonWidth}`}
            disabled={title == newTitle}
          >
            Update
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${styles.buttonWidth}`}
            disabled={title == newTitle}
            onClick={() => setNewTitle(title)}
          >
            Cancel
          </button>
        </div>
      </form>
      <form className="mt-md-1" onSubmit={(e) => handleDescriptionUpdateSubmit(e)} noValidate>
        <div>
          <label htmlFor="roomSettingsDescriptionInput" className="form-label ms-1">
            Description
          </label>
          <input
            id="roomSettingsDescriptionInput"
            type="text"
            className={`form-control  ${isDescriptionUpdated === true ? "is-valid" : ""}`}
            placeholder="Description"
            value={newDescription}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewDescription(e.target.value);
              setIsDescriptionUpdated(null);
            }}
          ></input>
          <div className="valid-feedback">Description updated</div>
        </div>
        <div className="hstack justify-content-around mt-2 mt-md-3">
          <button
            type="submit"
            className={`btn btn-primary ${styles.buttonWidth}`}
            disabled={description == newDescription}
          >
            Update
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${styles.buttonWidth}`}
            disabled={description == newDescription}
            onClick={() => setNewDescription(description)}
          >
            Cancel
          </button>
        </div>
      </form>
      <div className="d-flex justify-content-center mt-4 mt-lg-5">
        <LeaveRoomModal
          roomId={roomId}
          buttonClassName="btn btn-danger px-4"
          modalIdPrefix="roomSettings"
        />
      </div>
      <hr className="mt-3 border-2 border-danger mb-0" style={{ opacity: "1" }} />
      <div className="text-danger text-center fw-bold">Danger zone</div>
      <div className="d-flex justify-content-center mt-4 mb-5">
        <DeleteRoomModal roomId={roomId} modalIdPrefix="roomSettings" />
      </div>
    </div>
  );
}
