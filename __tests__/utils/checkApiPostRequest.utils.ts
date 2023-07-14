import APP_URL from "common/constants/appUrl.constant";

export async function requirePostMethod(url: string) {
  const res = await fetch(APP_URL + url);
  expect(res.status).toEqual(405);
}

export async function requireContentTypeInRequest(url: string) {
  const res = await fetch(APP_URL + url, {
    method: "POST",
    body: JSON.stringify({ foo: "foo", baz: "baz", bar: "bar" }),
  });

  expect(res.status).toEqual(415);
}

export async function requireBodyInRequest(url: string) {
  const res = await fetch(APP_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  expect(res.status).toEqual(400);
}
