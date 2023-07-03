import getNextShortId from "common/utils/counterIdsGenerator";

describe("Ids generator works properly", () => {
  it("asserts id is incremented without adding new char", () => {
    const currentId = " ";
    const properNextId = "!";

    const nextId = getNextShortId(currentId);

    expect(nextId).toEqual(properNextId);
  });

  it("asserts id is incremented with adding new char", () => {
    const currentId = "~";
    const properNextId = "  ";

    const nextId = getNextShortId(currentId);

    expect(nextId).toEqual(properNextId);
  });

  it("asserts '\\' id is properly incremented", () => {
    const currentId = "\\";
    const properNextId = "]";

    const nextId = getNextShortId(currentId);

    expect(nextId).toEqual(properNextId);
  });

  it("asserts id is properly incremented into '\\' ", () => {
    const currentId = "[";
    const properNextId = "\\";

    const nextId = getNextShortId(currentId);

    expect(nextId).toEqual(properNextId);
  });

  it("asserts '\"' id is properly incremented", () => {
    const currentId = '"';
    const properNextId = "#";

    const nextId = getNextShortId(currentId);

    expect(nextId).toEqual(properNextId);
  });

  it("asserts id is properly incremented into '\"' ", () => {
    const currentId = "!";
    const properNextId = '"';

    const nextId = getNextShortId(currentId);

    expect(nextId).toEqual(properNextId);
  });

  it("asserts ' id is properly incremented", () => {
    const currentId = "'";
    const properNextId = "(";

    const nextId = getNextShortId(currentId);

    expect(nextId).toEqual(properNextId);
  });

  it("asserts id is properly incremented into ''' ", () => {
    const currentId = "&";
    const properNextId = "'";

    const nextId = getNextShortId(currentId);

    expect(nextId).toEqual(properNextId);
  });

  it("asserts id is incremented when changing middle chars and without adding new char", () => {
    const currentId = "~~~~abc";
    const properNextId = "    bbc";

    const nextId = getNextShortId(currentId);

    expect(nextId).toEqual(properNextId);
  });

  it("asserts id is incremented when changing all chars and adding new char", () => {
    const currentId = "~~~~";
    const properNextId = "     ";

    const nextId = getNextShortId(currentId);

    expect(nextId).toEqual(properNextId);
  });
});
