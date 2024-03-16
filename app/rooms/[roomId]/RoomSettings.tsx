import changeWorkspaceDescription from "client/api/workspace/changeWorkspaceDescription.api";
import changeWorkspaceTitle from "client/api/workspace/changeWorkspaceTitle.api";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import Workspace from "common/clientModels/workspace.model";
import { useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import styles from "../newRoom.module.scss";

export default function RoomSettings(props: {
  openRoom: Workspace;
  setRoom: Dispatch<SetStateAction<Workspace | null>>;
}) {
  const [title, setTitle] = useState(props.openRoom.title);
  const [newTitle, setNewTitle] = useState(props.openRoom.title);
  const [description, setDescription] = useState(props.openRoom.description);
  const [newDescription, setNewDescription] = useState(props.openRoom.description);
  const [isTitleUpdated, setIsTitleUpdated] = useState<boolean | null>(null);
  const [isDescriptionUpdated, setIsDescriptionUpdated] = useState<boolean | null>(null);
  const { push } = useRouter();

  useEffect(() => {
    setTitle(props.openRoom.title);
    setNewTitle(props.openRoom.title);
  }, [props.openRoom.title]);

  useEffect(() => {
    setDescription(props.openRoom.description);
    setNewDescription(props.openRoom.description);
  }, [props.openRoom.description]);

  function handleTitleUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newTitle) {
      setIsTitleUpdated(false);
      return;
    }
    changeWorkspaceTitle(newTitle);
    setIsTitleUpdated(true);
    props.openRoom.title = newTitle;
    props.setRoom({ ...props.openRoom });
  }

  function handleDescriptionUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    changeWorkspaceDescription(newDescription);
    setIsDescriptionUpdated(true);
    props.openRoom.description = newDescription;
    props.setRoom({ ...props.openRoom });
  }

  return (
    <div className={`vstack gap-3 ${DEFAULT_HORIZONTAL_ALIGNMENT}`}>
      <form className="mt-3" onSubmit={(e) => handleTitleUpdateSubmit(e)} noValidate>
        <div>
          <label htmlFor="titleInput" className="form-label">
            Title
          </label>
          <input
            id="titleInput"
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
        <div className="hstack justify-content-around mt-3">
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
      <form className="mt-1" onSubmit={(e) => handleDescriptionUpdateSubmit(e)} noValidate>
        <div>
          <label htmlFor="descriptionInput" className="form-label">
            Description
          </label>
          <input
            id="descriptionInput"
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
        <div className="hstack justify-content-around mt-3">
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
    </div>
  );
}
