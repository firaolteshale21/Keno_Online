const request = require("supertest");

const app = require("../src/server");

describe("RTP & Analytics API Tests", () => {
  test("Should return RTP analytics", async () => {
    const res = await request(app).get("/api/game/analytics");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("averageRTP");
    expect(res.body).toHaveProperty("analytics");
  });

  test("Should return Hot & Cold numbers", async () => {
    const res = await request(app).get("/api/game/number-trends");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("hotNumbers");
    expect(res.body).toHaveProperty("coldNumbers");
  });
});
