import EMAIL_SUFFIX from "common/constants/emailSuffix.constant";

export default function getBotEmail(botId: string) {
  return `${botId}${EMAIL_SUFFIX}`;
}
