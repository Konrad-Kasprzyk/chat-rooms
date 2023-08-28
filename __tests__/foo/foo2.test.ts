import globalBeforeAll from "__tests__/globalBeforeAll";
import registerAndCreateTestUserDocuments from "__tests__/utils/mockUsers/registerAndCreateTestUserDocuments.util";
import { BehaviorSubject } from "rxjs";

describe("Test client api changing the current user username", () => {
  beforeAll(async () => {
    await globalBeforeAll();
    await registerAndCreateTestUserDocuments(1);
  });

  it("Properly changes the current user username to an empty username", async () => {
    const userSubject = new BehaviorSubject<{ name: string } | null>({ name: "mark" });
    // await new Promise((f) => setTimeout(f, 1000));
    let foo = userSubject.asObservable();
    // await new Promise((f) => setTimeout(f, 1000));
    foo.subscribe((obj) => {
      let name = obj ? obj.name : "none";
      console.log(name);
    });
    await new Promise((f) => setTimeout(f, 2000));
    foo.subscribe((obj) => {
      let name = obj ? obj.name : "Bad none";
      console.log(name);
    });
    await new Promise((f) => setTimeout(f, 1000));

    userSubject.next({ name: "Bob" });
  });
});
