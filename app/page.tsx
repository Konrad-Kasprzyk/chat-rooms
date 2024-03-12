"use client";

import anonymousSignIn from "client/api/user/signIn/anonymousSignIn.api";
import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import linkHandler from "client/utils/components/linkHandler.util";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import styles from "./home.module.scss";

export default function Home() {
  const [isUserSigned, setIsUserSigned] = useState(false);
  const [username, setUsername] = useState("");
  const [anonymousSignInButtonClicked, setAnonymousSignInButtonClicked] = useState<boolean>(false);
  const { push } = useRouter();

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
    <div
      className="d-flex justify-content-center"
      style={{ marginTop: "20vh" }}
    >
      <div>
        <p className="text-primary mb-0">sample</p>
        <h1 className="text-primary display-2 text-center">Chat Rooms</h1>
        {isUserSigned ? (
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
          <div className="vstack d-flex justify-content-center mt-5">
            <div className="mb-3">
              <input
                type="email"
                className={`form-control ${
                  anonymousSignInButtonClicked === true ? "is-valid" : ""
                }`}
                placeholder="Username*"
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <button
              className={`${styles.mainButton} btn btn-primary mt-3`}
              onClick={() => {
                if (username) {
                  setAnonymousSignInButtonClicked(true);
                  anonymousSignIn(username).then(() => push("/rooms"));
                }
              }}
              disabled={!username || anonymousSignInButtonClicked}
            >
              {anonymousSignInButtonClicked ? (
                <div>
                  Creating account{" "}
                  <div
                    className="spinner-grow spinner-grow-sm ms-1 mb-sm-1"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                "Try without signing"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
