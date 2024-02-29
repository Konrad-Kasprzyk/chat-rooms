export default class MockedFirebaseUser {
  constructor(
    public uid: string,
    public email: string | null,
    public displayName: string,
    public emailVerified: boolean = true
  ) {}

  public static registeredMockUsers: MockedFirebaseUser[] = [];

  async delete(): Promise<void> {
    const thisUserIndex = MockedFirebaseUser.registeredMockUsers.findIndex(
      (user) => user.uid === this.uid
    );
    if (thisUserIndex > -1) MockedFirebaseUser.registeredMockUsers.splice(thisUserIndex, 1);
  }
}

MockedFirebaseUser.registeredMockUsers;
