import USE_LOCAL_EMULATOR from "common/constants/useLocalEmulator.constant";

const APP_URL = USE_LOCAL_EMULATOR ? "http://127.0.0.1:3000/" : process.env.NEXT_PUBLIC_URL;

export default APP_URL;
