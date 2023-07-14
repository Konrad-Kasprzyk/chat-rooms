import MockedFirebaseUser from "./mockedFirebaseUser.class";

export default class MockedFirebaseAuth {
  private static _instance: MockedFirebaseAuth;
  private _currentUser: MockedFirebaseUser | null = null;

  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public get currentUser() {
    if (!this._currentUser) return this._currentUser;
    const currentUserExists = MockedFirebaseUser.registeredMockUsers.some(
      (user) => user.uid === this._currentUser?.uid
    );
    if (!currentUserExists) this._currentUser = null;
    return this._currentUser;
  }

  public set currentUser(value: MockedFirebaseUser | null) {
    this._currentUser = value;
  }

  public signOut() {
    this._currentUser = null;
  }
}
