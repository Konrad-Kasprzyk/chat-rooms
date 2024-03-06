"use client";

import changeCurrentUserUsername from "client/api/user/changeCurrentUserUsername.api";
import deleteUserDocumentsAndAccount from "client/api/user/deleteUserDocumentsAndAccount.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import getMainUserEmail from "common/utils/getMainUserEmail.util";
import getMainUserId from "common/utils/getMainUserId.util";
import getMainUserUsername from "common/utils/getMainUserUsername.util";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Stack from "react-bootstrap/esm/Stack";

export default function Account() {
  const [deleteAccountButtonClicked, setDeleteAccountButtonClicked] = useState(false);
  const [userId, setUserId] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
  const { push } = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentUsername == newUsername) return;
    if (newUsername) setIsUsernameValid(true);
    else setIsUsernameValid(false);
    changeCurrentUserUsername(newUsername);
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
        if (currentUsername != mainUserUsername) setCurrentUsername(mainUserUsername);
        if (email != mainUserEmail) setEmail(mainUserEmail);
      }
    });
    return () => {
      signedInUserSubscription.unsubscribe();
    };
  }, [userId, currentUsername, email]);

  return (
    <Stack gap={3}>
      <div>email: {email}</div>
      <Form noValidate onSubmit={(e) => handleSubmit(e)}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            placeholder="Username"
            defaultValue={currentUsername}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewUsername(e.target.value);
              setIsUsernameValid(null);
            }}
            isValid={isUsernameValid === true}
            isInvalid={isUsernameValid === false}
          />
          <Form.Control.Feedback type="invalid">Please provide a username</Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          disabled={!newUsername || newUsername == currentUsername || isUsernameValid === true}
        >
          Change username
        </Button>
        {isUsernameValid === true ? <Alert variant="success">Username updated</Alert> : null}
      </Form>
      <Button
        variant="danger"
        disabled={deleteAccountButtonClicked}
        onClick={() => {
          deleteUserDocumentsAndAccount().then(() => push("/"));
          setDeleteAccountButtonClicked(true);
        }}
      >
        Delete account
      </Button>
    </Stack>
  );
}
