const USE_LOCAL_EMULATOR: boolean = process.env.VERCEL_ENV == "development" ? true : false;

export default USE_LOCAL_EMULATOR;
