import mockedAuth from "__tests__/utils/mockUsers/mockedFirebaseAuth.class";
import USE_LOCAL_EMULATOR from "common/constants/useLocalEmulator.constant";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import app from "../app.firebase";

const auth = getAuth(app);

if (USE_LOCAL_EMULATOR) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export default mockedAuth.Instance;
