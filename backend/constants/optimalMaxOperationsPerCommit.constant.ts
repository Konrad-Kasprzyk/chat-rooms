/**
 * Transactions and batches have a 10MiB limit on data changes (create/update/delete, but not read),
 * where indexes also count. None of the documents in this project will ever exceed 10kB. But just
 * in case, let's keep the maximum operations per commit at 500.
 */
const OPTIMAL_MAX_OPERATIONS_PER_COMMIT = 500;

export default OPTIMAL_MAX_OPERATIONS_PER_COMMIT;
