"use client";

import anonymousSignIn from "client/api/user/signIn/anonymousSignIn.api";
import {
  getSignedInUserId,
  listenSignedInUserIdChanges,
} from "client/api/user/signedInUserId.utils";
import BOOTSTRAP_BREAKPOINTS from "client/constants/bootstrapBreakpoints.constant";
import linkHandler from "client/utils/components/linkHandler.util";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Spinner from "react-bootstrap/esm/Spinner";
import Stack from "react-bootstrap/esm/Stack";
import useWindowSize from "./hooks/useWindowSize.hook";

export default function Home() {
  const [isUserSigned, setIsUserSigned] = useState(false);
  const [username, setUsername] = useState("");
  const [anonymousSignInButtonClicked, setAnonymousSignInButtonClicked] = useState<boolean>(false);
  const { width } = useWindowSize();
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
    <div className="d-flex justify-content-center" style={{ marginTop: "20vh" }}>
      <div>
        <p className="text-primary mb-0">sample</p>
        <h1 className="text-primary display-2 text-center">Chat Rooms</h1>
        {isUserSigned ? (
          <div className="d-flex justify-content-center mt-5">
            <Button
              size="lg"
              variant="outline-primary"
              href="/rooms"
              onClick={linkHandler("/rooms", push)}
            >
              <strong>Open my rooms</strong>
            </Button>
          </div>
        ) : (
          <Stack className="d-flex justify-content-center mt-5">
            <Form.Control
              size={width < BOOTSTRAP_BREAKPOINTS.sm ? "sm" : undefined}
              value={username}
              placeholder="Username*"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setUsername(e.target.value);
              }}
              isValid={anonymousSignInButtonClicked}
            />
            <Button
              size={width < BOOTSTRAP_BREAKPOINTS.sm ? undefined : "lg"}
              className="mt-3"
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
                  Creating account <Spinner size="sm" animation="grow" />
                </div>
              ) : (
                "Try without signing"
              )}
            </Button>
          </Stack>
        )}
      </div>
    </div>
  );
}
