/**
 * Increments id containing 32-126 ASCII characters.
 * @returns New id without modifying given current id.
 */
export default function getNextShortId(currentId: string): string {
  const charCodes: number[] = [];
  let increment: boolean = true;
  for (const char of currentId) {
    let charCode = char.charCodeAt(0);
    if (increment) charCode++;
    if (charCode > 126) charCode = 32;
    else increment = false;
    charCodes.push(charCode);
  }
  if (increment) charCodes.push(32);
  return String.fromCharCode(...charCodes);
}
