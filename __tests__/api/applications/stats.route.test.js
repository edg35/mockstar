/**
 * Tests for app/api/applications/stats/route.js
 *
 * Covers:
 *   GET /api/applications/stats -- aggregated counts by status, this week, this month
 */

const { mockDb, mockDbReset, mockDbResult, mockDbError } = require("../../helpers/dbMock");

jest.mock("@/utils/db", () => ({ db: mockDb }));
jest.mock("drizzle-orm", () => ({
  eq: jest.fn((...args) => ({ type: "eq", args })),
  and: jest.fn((...args) => ({ type: "and", args })),
  gte: jest.fn((...args) => ({ type: "gte", args })),
  // sql is used as a tagged template literal: sql`count(*)`.
  // Babel compiles tagged templates into a function call, so sql must be callable.
  sql: Object.assign(
    (..._args) => ({
      mapWith: () => "count_expr",
    }),
    {}
  ),
}));
jest.mock("@/utils/schema", () => ({
  JobApplications: {
    userId: "userId",
    applicationStatus: "applicationStatus",
    dateAdded: "dateAdded",
  },
}));

const { GET } = require("@/app/api/applications/stats/route");

// ---------- helpers ----------

function makeRequest(params = {}) {
  const url = new URL("http://localhost:3000/api/applications/stats");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return new Request(url.toString());
}

async function parseResponse(response) {
  const json = await response.json();
  return { status: response.status, body: json };
}

// ---------- tests ----------

describe("GET /api/applications/stats", () => {
  beforeEach(() => {
    mockDbReset();
  });

  it("returns 400 when userId is missing", async () => {
    const res = await GET(makeRequest());
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe("userId is required");
  });

  it("returns aggregated stats on success", async () => {
    // The route does Promise.all with 3 select queries:
    // 1. status counts (grouped)
    // 2. week count
    // 3. month count
    mockDbResult([
      { status: "wishlist", count: 5 },
      { status: "applied", count: 3 },
      { status: "interviewing", count: 2 },
    ]);
    mockDbResult([{ count: 4 }]);
    mockDbResult([{ count: 8 }]);

    const res = await GET(makeRequest({ userId: "user_123" }));
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.total).toBe(10);
    expect(body.data.byStatus).toEqual({
      wishlist: 5,
      applied: 3,
      interviewing: 2,
    });
    expect(body.data.thisWeek).toBe(4);
    expect(body.data.thisMonth).toBe(8);
  });

  it("returns zero totals when user has no applications", async () => {
    mockDbResult([]);             // no status groups
    mockDbResult([{ count: 0 }]); // week
    mockDbResult([{ count: 0 }]); // month

    const res = await GET(makeRequest({ userId: "user_new" }));
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.total).toBe(0);
    expect(body.data.byStatus).toEqual({});
    expect(body.data.thisWeek).toBe(0);
    expect(body.data.thisMonth).toBe(0);
  });

  it("computes total as the sum of all status counts", async () => {
    mockDbResult([
      { status: "rejected", count: 10 },
      { status: "offered", count: 1 },
    ]);
    mockDbResult([{ count: 2 }]);
    mockDbResult([{ count: 5 }]);

    const res = await GET(makeRequest({ userId: "user_123" }));
    const { body } = await parseResponse(res);

    expect(body.data.total).toBe(11);
    expect(body.data.byStatus.rejected).toBe(10);
    expect(body.data.byStatus.offered).toBe(1);
  });

  it("returns 500 when the database throws", async () => {
    mockDbError(new Error("query failed"));

    const res = await GET(makeRequest({ userId: "user_123" }));
    const { status, body } = await parseResponse(res);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("query failed");
  });

  it("calls db.select three times for the parallel queries", async () => {
    mockDbResult([]);
    mockDbResult([{ count: 0 }]);
    mockDbResult([{ count: 0 }]);

    await GET(makeRequest({ userId: "user_123" }));

    expect(mockDb.select).toHaveBeenCalledTimes(3);
  });
});
