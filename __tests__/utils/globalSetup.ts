import { createGlobalCounter } from "../../global/admin_utils/globalCounter";

async function globalSetup() {
  await createGlobalCounter();
}

export default globalSetup;
