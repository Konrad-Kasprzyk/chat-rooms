export default function getBotId(mainUserId: string, botNumber: number) {
  return `bot${botNumber + 1}` + mainUserId;
}
