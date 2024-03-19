"use client";

import changeCurrentUserUsername from "client/api/user/changeCurrentUserUsername.api";
import deleteUserDocumentsAndAccount from "client/api/user/deleteUserDocumentsAndAccount.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import getMainUserEmail from "common/utils/getMainUserEmail.util";
import getMainUserId from "common/utils/getMainUserId.util";
import getMainUserUsername from "common/utils/getMainUserUsername.util";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./account.module.scss";

export default function Account() {
  const [deleteAccountButtonClicked, setDeleteAccountButtonClicked] = useState(false);
  const [userId, setUserId] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
  const { push } = useRouter();

  function handleUsernameUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedNewUsername = newUsername.trim();
    if (!trimmedNewUsername || currentUsername == trimmedNewUsername) return;
    setIsUsernameValid(true);
    changeCurrentUserUsername(trimmedNewUsername);
  }

  useEffect(() => {
    const signedInUserSubscription = listenCurrentUser().subscribe((user) => {
      if (!user) {
        setUserId("");
        setCurrentUsername("");
        setNewUsername("");
        setEmail("");
      } else {
        const mainUserId = user.isBotUserDocument ? getMainUserId(user.id) : user.id;
        const mainUserUsername = user.isBotUserDocument
          ? getMainUserUsername(user.username)
          : user.username;
        const mainUserEmail = user.isBotUserDocument ? getMainUserEmail(mainUserId) : user.email;
        if (userId != mainUserId) setUserId(mainUserId);
        if (currentUsername != mainUserUsername) {
          setCurrentUsername(mainUserUsername);
          setNewUsername(mainUserUsername);
        }
        if (email != mainUserEmail) setEmail(mainUserEmail);
      }
    });
    return () => {
      signedInUserSubscription.unsubscribe();
    };
  }, [userId, currentUsername, email]);

  return (
    <div className={`vstack overflow-auto gap-3 ${DEFAULT_HORIZONTAL_ALIGNMENT}`}>
      <form
        className="vstack"
        style={{ marginTop: "20vh" }}
        onSubmit={(e) => handleUsernameUpdateSubmit(e)}
        noValidate
      >
        <div className="input-group mb-3">
          <label htmlFor="accountEmailInput" className={`input-group-text ${styles.usernameInput}`}>
            Email
          </label>
          <input id="accountEmailInput" className="form-control" disabled value={email} />
        </div>
        <div className="input-group mb-3">
          <label
            htmlFor="accountUsernameInput"
            className={`input-group-text ${styles.usernameInput}`}
          >
            Username
          </label>
          <input
            id="accountUsernameInput"
            className={`form-control ${isUsernameValid === true ? "is-valid" : ""}`}
            placeholder="Username*"
            value={newUsername}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewUsername(e.target.value);
              setIsUsernameValid(null);
            }}
          />
        </div>
        {isUsernameValid === true ? (
          <div className="alert alert-success mb-3 mx-auto" role="alert">
            Username updated
            <button
              type="button"
              className="btn-close ms-2"
              aria-label="Close"
              onClick={() => setIsUsernameValid(null)}
            />
          </div>
        ) : null}
        <div className="hstack justify-content-around">
          <button
            type="submit"
            className={`btn btn-primary ${styles.usernameButton}`}
            disabled={
              !newUsername.trim() ||
              newUsername.trim() == currentUsername ||
              isUsernameValid === true
                ? true
                : false
            }
          >
            Update username
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${styles.usernameButton}`}
            onClick={() => setNewUsername(currentUsername)}
            disabled={newUsername == currentUsername || isUsernameValid === true ? true : false}
          >
            Cancel
          </button>
        </div>
      </form>
      <hr className="mt-5 border-2 border-danger" style={{ opacity: "1" }} />
      <button
        type="button"
        className="btn btn-danger mt-1 mx-auto w-50"
        data-bs-toggle="modal"
        data-bs-target="#deleteAccountModal"
        disabled={deleteAccountButtonClicked}
      >
        Delete account
        {deleteAccountButtonClicked ? (
          <div className="spinner-border spinner-border-sm text-light ms-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : null}
      </button>
      <div
        className="modal fade"
        id="deleteAccountModal"
        tabIndex={-1}
        aria-labelledby="deleteAccountModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteAccountModalLabel">
                Please confirm account deletion
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-footer justify-content-around">
              <button
                type="button"
                className={`btn btn-danger ${styles.modalDeleteButton}`}
                data-bs-dismiss="modal"
                onClick={() => {
                  setDeleteAccountButtonClicked(true);
                  deleteUserDocumentsAndAccount().then(() => push("/"));
                }}
              >
                Delete account
              </button>
              <button
                type="button"
                className={`btn btn-secondary ${styles.modalDeleteButton}`}
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
