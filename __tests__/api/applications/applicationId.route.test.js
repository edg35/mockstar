/**
 * Tests for app/api/applications/[applicationId]/route.js
 *
 * Covers:
 *   GET    /api/applications/:id  -- fetch single application
 *   PUT    /api/applications/:id  -- update application fields
 *   DELETE /api/applications/:id  -- delete application
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
}));

const { GET, PUT, DELETE } = require("@/app/api/applications/[applicationId]/route");

// ---------- helpers ----------

function makeGetRequest(applicationId, params = {}) {
  const url = new URL(`http://localhost:3000/api/applications/${applicationId}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return {
    request: new Request(url.toString()),
    context: { params: { applicationId: String(applicationId) } },
  };
}

function makePutRequest(applicationId, body) {
  return {
    request: new Request(
      `http://localhost:3000/api/applications/${applicationId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    ),
    context: { params: { applicationId: String(applicationId) } },
  };
}

function makeDeleteRequest(applicationId, params = {}) {
  const url = new URL(`http://localhost:3000/api/applications/${applicationId}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return {
    request: new Request(url.toString(), { method: "DELETE" }),
    context: { params: { applicationId: String(applicationId) } },
  };
}

async function parseResponse(response) {
  const json = await response.json();
  return { status: response.status, body: json };
}

// ---------- GET tests ----------

describe("GET /api/applications/[applicationId]", () => {
  beforeEach(() => {
    mockDbReset();
  });

  it("returns 400 when userId is missing", async () => {
    const { request, context } = makeGetRequest(1);
    const res = await GET(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe("userId is required");
  });

  it("returns 404 when application is not found", async () => {
    mockDbResult([]);

    const { request, context } = makeGetRequest(999, { userId: "user_123" });
    const res = await GET(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Application not found");
  });

  it("returns the application when found", async () => {
    const app = { id: 1, companyName: "Acme", jobTitle: "Engineer" };
    mockDbResult([app]);

    const { request, context } = makeGetRequest(1, { userId: "user_123" });
    const res = await GET(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(app);
  });

  it("calls db.select exactly once", async () => {
    mockDbResult([{ id: 1 }]);

    const { request, context } = makeGetRequest(1, { userId: "user_123" });
    await GET(request, context);

    expect(mockDb.select).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when the database throws", async () => {
    mockDbError(new Error("timeout"));

    const { request, context } = makeGetRequest(1, { userId: "user_123" });
    const res = await GET(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("timeout");
  });
});

// ---------- PUT tests ----------

describe("PUT /api/applications/[applicationId]", () => {
  beforeEach(() => {
    mockDbReset();
  });

  it("returns 400 when userId is missing", async () => {
    const { request, context } = makePutRequest(1, { companyName: "NewCo" });
    const res = await PUT(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe("userId is required");
  });

  it("returns 404 when application is not found", async () => {
    mockDbResult([]);

    const { request, context } = makePutRequest(999, {
      userId: "user_123",
      companyName: "NewCo",
    });
    const res = await PUT(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Application not found");
  });

  it("updates and returns the application on success", async () => {
    const updated = {
      id: 1,
      companyName: "NewCo",
      jobTitle: "Engineer",
      userId: "user_123",
    };
    mockDbResult([updated]);

    const { request, context } = makePutRequest(1, {
      userId: "user_123",
      companyName: "NewCo",
    });
    const res = await PUT(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(updated);
    expect(mockDb.update).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when the database throws", async () => {
    mockDbError(new Error("deadlock"));

    const { request, context } = makePutRequest(1, {
      userId: "user_123",
      companyName: "NewCo",
    });
    const res = await PUT(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("deadlock");
  });
});

// ---------- DELETE tests ----------

describe("DELETE /api/applications/[applicationId]", () => {
  beforeEach(() => {
    mockDbReset();
  });

  it("returns 400 when userId is missing", async () => {
    const { request, context } = makeDeleteRequest(1);
    const res = await DELETE(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe("userId is required");
  });

  it("returns 404 when application is not found", async () => {
    mockDbResult([]);

    const { request, context } = makeDeleteRequest(999, { userId: "user_123" });
    const res = await DELETE(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Application not found");
  });

  it("deletes and returns the application on success", async () => {
    const deleted = { id: 1, companyName: "Acme", jobTitle: "Engineer" };
    mockDbResult([deleted]);

    const { request, context } = makeDeleteRequest(1, { userId: "user_123" });
    const res = await DELETE(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(deleted);
    expect(mockDb.delete).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when the database throws", async () => {
    mockDbError(new Error("permission denied"));

    const { request, context } = makeDeleteRequest(1, { userId: "user_123" });
    const res = await DELETE(request, context);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("permission denied");
  });
});
