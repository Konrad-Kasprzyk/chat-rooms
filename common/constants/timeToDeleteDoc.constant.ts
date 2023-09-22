/**
 * Remember to clear the indexedDB cache if it contains documents that have not been modified
 * by the DAYS_TO_DELETE_DOC time. Some documents may be deleted, and the client cannot get the
 * document deletion changes without fetching all documents. But the client can retrieve the
 * modified documents with the 'is deleted' flag set and delete those documents from the cache.
 */
const DAYS_TO_DELETE_DOC = 14;
