"use client";

import signInWithGitHub from "client/api/user/signIn/signInWithGitHub.api";
import signInWithGoogle from "client/api/user/signIn/signInWithGoogle.api";
import MAIN_CONTENT_CLASS_NAME from "client/constants/mainContentClassName.constant";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Stack from "react-bootstrap/esm/Stack";

export default function SignIn() {
  // After email is set, disable button to send link. Activate again if user changes email
  const [linkToEmailSent, setLinkToEmailSent] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
  const { push } = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email) setIsEmailValid(true);
    else setIsEmailValid(false);
    if (username) setIsUsernameValid(true);
    else setIsUsernameValid(false);

    console.log(email);
    console.log(username);
  }

  return (
    <Stack gap={3} className={MAIN_CONTENT_CLASS_NAME}>
      <Button className="p-2" onClick={() => signInWithGoogle().then(() => push("/rooms"))}>
        Sign up with Google
      </Button>
      <Button className="p-2" onClick={() => signInWithGitHub().then(() => push("/rooms"))}>
        Sign up with GitHub
      </Button>
      <Form noValidate onSubmit={(e) => handleSubmit(e)}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              setIsEmailValid(null);
            }}
            isValid={isEmailValid === true}
            isInvalid={isEmailValid === false}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="email"
            placeholder="Username"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
              setIsUsernameValid(null);
            }}
            isValid={isUsernameValid === true}
            isInvalid={isUsernameValid === false}
          />
          <Form.Control.Feedback type="invalid">Please provide a username.</Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          Sign up with Email
        </Button>
        <Alert variant="success">Email send!</Alert>
      </Form>
    </Stack>
  );
}
