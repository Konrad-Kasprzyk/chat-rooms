"use client";

import createWorkspace from "client/api/workspace/createWorkspace.api";
import linkHandler from "client/utils/components/linkHandler.util";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import styles from "./newRoom.module.scss";

export default function NewRoom() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creatingRoom, setCreatingRoom] = useState<boolean | null>(null);
  const [createdWorkspaceId, setCreatedWorkspaceId] = useState("");
  const createRoomModalButtonRef = useRef<HTMLButtonElement>(null);
  const roomCreatedModalButtonRef = useRef<HTMLButtonElement>(null);
  const { push } = useRouter();

  function handleCreateRoomSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title) {
      setCreatingRoom(false);
      return;
    }
    setCreatingRoom(true);
    createWorkspace(title, description).then((workspaceId) => {
      setCreatedWorkspaceId(workspaceId);
      setTitle("");
      setDescription("");
      setCreatingRoom(null);
      if (createRoomModalButtonRef.current) createRoomModalButtonRef.current.click();
      if (roomCreatedModalButtonRef.current) roomCreatedModalButtonRef.current.click();
    });
  }

  return (
    <div className={`vstack gap-3 justify-content-center`}>
      <button
        type="button"
        className="btn btn-primary mx-auto"
        data-bs-toggle="modal"
        data-bs-target="#createRoomModal"
        ref={createRoomModalButtonRef}
      >
        Create new room
      </button>
      <div
        className="modal fade"
        id="createRoomModal"
        tabIndex={-1}
        aria-labelledby="deleteAccountModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" style={{ marginTop: "10vh" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteAccountModalLabel">
                Create chat room
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => handleCreateRoomSubmit(e)} noValidate>
                <div>
                  <label htmlFor="titleInput" className="form-label">
                    Title
                  </label>
                  <input
                    id="titleInput"
                    type="text"
                    className={`form-control ${creatingRoom === true ? "is-valid" : ""}
                      ${creatingRoom === false ? "is-invalid" : ""}
                      `}
                    placeholder="Title*"
                    value={title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setTitle(e.target.value);
                      setCreatingRoom(null);
                    }}
                  ></input>
                  <div className="invalid-feedback">Please provide a title.</div>
                </div>
                <div className="mt-2">
                  <label htmlFor="descriptionInput" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="descriptionInput"
                    rows={2}
                    className={`form-control ${
                      creatingRoom === true && description ? "is-valid" : ""
                    }`}
                    placeholder="Description"
                    value={description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                      setDescription(e.target.value);
                    }}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-around mt-4">
                  <button type="submit" className={`btn btn-primary ${styles.buttonWidth}`}>
                    {creatingRoom === true ? (
                      <div>
                        Creating
                        <div className="spinner-grow spinner-grow-sm ms-1" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div>Create room</div>
                    )}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary ${styles.buttonWidth}`}
                    onClick={() => {
                      setTitle("");
                      setDescription("");
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary ${styles.buttonWidth}`}
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#roomCreatedModal"
        hidden
        ref={roomCreatedModalButtonRef}
      />
      <div
        className="modal fade"
        id="roomCreatedModal"
        tabIndex={-1}
        aria-labelledby="deleteAccountModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ marginTop: "10vh" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteAccountModalLabel">
                Chat room created
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-footer justify-content-around">
              <a
                role="button"
                href={`/rooms/${createdWorkspaceId}`}
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={linkHandler(`/rooms/${createdWorkspaceId}`, push)}
              >
                Open room
              </a>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
