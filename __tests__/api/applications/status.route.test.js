/**
 * Tests for app/api/applications/[applicationId]/status/route.js
 *
 * Covers:
 *   PUT /api/applications/:id/status -- update status + create activity log
 */

const { mockDb, mockDbReset, mockDbResult, mockDbError } = require("../../helpers/dbMock");

jest.mock("@/utils/db", () => ({ db: mockDb }));
jest.mock("drizzle-orm", () => ({
  eq: jest.fn((...args) => ({ type: "eq", args })),
  and: jest.fn((...args) => ({ type: "and", args })),
}));
jest.mock("@/utils/schema", () => ({
  JobApplications: {
    id: "id",
    userId: "userId",
  },
  ActivityLog: Symbol("ActivityLog"),
}));

const { PUT } = require("@/app/api/applications/[applicationId]/status/route");

// ---------- helpers ----------

function makePutRequest(applicationId, body) {
  return {
    request: new Request(
      `http://localhost:3000/api/applications/${applicationId}/status`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    ),
    context: { params: { applicationId: String(applicationId) } },
  };
}

async function parseResponse(response) {
  const json = await response.json();
  return { status: response.status, body: json };
}

// ---------- tests ----------

describe("PUT /api/applications/[applicationId]/status", () => {
  beforeEach(() => {
    mockDbReset();
  });

  it("returns 400 when userId is missing", async () => {
    const { request, context } = makePutRequest(1, { status: "applied" });
    const res = await PUT(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe("userId and status are required");
  });

  it("returns 400 when status is missing", async () => {
    const { request, context } = makePutRequest(1, { userId: "user_123" });
    const res = await PUT(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe("userId and status are required");
  });

  it("returns 400 when both userId and status are missing", async () => {
    const { request, context } = makePutRequest(1, {});
    const res = await PUT(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe("userId and status are required");
  });

  it("returns 404 when application is not found", async () => {
    mockDbResult([]);

    const { request, context } = makePutRequest(999, {
      userId: "user_123",
      status: "applied",
    });
    const res = await PUT(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Application not found");
  });

  it("updates status and creates activity log entry on success", async () => {
    const updated = {
      id: 1,
      applicationStatus: "interviewing",
      userId: "user_123",
    };
    // First: update query returns the updated row
    mockDbResult([updated]);
    // Second: insert activity log
    mockDbResult([{ id: 10 }]);

    const { request, context } = makePutRequest(1, {
      userId: "user_123",
      status: "interviewing",
    });
    const res = await PUT(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(updated);
    expect(mockDb.update).toHaveBeenCalledTimes(1);
    expect(mockDb.insert).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when the database throws during update", async () => {
    mockDbError(new Error("connection refused"));

    const { request, context } = makePutRequest(1, {
      userId: "user_123",
      status: "rejected",
    });
    const res = await PUT(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("connection refused");
  });

  it("returns 500 when activity log insert fails after status update", async () => {
    const updated = { id: 1, applicationStatus: "offered" };
    mockDbResult([updated]);
    mockDbError(new Error("activity log insert failed"));

    const { request, context } = makePutRequest(1, {
      userId: "user_123",
      status: "offered",
    });
    const res = await PUT(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("activity log insert failed");
  });
});
