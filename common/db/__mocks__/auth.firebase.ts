import mockedAuth from "__tests__/utils/mockUsers/mockedFirebaseAuth.class";
import isLocalEmulator from "common/test_utils/isLocalEmulator.util";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import app from "../app.firebase";

const auth = getAuth(app);

if (isLocalEmulator) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export default mockedAuth.Instance;
