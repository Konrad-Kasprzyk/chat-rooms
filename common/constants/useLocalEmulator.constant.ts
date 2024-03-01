const USE_LOCAL_EMULATOR: boolean =
  process.env.NEXT_PUBLIC_USE_LOCAL_EMULATOR === "true" ? true : false;

export default USE_LOCAL_EMULATOR;
