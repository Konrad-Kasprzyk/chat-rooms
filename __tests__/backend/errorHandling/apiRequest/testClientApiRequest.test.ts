import BEFORE_ALL_TIMEOUT from "__tests__/constants/beforeAllTimeout.constant";
import globalBeforeAll from "__tests__/globalBeforeAll";
import APP_URL from "common/constants/appUrl.constant";
import CLIENT_API_URLS from "common/constants/clientApiUrls.constant";
import clientApiUrls from "common/types/clientApiUrls.type";

describe("Test common errors when making a client API request.", () => {
  const clientApiUrl: clientApiUrls = CLIENT_API_URLS.user.changeUserUsername;

  beforeAll(async () => {
    await globalBeforeAll();
  }, BEFORE_ALL_TIMEOUT);

  it("Require the POST method.", async () => {
    const res = await fetch(APP_URL + clientApiUrl);

    expect(res.status).toEqual(405);
  });

  it("Require ContentType in a request.", async () => {
    const res = await fetch(APP_URL + clientApiUrl, {
      method: "POST",
      body: JSON.stringify({ foo: "foo", bar: "bar" }),
    });

    expect(res.status).toEqual(415);
    expect(await res.json()).toEqual("Content-type must be set to application/json.");
  });

  it("Require a body in a request.", async () => {
    const res = await fetch(APP_URL + clientApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("Parsing the body text as JSON error.");
  });

  it("Require a JSON parsed body in a request.", async () => {
    const res = await fetch(APP_URL + clientApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "foo",
    });

    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("Parsing the body text as JSON error.");
  });

  it("The body is not an object.", async () => {
    const res = await fetch(APP_URL + clientApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify("foo"),
    });

    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("Body is not an object or is empty.");
  });

  it("The body is an empty object.", async () => {
    const res = await fetch(APP_URL + clientApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual("Body is not an object or is empty.");
  });
});
