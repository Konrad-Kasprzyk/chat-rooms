/**
 * Transactions and batches no longer have a limit of 500 operations (create/update/delete, but not read).
 * Now they only have a 10 MB limit on data changes, where indexes also count.
 * But just in case, let's keep it at 500.
 */
const MAX_OPERATIONS_PER_COMMIT = 500;

export default MAX_OPERATIONS_PER_COMMIT;
