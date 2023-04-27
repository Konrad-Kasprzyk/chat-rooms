import { deleteGlobalCounter } from "../global/utils/admin_utils/globalCounter";

async function globalTeardown() {
  await deleteGlobalCounter();
}

export default globalTeardown;
