import { HEX_CHARS } from "./constants/hexChars";

export function getNextCounterShortId(
  counterShortId: readonly typeof HEX_CHARS[number][]
): readonly typeof HEX_CHARS[number][] {
  const nextShortId = counterShortId.slice();
  let incrementNextDigit = true;
  let digitIndex = nextShortId.length - 1;
  while (incrementNextDigit) {
    // Highest digit changed from 'f' to '0', so add '1' to beginning of id
    if (digitIndex < 0) {
      nextShortId.unshift("1");
      break;
    }
    // Get decimal value, which is index of hexadecimal symbol in HEX_CHARS
    const currentDigitValue = parseInt(nextShortId[digitIndex], 16);
    // Increment current digit to next hexadecimal symbol
    nextShortId[digitIndex] = HEX_CHARS[(currentDigitValue + 1) % 16];
    // Stop incrementing next digits when current symbol hasn't changed from 'f' to '0'
    if (currentDigitValue !== 15) incrementNextDigit = false;
    digitIndex--;
  }
  return nextShortId;
}

export function getShortIdSubstrings(
  shortId: readonly typeof HEX_CHARS[number][] | string
): string[] {
  const shortIdSubstrings: string[] = [];
  let lastUsedSubstring = "";
  [...shortId].forEach((symbol) => {
    lastUsedSubstring += symbol;
    shortIdSubstrings.push(lastUsedSubstring);
  });
  return shortIdSubstrings;
}

export function getTitleWordSubstrings(title: string): string[] {
  let lastUsedSubstring = "";
  const titleWords = title.trim().split(/\s+/);
  const titleWordsSubstrings: string[] = [];
  titleWords.forEach((word) => {
    lastUsedSubstring = "";
    [...word].forEach((char) => {
      lastUsedSubstring += char;
      titleWordsSubstrings.push(lastUsedSubstring);
    });
  });
  return titleWordsSubstrings;
}
