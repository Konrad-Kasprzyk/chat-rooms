import { deleteGlobalCounter } from "../global/admin_utils/globalCounter";

async function globalTeardown() {
  await deleteGlobalCounter();
}

export default globalTeardown;
