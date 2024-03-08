"use client";

import changeCurrentUserUsername from "client/api/user/changeCurrentUserUsername.api";
import deleteUserDocumentsAndAccount from "client/api/user/deleteUserDocumentsAndAccount.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import MAIN_CONTENT_CLASS_NAME from "client/constants/mainContentClassName.constant";
import getMainUserEmail from "common/utils/getMainUserEmail.util";
import getMainUserId from "common/utils/getMainUserId.util";
import getMainUserUsername from "common/utils/getMainUserUsername.util";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Modal from "react-bootstrap/esm/Modal";
import Stack from "react-bootstrap/esm/Stack";

export default function Account() {
  const [deleteAccountButtonClicked, setDeleteAccountButtonClicked] = useState(false);
  const [userId, setUserId] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
  const { push } = useRouter();
  const usernameTextRef = useRef<HTMLSpanElement>(null);
  const usernameButtonRef = useRef<HTMLButtonElement>(null);
  const modalDeleteButtonRef = useRef<HTMLButtonElement>(null);
  const [usernameTextWidth, setUsernameTextWidth] = useState<number | null>(null);
  const [usernameButtonWidth, setUsernameButtonWidth] = useState<number | null>(null);
  const [modalDeleteButtonWidth, setModalDeleteButtonWidth] = useState<number | null>(null);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  function handleUsernameUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentUsername == newUsername) return;
    if (newUsername) setIsUsernameValid(true);
    changeCurrentUserUsername(newUsername);
  }

  useLayoutEffect(() => {
    if (usernameTextRef.current && usernameTextRef.current.offsetWidth != usernameTextWidth)
      setUsernameTextWidth(usernameTextRef.current.offsetWidth);
    if (usernameButtonRef.current && usernameButtonRef.current.offsetWidth != usernameButtonWidth)
      setUsernameButtonWidth(usernameButtonRef.current.offsetWidth);
    if (
      modalDeleteButtonRef.current &&
      modalDeleteButtonRef.current.offsetWidth != modalDeleteButtonWidth
    )
      setModalDeleteButtonWidth(modalDeleteButtonRef.current.offsetWidth);
  }, [usernameTextWidth, usernameButtonWidth, modalDeleteButtonWidth, showDeleteAccountModal]);

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
    <Stack gap={3} className={MAIN_CONTENT_CLASS_NAME}>
      <Form noValidate onSubmit={(e) => handleUsernameUpdateSubmit(e)}>
        <Stack gap={1}>
          <InputGroup className="mb-3">
            <InputGroup.Text style={usernameTextWidth ? { width: `${usernameTextWidth}px` } : {}}>
              Email
            </InputGroup.Text>
            <Form.Control disabled defaultValue={email} />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text ref={usernameTextRef}>Username</InputGroup.Text>
            <Form.Control
              placeholder="Username*"
              value={newUsername}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setNewUsername(e.target.value);
                setIsUsernameValid(null);
              }}
              isValid={isUsernameValid === true}
            />
          </InputGroup>
          {isUsernameValid === true ? (
            <Alert
              variant="success"
              className="mb-3 mx-auto text-center"
              onClose={() => setIsUsernameValid(null)}
              dismissible
            >
              Username updated
            </Alert>
          ) : null}
          <Stack direction="horizontal" className="justify-content-around">
            <Button
              variant="primary"
              type="submit"
              disabled={!newUsername || newUsername == currentUsername || isUsernameValid === true}
              ref={usernameButtonRef}
            >
              Update username
            </Button>
            <Button
              variant="secondary"
              style={usernameButtonWidth ? { width: `${usernameButtonWidth}px` } : {}}
              disabled={!newUsername || newUsername == currentUsername || isUsernameValid === true}
              onClick={() => setNewUsername(currentUsername)}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Form>
      <hr className="mt-5 border-2 border-danger" style={{ opacity: "1" }} />
      <Button
        variant="danger"
        className="mt-1 mx-auto w-50"
        disabled={deleteAccountButtonClicked}
        onClick={() => {
          setShowDeleteAccountModal(true);
        }}
      >
        Delete account
      </Button>
      <Modal
        centered
        show={showDeleteAccountModal}
        onHide={() => {
          setShowDeleteAccountModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Please confirm account deletion</Modal.Title>
        </Modal.Header>
        <Modal.Footer className="justify-content-around">
          <Button
            variant="danger"
            onClick={() => {
              setDeleteAccountButtonClicked(true);
              setShowDeleteAccountModal(false);
              deleteUserDocumentsAndAccount().then(() => push("/"));
            }}
            ref={modalDeleteButtonRef}
          >
            Delete account
          </Button>
          <Button
            variant="secondary"
            style={modalDeleteButtonWidth ? { width: `${modalDeleteButtonWidth}px` } : {}}
            onClick={() => {
              setShowDeleteAccountModal(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Stack>
  );
}
