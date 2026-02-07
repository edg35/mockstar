/**
 * Tests for app/api/applications/route.js
 *
 * Covers:
 *   GET  /api/applications  -- list with filters (userId, status, dateFrom, dateTo)
 *   POST /api/applications  -- create a new application + activity log entry
 */

const { mockDb, mockDbReset, mockDbResult, mockDbError } = require("../../helpers/dbMock");

// Wire the mock before the route module is imported.
jest.mock("@/utils/db", () => ({ db: mockDb }));
jest.mock("drizzle-orm", () => ({
  eq: jest.fn((...args) => ({ type: "eq", args })),
  and: jest.fn((...args) => ({ type: "and", args })),
  gte: jest.fn((...args) => ({ type: "gte", args })),
  lte: jest.fn((...args) => ({ type: "lte", args })),
  desc: jest.fn((col) => ({ type: "desc", col })),
}));
jest.mock("@/utils/schema", () => ({
  JobApplications: {
    id: "id",
    userId: "userId",
    applicationStatus: "applicationStatus",
    dateAdded: "dateAdded",
  },
  ActivityLog: Symbol("ActivityLog"),
}));

const { GET, POST } = require("@/app/api/applications/route");

// ---------- helpers ----------

function makeGetRequest(params = {}) {
  const url = new URL("http://localhost:3000/api/applications");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return new Request(url.toString());
}

function makePostRequest(body) {
  return new Request("http://localhost:3000/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function parseResponse(response) {
  const json = await response.json();
  return { status: response.status, body: json };
}

// ---------- test suites ----------

describe("GET /api/applications", () => {
  beforeEach(() => {
    mockDbReset();
    jest.clearAllMocks();
  });

  it("returns 400 when userId is missing", async () => {
    const res = await GET(makeGetRequest());
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe("userId is required");
  });

  it("returns a list of applications for a valid userId", async () => {
    const apps = [
      { id: 1, companyName: "Acme", jobTitle: "Engineer" },
      { id: 2, companyName: "Globex", jobTitle: "Designer" },
    ];
    mockDbResult(apps);

    const res = await GET(makeGetRequest({ userId: "user_123" }));
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(apps);
    expect(mockDb.select).toHaveBeenCalledTimes(1);
  });

  it("returns an empty array when no applications match", async () => {
    mockDbResult([]);

    const res = await GET(makeGetRequest({ userId: "user_123" }));
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });

  it("passes status filter to drizzle eq() when provided", async () => {
    mockDbResult([]);

    await GET(makeGetRequest({ userId: "user_123", status: "applied" }));

    const { eq } = require("drizzle-orm");
    const statusCalls = eq.mock.calls.filter(
      (call) => call[1] === "applied"
    );
    expect(statusCalls.length).toBe(1);
  });

  it("passes date range filters to drizzle gte()/lte() when provided", async () => {
    mockDbResult([]);

    await GET(
      makeGetRequest({
        userId: "user_123",
        dateFrom: "2024-01-01",
        dateTo: "2024-06-30",
      })
    );

    const { gte, lte } = require("drizzle-orm");
    expect(gte).toHaveBeenCalled();
    expect(lte).toHaveBeenCalled();
  });

  it("returns 500 when the database throws", async () => {
    mockDbError(new Error("connection lost"));

    const res = await GET(makeGetRequest({ userId: "user_123" }));
    const { status, body } = await parseResponse(res);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("connection lost");
  });
});

describe("POST /api/applications", () => {
  beforeEach(() => {
    mockDbReset();
    jest.clearAllMocks();
  });

  it("returns 400 when userId is missing", async () => {
    const res = await POST(
      makePostRequest({ companyName: "Acme", jobTitle: "Engineer" })
    );
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe("userId, companyName, and jobTitle are required");
  });

  it("returns 400 when companyName is missing", async () => {
    const res = await POST(
      makePostRequest({ userId: "user_123", jobTitle: "Engineer" })
    );
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe("userId, companyName, and jobTitle are required");
  });

  it("returns 400 when jobTitle is missing", async () => {
    const res = await POST(
      makePostRequest({ userId: "user_123", companyName: "Acme" })
    );
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe("userId, companyName, and jobTitle are required");
  });

  it("creates an application and logs activity on success", async () => {
    const created = {
      id: 42,
      userId: "user_123",
      companyName: "Acme",
      jobTitle: "Engineer",
      applicationStatus: "wishlist",
    };
    // First db call: insert application (.returning())
    mockDbResult([created]);
    // Second db call: insert activity log
    mockDbResult([{ id: 1 }]);

    const res = await POST(
      makePostRequest({
        userId: "user_123",
        companyName: "Acme",
        jobTitle: "Engineer",
        location: "Remote",
      })
    );
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(created);
    // Two insert calls: JobApplications + ActivityLog
    expect(mockDb.insert).toHaveBeenCalledTimes(2);
  });

  it("returns the created application with default status 'wishlist'", async () => {
    const created = {
      id: 1,
      applicationStatus: "wishlist",
    };
    mockDbResult([created]);
    mockDbResult([{ id: 1 }]);

    const res = await POST(
      makePostRequest({
        userId: "user_123",
        companyName: "Acme",
        jobTitle: "Engineer",
      })
    );
    const { body } = await parseResponse(res);
    expect(body.data.applicationStatus).toBe("wishlist");
  });

  it("returns 500 when the database throws during insert", async () => {
    mockDbError(new Error("unique constraint violated"));

    const res = await POST(
      makePostRequest({
        userId: "user_123",
        companyName: "Acme",
        jobTitle: "Engineer",
      })
    );
    const { status, body } = await parseResponse(res);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("unique constraint violated");
  });
});
