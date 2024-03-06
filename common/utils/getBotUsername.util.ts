export default function getBotUsername(mainUserUsername: string, botNumber: number) {
  return `#${botNumber + 1} ${mainUserUsername}`;
}
