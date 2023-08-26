import USER_INIT_VALUES from "common/constants/docsInitValues/userInitValues.constant";
import collections from "common/db/collections.firebase";
import User from "common/models/user.model";
import { and, doc, getDocs, or, query, setDoc, where } from "firebase/firestore";

describe("Test client api changing the current user username", () => {
  let testUser: Readonly<User>;

  beforeAll(async () => {
    // await globalBeforeAll();
    // testUser = (await registerAndCreateTestUserDocuments(1))[0];
  });

  it("Properly changes the current user username to an empty username", async () => {
    const uid = "abc";
    const email = uid + "@normkeeper-testing.api";
    const username = `Testing user`;
    const userModel: User = {
      ...USER_INIT_VALUES,
      ...{
        id: uid,
        shortId: "a",
        email,
        username,
      },
    };
    await setDoc(doc(collections.users, uid), userModel);

    // const userQuery = collections.users
    //   .where("workspaceIds", "array-contains", "1")
    //   .where("workspaceIds", "array-contains", "2")
    //   .where("workspaceIds", "array-contains", "3")
    //   .where("workspaceIds", "array-contains", "4")
    //   .where("workspaceIds", "array-contains", "5")
    //   .where("workspaceIds", "array-contains", "6")
    //   .where("workspaceIds", "array-contains", "7")
    //   .where("workspaceIds", "array-contains", "8")
    //   .where("workspaceIds", "array-contains", "9")
    //   .where("workspaceIds", "array-contains", "10")
    //   .where("workspaceIds", "array-contains", "11")
    //   .where("workspaceIds", "array-contains", "12")
    //   .where("workspaceIds", "array-contains", "13")
    //   .where("email", "==", "aa")
    //   .where("username", "<", "alala");

    // const userQuery = collections.users
    //   .where("workspaceIds", "array-contains-any", [
    //     "0",
    //     "1",
    //     "2",
    //     "3",
    //     "4",
    //     "5",
    //     "6",
    //     "7",
    //     "8",
    //     "9",
    //     "10",
    //     "11",
    //     "12",
    //     "13",
    //     "14",
    //     "15",
    //     "16",
    //     "17",
    //     "18",
    //     "19",
    //     "20",
    //     "21",
    //     "22",
    //     "23",
    //     "24",
    //     "25",
    //     "26",
    //     "27",
    //     "28",
    //     "29",
    //   ])
    //   .where("email", "==", "aa")
    //   .where("username", "<", "alala");

    // const userQuery = collections.users
    //   .where("workspaceIds", "array-contains-any", [
    //     "0",
    //     "1",
    //     "2",
    //     "3",
    //     "4",
    //     "5",
    //     "6",
    //     "7",
    //     "8",
    //     "9",
    //   ])
    //   .where("workspaceIds", "array-contains-any", ["label1", "label2", "label3"]);

    //TODO change task model, change searchKeys field to contain only title substrings, searchId substrings and
    // TODO  ?? priority ??
    const userQuery = query(
      collections.tasks,
      and(
        or(
          where("goal", "==", 1),
          where("goal", "==", 2),
          where("goal", "==", 3),
          where("goal", "==", 4)
        ),
        or(
          where("labels.foo1", "==", true),
          where("labels.foo2", "==", true),
          where("labels.foo3", "==", true),
          where("labels.foo4", "==", true),
          where("labels.foo5", "==", true),
          where("labels.foo6", "==", true),
          where("labels.foo7", "==", true)
        ),
        // where("searchKey.foo", "==", true),
        // where("searchKey.foo1", "==", true),
        // where("searchKey.foo2", "==", true),
        // where("searchKey.foo3", "==", true),
        // where("searchKey.foo4", "==", true),
        // where("searchKey.foo5", "==", true),
        // where("searchKey.foo6", "==", true),
        // where("searchKey.foo7", "==", true),
        // where("searchKey.foo8", "==", true),
        // where("searchKey.foo9", "==", true),
        // where("searchKey.foo10", "==", true),
        where("priorities.low", "==", false),
        where("priorities.medium", "==", true),
        where("priorities.high", "==", true),
        where("priorities.urgent", "==", false)
      )
    );

    const usersSnap = await getDocs(userQuery);
    const users = usersSnap.docs.map((userSnap) => userSnap.data());
    console.log(users);
  });
});
