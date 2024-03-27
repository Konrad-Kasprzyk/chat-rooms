/**
 * Maximum number of records/actions stored in a single history document. When a history document
 * has more than the maximum number of actions, half of its records are split into a newly created
 * history document.
 */
const MAX_HISTORY_RECORDS = 40;

export default MAX_HISTORY_RECORDS;
