/**
 * Shared database mock for all API route tests.
 *
 * Provides a chainable mock that mirrors drizzle-orm's query builder pattern:
 *   db.select().from().where().orderBy().groupBy()
 *   db.insert().values().returning()
 *   db.update().set().where().returning()
 *   db.delete().where().returning()
 *
 * Supports queuing multiple results for routes that make several db calls
 * (e.g., POST creates an application then inserts an activity log).
 *
 * NOTE: The exported variable is named `mockDb` (not `db`) so it can be used
 * inside jest.mock() factory functions, which only allow variables prefixed
 * with "mock".
 */

// Queue of results. Each call to `await` on a chain pops the next result.
let resultQueue = [];
// Default result when the queue is empty.
let defaultResult = [];

/**
 * Build a chainable + thenable proxy.
 * Every method call (from/where/orderBy/set/values/returning/groupBy) returns
 * another chainable. When awaited, it dequeues the next result.
 */
function chainable() {
  const handler = {
    get(_target, prop) {
      if (prop === "then") {
        // Pop next queued result or use default
        const entry = resultQueue.length > 0 ? resultQueue.shift() : { value: defaultResult };
        if (entry.error) {
          return (resolve, reject) => reject(entry.error);
        }
        return (resolve, _reject) => resolve(entry.value);
      }
      // Every other access returns a callable that returns a new chainable
      return (..._args) => new Proxy({}, handler);
    },
  };
  return new Proxy({}, handler);
}

const mockDb = {
  select: jest.fn(() => chainable()),
  insert: jest.fn(() => chainable()),
  update: jest.fn(() => chainable()),
  delete: jest.fn(() => chainable()),
};

/**
 * Reset the mock to a clean state. Call in beforeEach.
 */
function mockDbReset() {
  resultQueue = [];
  defaultResult = [];
  mockDb.select.mockClear();
  mockDb.insert.mockClear();
  mockDb.update.mockClear();
  mockDb.delete.mockClear();
  mockDb.select.mockImplementation(() => chainable());
  mockDb.insert.mockImplementation(() => chainable());
  mockDb.update.mockImplementation(() => chainable());
  mockDb.delete.mockImplementation(() => chainable());
}

/**
 * Enqueue a successful result. Results are consumed in FIFO order.
 * Call multiple times for routes that do multiple queries.
 */
function mockDbResult(value) {
  resultQueue.push({ value });
}

/**
 * Enqueue an error. The next awaited chain will reject.
 */
function mockDbError(error) {
  resultQueue.push({ error });
}

module.exports = { mockDb, mockDbReset, mockDbResult, mockDbError };
