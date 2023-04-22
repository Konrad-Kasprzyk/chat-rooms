import APP_URL from "../constants/url";

export default function fetchPost(apiUrl: string, body: any) {
  return fetch(APP_URL + apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
