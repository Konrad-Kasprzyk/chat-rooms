"use client";

import signInWithGitHub from "client/api/user/signIn/signInWithGitHub.api";
import signInWithGoogle from "client/api/user/signIn/signInWithGoogle.api";
import DEFAULT_HORIZONTAL_ALIGNMENT from "client/constants/defaultHorizontalAlignment.constant";
import { useRouter } from "next/navigation";
import { Github, Google } from "react-bootstrap-icons";
import styles from "./signIn.module.scss";

export default function SignIn() {
  const { push } = useRouter();

  return (
    <div className={`vstack overflow-auto ${DEFAULT_HORIZONTAL_ALIGNMENT}`}>
      <h1 className="text-center fw-semibold text-primary" style={{ marginTop: "10vh" }}>
        Sign in
      </h1>
      <div className="vstack mx-3 mx-sm-4 mx-lg-5" style={{ marginTop: "15vh" }}>
        <button
          type="button"
          className={`${styles.signInButtons} btn btn-primary mb-4 mb-sm-5`}
          onClick={() => signInWithGoogle().then(() => push("/rooms"))}
        >
          Sign in with Google <Google className="ms-1 mb-1" />
        </button>
        <button
          type="button"
          className={`${styles.signInButtons} btn btn-primary`}
          onClick={() => signInWithGitHub().then(() => push("/rooms"))}
        >
          Sign in with GitHub <Github className="ms-1 mb-1" />
        </button>
      </div>
    </div>
  );
}
