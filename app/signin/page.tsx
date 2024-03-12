"use client";

import signInWithGitHub from "client/api/user/signIn/signInWithGitHub.api";
import signInWithGoogle from "client/api/user/signIn/signInWithGoogle.api";
import MAIN_CONTENT_CLASS_NAME from "client/constants/mainContentClassName.constant";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

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
    <div className={`vstack gap-3 ${MAIN_CONTENT_CLASS_NAME}`}>
      <button
        type="button"
        className="btn btn-primary p-2"
        onClick={() => signInWithGoogle().then(() => push("/rooms"))}
      >
        Sign up with Google
      </button>
      <button
        type="button"
        className="btn btn-primary p-2"
        onClick={() => signInWithGitHub().then(() => push("/rooms"))}
      >
        Sign up with GitHub
      </button>
      <form
        onSubmit={(e) => handleSubmit(e)}
        noValidate
      >
        <div className="mb-3">
          <label
            htmlFor="emailInput"
            className="form-label"
          >
            Email
          </label>
          <input
            id="emailInput"
            type="email"
            className={`form-control ${isEmailValid === true ? "is-valid" : ""} ${
              isEmailValid === false ? "is-invalid" : ""
            }`}
            placeholder="Email"
            aria-describedby="invalidEmailPrompt"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              setIsEmailValid(null);
            }}
          />
          <div
            id="invalidEmailPrompt"
            className="invalid-feedback"
          >
            Please provide a valid email.
          </div>
        </div>
        <div className="mb-3">
          <label
            htmlFor="usernameInput"
            className="form-label"
          >
            Username
          </label>
          <input
            id="usernameInput"
            type="text"
            className={`form-control ${isUsernameValid === true ? "is-valid" : ""} ${
              isUsernameValid === false ? "is-invalid" : ""
            }`}
            placeholder="Username"
            aria-describedby="invalidUsernamePrompt"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
              setIsUsernameValid(null);
            }}
          />
          <div
            id="invalidUsernamePrompt"
            className="invalid-feedback"
          >
            Please provide a username.
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Sign up with Email
        </button>
        <div
          className="alert alert-success"
          role="alert"
        >
          Email send!
        </div>
      </form>
    </div>
  );
}
