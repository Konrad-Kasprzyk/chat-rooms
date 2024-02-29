const APP_URL =
  process.env.REMOTE_SERVER && process.env.NEXT_PUBLIC_URL
    ? process.env.NEXT_PUBLIC_URL
    : "http://127.0.0.1:3000/";

export default APP_URL;
