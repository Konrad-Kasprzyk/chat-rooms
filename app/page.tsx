"use client";

import anonymousSignIn from "client/api/user/signIn/anonymousSignIn.api";
import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import linkHandler from "client/utils/components/linkHandler.util";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./home.module.scss";

export default function Home() {
  const [isUserSigned, setIsUserSigned] = useState(false);
  const [username, setUsername] = useState("");
  const [signingAnonymousUser, setSigningAnonymousUser] = useState<boolean | null>(null);
  const { push } = useRouter();

  function handleAnonymousSignInSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setSigningAnonymousUser(false);
      return;
    }
    setSigningAnonymousUser(true);
    anonymousSignIn(trimmedUsername).then(() => push("/rooms"));
  }

  useEffect(() => {
    const signedInUserIdChangesSubscription = listenSignedInUserIdChanges().subscribe((userId) => {
      const isUserIdSet = Boolean(userId);
      if (isUserSigned != isUserIdSet) setIsUserSigned(isUserIdSet);
    });

    const isUserIdSet = Boolean(getSignedInUserId());
    if (isUserSigned != isUserIdSet) setIsUserSigned(isUserIdSet);

    return () => {
      signedInUserIdChangesSubscription.unsubscribe();
    };
  }, [isUserSigned]);

  return (
    <div className="d-flex justify-content-center mb-5" style={{ marginTop: "20vh" }}>
      <div>
        <p className="text-primary mb-0">sample</p>
        <h1 className="text-primary display-2 text-center">Chat Rooms</h1>
        {isUserSigned && !signingAnonymousUser ? (
          <div className="d-flex justify-content-center mt-5">
            <a
              className="btn btn-outline-primary btn-lg"
              role="button"
              href="/rooms"
              onClick={linkHandler("/rooms", push)}
            >
              <strong>Open my rooms</strong>
            </a>
          </div>
        ) : (
          <form
            className="vstack d-flex justify-content-center mt-5 mb-2"
            onSubmit={(e) => handleAnonymousSignInSubmit(e)}
            noValidate
          >
            <input
              id="mainPageEmailInput"
              type="email"
              className={`form-control ${signingAnonymousUser === true ? "is-valid" : ""}
                ${signingAnonymousUser === false ? "is-invalid" : ""}
                `}
              placeholder="Username*"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setUsername(e.target.value);
                setSigningAnonymousUser(null);
              }}
            />
            <div className="invalid-feedback">Please provide a username.</div>
            <button
              type="submit"
              className={`${styles.mainButton} btn btn-primary mt-3`}
              disabled={signingAnonymousUser === true}
            >
              {signingAnonymousUser === true ? (
                <div>
                  Creating account{" "}
                  <div className="spinner-grow spinner-grow-sm ms-1 mb-sm-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                "Try without signing"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
