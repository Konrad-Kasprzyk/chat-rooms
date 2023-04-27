import { createGlobalCounter } from "../global/utils/admin_utils/globalCounter";

async function globalSetup() {
  await createGlobalCounter();
}

export default globalSetup;
