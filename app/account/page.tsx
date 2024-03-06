"use client";

import changeCurrentUserUsername from "client/api/user/changeCurrentUserUsername.api";
import deleteUserDocumentsAndAccount from "client/api/user/deleteUserDocumentsAndAccount.api";
import listenCurrentUser from "client/api/user/listenCurrentUser.api";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Stack from "react-bootstrap/esm/Stack";

export default function Account() {
  const [isBotSigned, setIsBotSigned] = useState<boolean | null>(null);
  const [userId, setUserId] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);

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
        setIsBotSigned(null);
      } else {
        if (userId != user.id) setUserId(user.id);
        if (currentUsername != user.username) setCurrentUsername(user.username);
        if (email != user.email) setEmail(user.email);
        if (user.isBotUserDocument && isBotSigned !== true) setIsBotSigned(true);
        if (!user.isBotUserDocument && isBotSigned !== false) setIsBotSigned(false);
      }
    });
    return () => {
      signedInUserSubscription.unsubscribe();
    };
  }, [userId, currentUsername, email, isBotSigned]);

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
        onClick={() => deleteUserDocumentsAndAccount()}
        disabled={isBotSigned !== false}
      >
        Delete account
      </Button>
    </Stack>
  );
}
